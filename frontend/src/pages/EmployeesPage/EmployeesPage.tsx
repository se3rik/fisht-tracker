import { useEffect, useMemo, useState } from 'react';
import {
    Avatar,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import styles from './EmployeesPage.module.scss';

import { usersApi, type DirectoryUser } from '@/api/users.api';
import { PageIntro } from '@/components/pageIntro/PageIntro';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useNotify } from '@/hooks/useNotify';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { SPECIALTY_LABELS } from '@/constants/specialityLabels';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

type DepartmentFilter = TaskDepartmentValues | 'all';

const departmentOptions: { id: number; value: DepartmentFilter; title: string }[] = [
    { id: 0, value: 'all', title: 'Все отделы' },
    ...Object.entries(DEPARTMENT_LABELS).map(([value, title], index) => ({
        id: index + 1,
        value: value as TaskDepartmentValues,
        title,
    })),
];

const leadershipRank: Record<string, number> = {
    HEAD: 0,
    DEPUTY_HEAD: 1,
    SERVICE_CHIEF: 2,
    DEPARTMENT_CHIEF: 3,
    CHIEF_SPECIALIST_AGRONOMIST: 3,
    DEPUTY_DEPARTMENT_CHIEF: 4,
};

const fullName = (user: DirectoryUser) =>
    [user.secondName, user.firstName, user.patronymic].filter(Boolean).join(' ');

const position = (user: DirectoryUser) =>
    user.speciality
        ? (SPECIALTY_LABELS[user.speciality] ?? user.speciality)
        : 'Должность не указана';

const sortPeople = (people: DirectoryUser[]) =>
    [...people].sort((a, b) => {
        const rankA = a.speciality ? (leadershipRank[a.speciality] ?? 10) : 10;
        const rankB = b.speciality ? (leadershipRank[b.speciality] ?? 10) : 10;
        return rankA - rankB || fullName(a).localeCompare(fullName(b), 'ru');
    });

const employeeCountLabel = (count: number) => {
    const lastTwo = count % 100;
    if (lastTwo >= 11 && lastTwo <= 14) return 'сотрудников';
    switch (count % 10) {
        case 1:
            return 'сотрудник';
        case 2:
        case 3:
        case 4:
            return 'сотрудника';
        default:
            return 'сотрудников';
    }
};

