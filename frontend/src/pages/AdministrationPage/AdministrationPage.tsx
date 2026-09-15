// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Avatar,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import styles from './AdministrationPage.module.scss';

import { PageHeading } from '@/components/pageHeading/PageHeading';
import { BaseTabs } from '@/components/tabs/BaseTabs';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';

import type { TabValue } from '@/types/tabs/TabValue';

import { TABS } from '@/constants/administrationTabs';
import { taskDepartments } from '@/constants/taskDepartments';

// ==== моковые данные ====

const roleLabels = {
    admin: 'Администратор',
    lead: 'Руководитель',
    employee: 'Сотрудник',
};

const roleChipColor = {
    admin: 'primary',
    lead: 'warning',
    employee: 'default',
};

const departments = ['Слаботочные системы', 'Пожарная сигнализация', 'Видеонаблюдение'];

const avatarColors = ['#5c6bd6', '#4a90a4', '#b5804f', '#585e77', '#4b7bec', '#3fae7a'];

const initialUsers = [
    {
        id: '1',
        lastName: 'Рындин',
        firstName: 'Сергей',
        middleName: 'Иванович',
        email: 'se3rik@mail.ru',
        department: 'Слаботочные системы',
        position: 'Ведущий специалист, инженер',
        role: 'admin',
        status: 'active',
    },
    {
        id: '2',
        lastName: 'Сварковский',
        firstName: 'Кирилл',
        middleName: 'Олегович',
        email: 'k.svarkovsky@mail.ru',
        department: 'Слаботочные системы',
        position: 'Инженер',
        role: 'employee',
        status: 'active',
    },
    {
        id: '3',
        lastName: 'Петрова',
        firstName: 'Ольга',
        middleName: 'Николаевна',
        email: 'o.petrova@mail.ru',
        department: 'Пожарная сигнализация',
        position: 'Руководитель отдела',
        role: 'lead',
        status: 'active',
    },
    {
        id: '4',
        lastName: 'Морозов',
        firstName: 'Дмитрий',
        middleName: 'Андреевич',
        email: 'd.morozov@mail.ru',
        department: 'Слаботочные системы',
        position: 'Инженер-проектировщик',
        role: 'employee',
        status: 'blocked',
    },
];

const emptyForm = {
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    department: departments[0],
    position: '',
    role: 'employee',
};

const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
        '',
    );
};

const getInitials = (user) => `${user.lastName[0] ?? ''}${user.firstName[0] ?? ''}`.toUpperCase();

const getAvatarColor = (id) => {
    const hash = [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length];
};

