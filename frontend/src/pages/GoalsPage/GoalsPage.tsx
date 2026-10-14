import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Paper,
    Typography,
} from '@mui/material';

import styles from './GoalsPage.module.scss';

import { goalsApi } from '@/api/goals.api';
import type { Goal, GoalPayload, GoalTask } from '@/api/goals.api';
import { PageIntro } from '@/components/pageIntro/PageIntro';
import { BaseDatePicker } from '@/components/ui/BaseDatePicker/BaseDatePicker';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';
import { BaseTextarea } from '@/components/ui/BaseTextarea/BaseTextarea';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { formatDate } from '@/helpers/formatDate';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useNotify } from '@/hooks/useNotify';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

const statusLabels = { ACTIVE: 'В работе', COMPLETED: 'Достигнута', ARCHIVED: 'Архив' };
const departments = Object.keys(DEPARTMENT_LABELS) as TaskDepartmentValues[];
const departmentItems = departments.map((department, id) => ({
    id,
    value: department,
    title: DEPARTMENT_LABELS[department],
}));
const departmentFilterItems = [
    { id: 0, value: 'all' as const, title: 'Все отделы' },
    ...departmentItems.map((item) => ({ ...item, id: item.id + 1 })),
];
type GoalView = 'CURRENT' | 'ARCHIVED';
const viewItems: { id: number; value: GoalView; title: string }[] = [
    { id: 1, value: 'CURRENT', title: 'Текущие' },
    { id: 2, value: 'ARCHIVED', title: 'Архив' },
];
const statusItems: { id: number; value: Goal['status']; title: string }[] = [
    { id: 1, value: 'ACTIVE', title: 'В работе' },
    { id: 2, value: 'COMPLETED', title: 'Достигнута' },
    { id: 3, value: 'ARCHIVED', title: 'Архив' },
];
const chiefSpecialties = new Set(['DEPARTMENT_CHIEF', 'CHIEF_SPECIALIST_AGRONOMIST']);

const emptyForm = (department: TaskDepartmentValues | null): GoalPayload => ({
    title: '',
    description: '',
    department: department ?? 'AUP',
    deadline: null,
    taskIds: [],
    status: 'ACTIVE',
});