export const EmployeesPage = () => {
    const { profileData, isLoading: isProfileLoading } = useAppSelector((state) => state.profile);
    const notify = useNotify();
    const [people, setPeople] = useState<DirectoryUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chosenDepartment, setChosenDepartment] = useState<DepartmentFilter | null>(null);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<DirectoryUser | null>(null);
    const [selectedSpeciality, setSelectedSpeciality] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const openEditDialog = (user: DirectoryUser) => {
        setEditingUser(user);
        setSelectedSpeciality(user.speciality ?? '');
        setSaveError(null);
    };

    const saveSpeciality = async () => {
        if (!editingUser || !selectedSpeciality || isSaving) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            const result = await usersApi.updateEmployeeSpeciality(
                editingUser.id,
                selectedSpeciality,
            );
            setPeople((current) =>
                current.map((user) =>
                    user.id === result.id ? { ...user, speciality: result.speciality } : user,
                ),
            );
            setEditingUser(null);
            notify('success', 'Должность сотрудника обновлена');
        } catch (reason) {
            setSaveError(
                reason instanceof Error ? reason.message : 'Не удалось обновить должность',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const availableSpecialties = editingUser?.editableSpecialties ?? [];
    const specialityOptions = availableSpecialties.map((value, index) => ({
        id: index,
        value,
        title: SPECIALTY_LABELS[value] ?? value,
    }));

    useEffect(() => {
        let active = true;
        usersApi
            .getDirectoryUsers()
            .then((users) => {
                if (active) setPeople(users);
            })
            .catch((reason: unknown) => {
                if (active)
                    setError(
                        reason instanceof Error
                            ? reason.message
                            : 'Не удалось загрузить сотрудников',
                    );
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const myDepartment = profileData?.department ?? null;
    const department = chosenDepartment ?? myDepartment ?? 'all';
    const normalizedSearch = search.trim().toLocaleLowerCase('ru');

    const visiblePeople = useMemo(
        () =>
            people.filter((user) => {
                if (department !== 'all' && user.department !== department) return false;
                if (!normalizedSearch) return true;
                const departmentName = user.department ? DEPARTMENT_LABELS[user.department] : '';
                return [fullName(user), position(user), departmentName]
                    .join(' ')
                    .toLocaleLowerCase('ru')
                    .includes(normalizedSearch);
            }),
        [people, department, normalizedSearch],
    );

    const groups = useMemo(() => {
        const codes = department === 'all' ? Object.keys(DEPARTMENT_LABELS) : [department];
        const result: { key: string; title: string; members: DirectoryUser[] }[] = codes
            .map((code) => ({
                key: code,
                title: DEPARTMENT_LABELS[code as TaskDepartmentValues],
                members: sortPeople(visiblePeople.filter((user) => user.department === code)),
            }))
            .filter((group) => group.members.length > 0);
        if (department === 'all') {
            const withoutDepartment = sortPeople(visiblePeople.filter((user) => !user.department));
            if (withoutDepartment.length) {
                result.push({ key: 'none', title: 'Без отдела', members: withoutDepartment });
            }
        }
        return result;
    }, [department, visiblePeople]);

    return (
        <>
            <section className={styles.page}>
                <PageIntro
                    eyebrow="Справочник сотрудников"
                    title={department === 'all' ? 'Все отделы' : DEPARTMENT_LABELS[department]}
                    description="Узнайте, кто работает в вашем отделе, и найдите коллег из других подразделений."
                    action={
                        <div className={styles.count}>
                            <GroupsRoundedIcon />
                            <strong>{visiblePeople.length}</strong>
                            <span>{employeeCountLabel(visiblePeople.length)}</span>
                        </div>
                    }
                />

                <div className={styles.filters}>
                    <BaseInput
                        size="small"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Поиск по имени или должности"
                        aria-label="Поиск сотрудников"
                        className={styles.search}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <div className={styles.departmentSelect}>
                        <BaseSelect
                            id="employees-department"
                            label="Отдел"
                            fullWidth
                            value={department}
                            menuItems={departmentOptions}
                            onChange={setChosenDepartment}
                        />
                    </div>
                    {myDepartment && department !== myDepartment && (
                        <Button variant="outlined" onClick={() => setChosenDepartment(null)}>
                            Вернуться к моему отделу
                        </Button>
                    )}
                </div>

                {!isProfileLoading && !myDepartment && !chosenDepartment && (
                    <p className={styles.hint}>
                        В вашем профиле не указан отдел, поэтому показаны все сотрудники.
                    </p>
                )}

                {isLoading || (isProfileLoading && !profileData) ? (
                    <div className={styles.state}>
                        <CircularProgress size={30} />
                        <span>Загружаем сотрудников…</span>
                    </div>
                ) : error ? (
                    <div className={styles.state} role="alert">
                        {error}
                    </div>
                ) : groups.length === 0 ? (
                    <div className={styles.state}>
                        {search
                            ? 'По вашему запросу сотрудники не найдены.'
                            : department === 'all'
                              ? 'Сотрудники пока не добавлены.'
                              : 'В этом отделе пока нет сотрудников.'}
                    </div>
                ) : (
                    <div className={styles.groups}>
                        {groups.map((group) => (
                            <section className={styles.group} key={group.key}>
                                <div className={styles.groupHeading}>
                                    <h2>{group.title}</h2>
                                    <span>{group.members.length}</span>
                                </div>
                                <div className={styles.grid}>
                                    {group.members.map((user) => {
                                        const leader =
                                            user.speciality &&
                                            leadershipRank[user.speciality] !== undefined;
                                        return (
                                            <article className={styles.card} key={user.id}>
                                                <Avatar className={styles.avatar}>
                                                    {user.firstName.charAt(0)}
                                                    {user.secondName.charAt(0)}
                                                </Avatar>
                                                <div className={styles.person}>
                                                    <div className={styles.personHeading}>
                                                        <h3>{fullName(user)}</h3>
                                                        {user.id === profileData?.id && (
                                                            <span className={styles.you}>Вы</span>
                                                        )}
                                                    </div>
                                                    <p>{position(user)}</p>
                                                    {leader && (
                                                        <span className={styles.leader}>
                                                            Руководство
                                                        </span>
                                                    )}
                                                </div>
                                                {user.editableSpecialties.length > 0 && (
                                                    <Button
                                                        className={styles.editButton}
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={() => openEditDialog(user)}
                                                    >
                                                        Изменить должность
                                                    </Button>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </section>
            <Dialog
                open={!!editingUser}
                onClose={isSaving ? undefined : () => setEditingUser(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Изменить должность</DialogTitle>
                <DialogContent className={styles.editDialogContent}>
                    <p>{editingUser ? fullName(editingUser) : ''}</p>
                    <BaseSelect
                        id="employee-speciality"
                        label="Новая должность"
                        fullWidth
                        value={selectedSpeciality}
                        menuItems={specialityOptions}
                        onChange={setSelectedSpeciality}
                    />
                    {saveError && (
                        <p className={styles.saveError} role="alert">
                            {saveError}
                        </p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingUser(null)} disabled={isSaving}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={saveSpeciality}
                        disabled={
                            isSaving ||
                            !selectedSpeciality ||
                            selectedSpeciality === editingUser?.speciality
                        }
                    >
                        {isSaving ? 'Сохранение…' : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