export const AdministrationPage = () => {
    const [activeTab, setActiveTab] = useState<TabValue>('users');
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // { type: 'create' | 'edit' | 'password' | 'delete', user? }
    const [dialog, setDialog] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [tempPassword, setTempPassword] = useState(generatePassword());
    const [forcePasswordReset, setForcePasswordReset] = useState(true);

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();

        return users.filter((user) => {
            const fullName = `${user.lastName} ${user.firstName} ${user.middleName}`.toLowerCase();
            const matchesSearch =
                !query || fullName.includes(query) || user.email.toLowerCase().includes(query);
            const matchesDepartment = !departmentFilter || user.department === departmentFilter;
            const matchesRole = !roleFilter || user.role === roleFilter;
            const matchesStatus = !statusFilter || user.status === statusFilter;

            return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
        });
    }, [users, search, departmentFilter, roleFilter, statusFilter]);

    const hasActiveFilters = Boolean(search || departmentFilter || roleFilter || statusFilter);

    const resetFilters = () => {
        setSearch('');
        setDepartmentFilter('');
        setRoleFilter('');
        setStatusFilter('');
    };

    const openCreateDialog = () => {
        setForm(emptyForm);
        setTempPassword(generatePassword());
        setDialog({ type: 'create' });
    };

    const openEditDialog = (user) => {
        const { id, status, ...rest } = user;
        setForm(rest);
        setDialog({ type: 'edit', user });
    };

    const openPasswordDialog = (user) => {
        setTempPassword(generatePassword());
        setForcePasswordReset(true);
        setDialog({ type: 'password', user });
    };

    const openDeleteDialog = (user) => {
        setDialog({ type: 'delete', user });
    };

    const closeDialog = () => setDialog(null);

    const handleFormChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitForm = () => {
        if (dialog?.type === 'edit') {
            setUsers((prev) =>
                prev.map((user) => (user.id === dialog.user.id ? { ...user, ...form } : user)),
            );
        } else {
            setUsers((prev) => [...prev, { ...form, id: crypto.randomUUID(), status: 'active' }]);
        }
        closeDialog();
    };

    const handleSubmitPassword = () => {
        // здесь будет запрос на смену пароля
        closeDialog();
    };

    const handleConfirmDelete = () => {
        setUsers((prev) => prev.filter((user) => user.id !== dialog.user.id));
        closeDialog();
    };

    const isFormValid = form.lastName && form.firstName && form.email && form.position;

    return (
        <>
            <PageHeading title={'Администрирование'} />
            <section className={styles.pageWrapper}>
                <BaseTabs<TabValue>
                    value={activeTab}
                    onChange={setActiveTab}
                    items={TABS}
                    className={styles.tabs}
                />

                {activeTab !== 'users' && (
                    <Typography variant="body2" color="white">
                        Раздел в разработке
                    </Typography>
                )}

                {activeTab === 'users' && (
                    <>
                        <div className={styles.toolbar}>
                            <BaseInput
                                id="searchUser"
                                type="text"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Поиск по имени или почте"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon
                                                    fontSize="small"
                                                    sx={{ color: 'rgba(255, 255, 255, 0.25)' }}
                                                />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <BaseSelect
                                label="Отдел"
                                value={departmentFilter}
                                menuItems={taskDepartments}
                                onChange={setDepartmentFilter}
                            />

                            {hasActiveFilters && (
                                <Button variant="outlined" onClick={resetFilters}>
                                    Сбросить фильтры
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={openCreateDialog}
                                sx={{ marginLeft: 'auto' }}
                            >
                                Зарегистрировать пользователя
                            </Button>
                        </div>

                        <div className={styles.tableWrapper}>
                            <TableContainer
                                component={Paper}
                                variant="outlined"
                                className={styles.tableContainer}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Сотрудник</TableCell>
                                            <TableCell>Отдел</TableCell>
                                            <TableCell>Должность</TableCell>
                                            <TableCell>Роль</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell align="right">Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow key={user.id} hover>
                                                <TableCell>
                                                    <div className={styles.userCell}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: getAvatarColor(user.id),
                                                            }}
                                                        >
                                                            {getInitials(user)}
                                                        </Avatar>
                                                        <div>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: '#ffffff',
                                                                }}
                                                            >
                                                                {user.lastName} {user.firstName}{' '}
                                                                {user.middleName}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{ color: '#ffffff99' }}
                                                            >
                                                                {user.email}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#ffffffb3' }}
                                                    >
                                                        {user.department}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#ffffffb3' }}
                                                    >
                                                        {user.position}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        variant="outlined"
                                                        color={roleChipColor[user.role]}
                                                        label={roleLabels[user.role]}
                                                        sx={{
                                                            color: '#ffffff',
                                                            borderColor: '#ffffff66',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        size="small"
                                                        variant={
                                                            user.status === 'active'
                                                                ? 'filled'
                                                                : 'outlined'
                                                        }
                                                        color={
                                                            user.status === 'active'
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        label={
                                                            user.status === 'active'
                                                                ? 'Активен'
                                                                : 'Заблокирован'
                                                        }
                                                        sx={{
                                                            color: '#ffffff',
                                                            ...(user.status !== 'active' && {
                                                                borderColor: '#ffffff66',
                                                            }),
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <div className={styles.actions}>
                                                        <Tooltip title="Редактировать">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => openEditDialog(user)}
                                                            >
                                                                <EditOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Сменить пароль">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() =>
                                                                    openPasswordDialog(user)
                                                                }
                                                            >
                                                                <LockResetIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Удалить">
                                                            <IconButton
                                                                size="small"
                                                                color="error"
                                                                onClick={() =>
                                                                    openDeleteDialog(user)
                                                                }
                                                            >
                                                                <DeleteOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredUsers.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    align="center"
                                                    className={styles.emptyCell}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#ffffffb3' }}
                                                    >
                                                        Пользователи не найдены. Попробуйте изменить
                                                        фильтры.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </>
                )}
            </section>

            {/* ==== диалог: создание / редактирование ==== */}
            <Dialog
                open={dialog?.type === 'create' || dialog?.type === 'edit'}
                onClose={closeDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {dialog?.type === 'edit'
                        ? 'Редактирование пользователя'
                        : 'Регистрация пользователя'}
                </DialogTitle>

                <DialogContent className={styles.dialogContent}>
                    <div className={styles.formRow}>
                        <TextField
                            label="Фамилия"
                            value={form.lastName}
                            onChange={(e) => handleFormChange('lastName', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Имя"
                            value={form.firstName}
                            onChange={(e) => handleFormChange('firstName', e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className={styles.formRow}>
                        <TextField
                            label="Отчество"
                            value={form.middleName}
                            onChange={(e) => handleFormChange('middleName', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Роль"
                            value={form.role}
                            onChange={(e) => handleFormChange('role', e.target.value)}
                            fullWidth
                        >
                            {Object.keys(roleLabels).map((role) => (
                                <MenuItem key={role} value={role}>
                                    {roleLabels[role]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <TextField
                        label="Почта"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        fullWidth
                    />

                    <div className={styles.formRow}>
                        <TextField
                            select
                            label="Отдел"
                            value={form.department}
                            onChange={(e) => handleFormChange('department', e.target.value)}
                            fullWidth
                        >
                            {departments.map((department) => (
                                <MenuItem key={department} value={department}>
                                    {department}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Должность"
                            value={form.position}
                            onChange={(e) => handleFormChange('position', e.target.value)}
                            fullWidth
                        />
                    </div>

                    {dialog?.type === 'create' && (
                        <div>
                            <TextField
                                label="Временный пароль"
                                value={tempPassword}
                                fullWidth
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() =>
                                                        setTempPassword(generatePassword())
                                                    }
                                                >
                                                    <RefreshIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                className={styles.hint}
                            >
                                Пользователю нужно будет сменить пароль при первом входе.
                            </Typography>
                        </div>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeDialog}>Отменить</Button>
                    <Button variant="contained" disabled={!isFormValid} onClick={handleSubmitForm}>
                        {dialog?.type === 'edit' ? 'Сохранить изменения' : 'Зарегистрировать'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==== диалог: смена пароля ==== */}
            <Dialog
                open={dialog?.type === 'password'}
                onClose={closeDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Сменить пароль</DialogTitle>
                <DialogContent className={styles.dialogContent}>
                    {dialog?.user && (
                        <Typography variant="caption" color="text.secondary">
                            {dialog.user.lastName} {dialog.user.firstName} {dialog.user.middleName}{' '}
                            · {dialog.user.email}
                        </Typography>
                    )}

                    <TextField
                        label="Новый пароль"
                        value={tempPassword}
                        fullWidth
                        slotProps={{
                            input: {
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setTempPassword(generatePassword())}
                                        >
                                            <RefreshIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <div className={styles.toggleRow}>
                        <Typography variant="body2">Потребовать смену пароля при входе</Typography>
                        <Switch
                            checked={forcePasswordReset}
                            onChange={(e) => setForcePasswordReset(e.target.checked)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Отменить</Button>
                    <Button variant="contained" onClick={handleSubmitPassword}>
                        Сохранить пароль
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==== диалог: удаление ==== */}
            <Dialog open={dialog?.type === 'delete'} onClose={closeDialog} fullWidth maxWidth="xs">
                <DialogTitle>Удалить пользователя</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Вы уверены, что хотите удалить{' '}
                        <b>
                            {dialog?.user?.lastName} {dialog?.user?.firstName}{' '}
                            {dialog?.user?.middleName}
                        </b>
                        ? Пользователь потеряет доступ к системе. Задачи, назначенные на него,
                        останутся в системе, но будут помечены как «без исполнителя».
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Отменить</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Удалить пользователя
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