export const GoalsPage = () => {
    const { profileData } = useAppSelector((state) => state.profile);
    const notify = useNotify();
    const isAdmin = profileData?.roles === 'ADMIN';
    const isChief = !!profileData?.speciality && chiefSpecialties.has(profileData.speciality);
    const canCreate = isAdmin || (isChief && !!profileData?.department);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<TaskDepartmentValues | 'all'>(
        'all',
    );
    const [selectedView, setSelectedView] = useState<GoalView>('CURRENT');
    const [editing, setEditing] = useState<Goal | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<GoalPayload>(emptyForm(profileData?.department ?? null));
    const [taskOptions, setTaskOptions] = useState<GoalTask[]>([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ deadline?: string; taskIds?: string }>({});

    const load = async () => {
        try {
            setError(null);
            setGoals(await goalsApi.list());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить цели');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    useEffect(() => {
        if (!dialogOpen) return;
        let active = true;
        setTasksLoading(true);
        goalsApi
            .taskOptions(form.department)
            .then((tasks) => {
                if (active) setTaskOptions(tasks);
            })
            .catch((err: unknown) => {
                if (active)
                    setFormError(
                        err instanceof Error ? err.message : 'Не удалось загрузить задачи',
                    );
            })
            .finally(() => {
                if (active) setTasksLoading(false);
            });
        return () => {
            active = false;
        };
    }, [dialogOpen, form.department]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm(profileData?.department ?? null));
        setFormError(null);
        setFieldErrors({});
        setDialogOpen(true);
    };

    const openEdit = (goal: Goal) => {
        setEditing(goal);
        setForm({
            title: goal.title,
            description: goal.description,
            department: goal.department,
            deadline: goal.deadline,
            status: goal.status,
            taskIds: goal.tasks.map((task) => task.id),
        });
        setFormError(null);
        setFieldErrors({});
        setDialogOpen(true);
    };

    const save = async () => {
        if (!form.title.trim() || !form.description.trim() || saving) return;
        const errors = {
            deadline:
                !form.deadline || !dayjs(form.deadline).isValid() ? 'Укажите срок цели' : undefined,
            taskIds: form.taskIds.length === 0 ? 'Добавьте хотя бы одну задачу' : undefined,
        };
        setFieldErrors(errors);
        if (errors.deadline || errors.taskIds) return;
        setSaving(true);
        setFormError(null);
        try {
            if (editing) await goalsApi.update(editing.id, form);
            else await goalsApi.create(form);
            setDialogOpen(false);
            notify('success', editing ? 'Цель обновлена' : 'Цель создана');
            await load();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Не удалось сохранить цель');
        } finally {
            setSaving(false);
        }
    };

    const archive = async (goal: Goal) => {
        if (!goal.tasks.length || goal.tasks.some((task) => task.status !== 'FINISHED')) {
            notify('error', 'Перенести цель в архив можно только после завершения всех связанных задач');
            return;
        }
        try {
            await goalsApi.update(goal.id, { status: 'ARCHIVED' });
            notify('success', 'Цель перенесена в архив');
            await load();
        } catch (err) {
            notify('error', err instanceof Error ? err.message : 'Не удалось архивировать цель');
        }
    };

    const visibleGoals = goals.filter(
        (goal) =>
            (selectedView === 'CURRENT'
                ? goal.status !== 'ARCHIVED'
                : goal.status === 'ARCHIVED') &&
            (selectedDepartment === 'all' || goal.department === selectedDepartment),
    );
    const canManage = (goal: Goal) =>
        isAdmin || (isChief && profileData?.department === goal.department);

    return (
        <div className={styles.pageWrapper}>
            <PageIntro
                eyebrow="Рабочее пространство"
                title="Цели отделов"
                description="Планы отделов и прогресс по связанным задачам."
                action={
                    canCreate ? (
                        <Button variant="contained" onClick={openCreate}>
                            Создать цель
                        </Button>
                    ) : undefined
                }
            />
            <Box className={styles.toolbar}>
                <BaseSelect
                    label="Раздел"
                    value={selectedView}
                    menuItems={viewItems}
                    onChange={setSelectedView}
                />
                <BaseSelect
                    label="Отдел"
                    value={selectedDepartment}
                    menuItems={departmentFilterItems}
                    onChange={setSelectedDepartment}
                />
            </Box>
            {loading && (
                <Box className={styles.loading}>
                    <CircularProgress />
                </Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && visibleGoals.length === 0 && (
                <Paper className={styles.empty}>
                    {selectedView === 'ARCHIVED'
                        ? 'В архиве целей пока нет.'
                        : 'Текущих целей пока нет.'}
                </Paper>
            )}
            {!loading && !error && (
                <div className={styles.grid}>
                    {visibleGoals.map((goal) => (
                        <Paper key={goal.id} variant="outlined" className={styles.goalCard}>
                            <Box className={styles.cardHeader}>
                                <Typography variant="caption" color="text.secondary">
                                    {DEPARTMENT_LABELS[goal.department]}
                                </Typography>
                                <Chip size="small" label={statusLabels[goal.status]} />
                            </Box>
                            <Typography component="h2" variant="h6" className={styles.goalTitle} title={goal.title}>
                                {goal.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" className={styles.goalDescription} title={goal.description}>
                                {goal.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" className={styles.goalMeta}>
                                {goal.deadline ? `Срок: ${formatDate(goal.deadline)}` : 'Без срока'}{' '}
                                · Создал: {goal.creator.secondName} {goal.creator.firstName}
                            </Typography>
                            <Box className={styles.progress}>
                                <Typography variant="body2">Прогресс: {goal.progress}%</Typography>
                                <LinearProgress variant="determinate" value={goal.progress} />
                                <Typography variant="caption" color="text.secondary">
                                    Завершено{' '}
                                    {goal.tasks.filter((task) => task.status === 'FINISHED').length}{' '}
                                    из {goal.tasks.length} задач
                                </Typography>
                            </Box>
                            <Box className={styles.links}>
                                {goal.tasks.map((task) => (
                                    <Button
                                        key={task.id}
                                        component={Link}
                                        to={`/tasks/${task.id}`}
                                        size="small"
                                        title={task.name}
                                    >
                                        {task.name}
                                    </Button>
                                ))}
                                {goal.tasks.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        Задачи ещё не добавлены
                                    </Typography>
                                )}
                            </Box>
                            {canManage(goal) && (
                                <Box className={styles.actions}>
                                    <Button size="small" onClick={() => openEdit(goal)}>
                                        Изменить
                                    </Button>
                                    {goal.status !== 'ARCHIVED' && (
                                        <Button
                                            size="small"
                                            color="inherit"
                                            onClick={() => archive(goal)}
                                        >
                                            В архив
                                        </Button>
                                    )}
                                </Box>
                            )}
                            {!canManage(goal) && <Box className={styles.actionSpacer} aria-hidden />}
                        </Paper>
                    ))}
                </div>
            )}
            <Dialog
                open={dialogOpen}
                onClose={() => !saving && setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{editing ? 'Изменить цель' : 'Новая цель'}</DialogTitle>
                <DialogContent className={styles.dialogContent}>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    {isAdmin && !editing && (
                        <BaseSelect
                            label="Отдел"
                            value={form.department}
                            menuItems={departmentItems}
                            onChange={(department: TaskDepartmentValues) =>
                                setForm({
                                    ...form,
                                    department,
                                    taskIds: [],
                                })
                            }
                            fullWidth
                        />
                    )}
                    <BaseInput
                        label="Название"
                        value={form.title}
                        required
                        fullWidth
                        inputProps={{ maxLength: 160 }}
                        onChange={(event) => setForm({ ...form, title: event.target.value })}
                    />
                    <Box>
                        <Typography
                            component="label"
                            variant="body2"
                            sx={{ display: 'block', mb: 1 }}
                        >
                            Описание *
                        </Typography>
                        <BaseTextarea
                            placeholder="Опишите результат, которого нужно достичь"
                            value={form.description}
                            required
                            minRows={3}
                            maxLength={3000}
                            onChange={(event) =>
                                setForm({ ...form, description: event.target.value })
                            }
                        />
                    </Box>
                    <Box className={styles.dateField}>
                        <BaseDatePicker
                            label="Срок *"
                            value={form.deadline ? dayjs(form.deadline) : null}
                            minDate={editing ? undefined : dayjs().startOf('day')}
                            onChange={(value) => {
                                setForm({
                                    ...form,
                                    deadline: value?.isValid() ? value.toISOString() : null,
                                });
                                setFieldErrors((current) => ({ ...current, deadline: undefined }));
                            }}
                        />
                        {fieldErrors.deadline && (
                            <Typography color="error" variant="caption">
                                {fieldErrors.deadline}
                            </Typography>
                        )}
                    </Box>
                    {editing && (
                        <BaseSelect
                            label="Статус"
                            value={form.status}
                            menuItems={statusItems.filter(
                                (item) => item.value !== 'ARCHIVED' || editing.status === 'ARCHIVED',
                            )}
                            fullWidth
                            onChange={(status: Goal['status']) =>
                                setForm({
                                    ...form,
                                    status,
                                })
                            }
                        />
                    )}
                    <Autocomplete
                        className={styles.taskAutocomplete}
                        multiple
                        options={taskOptions}
                        loading={tasksLoading}
                        value={taskOptions.filter((task) => form.taskIds.includes(task.id))}
                        getOptionLabel={(task) => task.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(_, values) => {
                            setForm({ ...form, taskIds: values.map((task) => task.id) });
                            setFieldErrors((current) => ({ ...current, taskIds: undefined }));
                        }}
                        renderTags={(values, getTagProps) =>
                            values.map((task, index) => {
                                const { key, ...tagProps } = getTagProps({ index });
                                return (
                                    <Chip
                                        key={key}
                                        {...tagProps}
                                        label={task.name}
                                        title={task.name}
                                    />
                                );
                            })
                        }
                        renderInput={(params) => (
                            <BaseInput
                                {...params}
                                label="Связанные задачи *"
                                placeholder="Выберите задачи отдела"
                                error={!!fieldErrors.taskIds}
                                helperText={fieldErrors.taskIds}
                                sx={{ '& .MuiOutlinedInput-root': { minWidth: 0 } }}
                            />
                        )}
                        slotProps={{
                            paper: { sx: { '& .MuiAutocomplete-option': { overflowWrap: 'anywhere' } } },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        Прогресс рассчитывается по задачам со статусом «Завершена».
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} disabled={saving}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        onClick={save}
                        disabled={saving || !form.title.trim() || !form.description.trim()}
                    >
                        {saving ? 'Сохранение…' : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
