import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Avatar,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    CircularProgress,
} from '@mui/material';

import styles from './AdministrationPage.module.scss';

import { adminUsersApi } from '@/api';
import type { AdminUser } from '@/api/api-types/user';

import { PageHeading } from '@/components/pageHeading/PageHeading';
import { BaseTabs } from '@/components/tabs/BaseTabs';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';

import type { TabValue } from '@/types/tabs/TabValue';

import { TABS } from '@/constants/administrationTabs';
import { taskDepartments } from '@/constants/taskDepartments';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { SPECIALTY_LABELS } from '@/constants/specialityLabels';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

const roleLabels = {
    ADMIN: 'Администратор',
    USER: 'Сотрудник',
};

// const emptyForm = {
//     lastName: '',
//     firstName: '',
//     middleName: '',
//     email: '',
//     department: departments[0],
//     position: '',
//     role: 'employee',
// };

// const generatePassword = () => {
//     const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
//     return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
//         '',
//     );
// };

const getInitials = (user: AdminUser) =>
    `${user.secondName[0] ?? ''}${user.firstName[0] ?? ''}`.toUpperCase();

export const AdministrationPage = () => {
    const [activeTab, setActiveTab] = useState<TabValue>('users');
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState<TaskDepartmentValues | ''>('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // { type: 'create' | 'edit' | 'password' | 'delete', user? }
    // const [dialog, setDialog] = useState(null);
    // const [isOpen, setIsOpen] = useState(false);
    // const [form, setForm] = useState(emptyForm);
    // const [tempPassword, setTempPassword] = useState(generatePassword());
    // const [forcePasswordReset, setForcePasswordReset] = useState(true);

    // debounce поиска, чтобы не дёргать бэк на каждое нажатие клавиши
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (activeTab !== 'users') return;

        let cancelled = false;

        const fetchUsers = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const data = await adminUsersApi.getAll({
                    search: debouncedSearch || undefined,
                    department: departmentFilter || undefined,
                    // role: roleFilter || undefined,
                    isActive:
                        statusFilter === 'active'
                            ? true
                            : statusFilter === 'blocked'
                              ? false
                              : undefined,
                });

                if (!cancelled) {
                    setUsers(data);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        fetchUsers();

        return () => {
            cancelled = true;
        };
    }, [activeTab, debouncedSearch, departmentFilter, roleFilter, statusFilter]);

    const hasActiveFilters = Boolean(search || departmentFilter || roleFilter || statusFilter);

    const resetFilters = () => {
        setSearch('');
        setDepartmentFilter('');
        setRoleFilter('');
        setStatusFilter('');
    };

    // const openDialog = (type, user = null) => {
    //     setDialog({ type, user });
    //     setIsOpen(true);
    // };

    // const openCreateDialog = () => {
    //     setForm(emptyForm);
    //     setTempPassword(generatePassword());
    //     openDialog('create');
    // };

    // const openEditDialog = (user) => {
    //     const { id, status, ...rest } = user;
    //     setForm(rest);
    //     openDialog('edit', user);
    // };

    // const openPasswordDialog = (user) => {
    //     setTempPassword(generatePassword());
    //     setForcePasswordReset(true);
    //     openDialog('password', user);
    // };

    // const openDeleteDialog = (user) => openDialog('delete', user);

    // const closeDialog = () => setIsOpen(false);

    // const handleExited = () => {
    //     setDialog(null);
    //     setForm(emptyForm);
    //     setTempPassword(generatePassword());
    //     setForcePasswordReset(true);
    // };

    // const handleFormChange = (field, value) => {
    //     setForm((prev) => ({ ...prev, [field]: value }));
    // };

    // const handleSubmitForm = () => {
    //     if (dialog?.type === 'edit') {
    //         setUsers((prev) =>
    //             prev.map((user) => (user.id === dialog.user.id ? { ...user, ...form } : user)),
    //         );
    //     } else {
    //         setUsers((prev) => [...prev, { ...form, id: crypto.randomUUID(), status: 'active' }]);
    //     }
    //     closeDialog();
    // };

    // const handleSubmitPassword = () => {
    //     // здесь будет запрос на смену пароля
    //     closeDialog();
    // };

    // const handleConfirmDelete = () => {
    //     setUsers((prev) => prev.filter((user) => user.id !== dialog.user.id));
    //     closeDialog();
    // };

    // const isFormValid = form.lastName && form.firstName && form.email && form.position;

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
                                // onClick={openCreateDialog}
                                sx={{ marginLeft: 'auto' }}
                            >
                                Зарегистрировать пользователя
                            </Button>
                        </div>

                        {loadError && (
                            <Typography variant="body2" color="error">
                                {loadError}
                            </Typography>
                        )}

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
                                        {isLoading && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    align="center"
                                                    className={styles.emptyCell}
                                                >
                                                    <CircularProgress size={24} />
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {!isLoading &&
                                            users.map((user) => (
                                                <TableRow key={user.id} hover>
                                                    <TableCell>
                                                        <div className={styles.userCell}>
                                                            <Avatar>{getInitials(user)}</Avatar>
                                                            <div>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        color: '#ffffff',
                                                                    }}
                                                                >
                                                                    {user.secondName}{' '}
                                                                    {user.firstName}{' '}
                                                                    {user.patronymic ?? ''}
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
                                                            {user.department
                                                                ? DEPARTMENT_LABELS[user.department]
                                                                : '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: '#ffffffb3' }}
                                                        >
                                                            {user.speciality
                                                                ? SPECIALTY_LABELS[user.speciality]
                                                                : '—'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            size="small"
                                                            variant="outlined"
                                                            color={'default'}
                                                            label={roleLabels[user.roles]}
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
                                                                user.isActive
                                                                    ? 'filled'
                                                                    : 'outlined'
                                                            }
                                                            color={
                                                                user.isActive
                                                                    ? 'success'
                                                                    : 'default'
                                                            }
                                                            label={
                                                                user.isActive
                                                                    ? 'Активен'
                                                                    : 'Заблокирован'
                                                            }
                                                            sx={{
                                                                color: '#ffffff',
                                                                ...(!user.isActive && {
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
                                                                    // onClick={() =>
                                                                    //     openEditDialog(user)
                                                                    // }
                                                                >
                                                                    <EditOutlinedIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Сменить пароль">
                                                                <IconButton
                                                                    size="small"
                                                                    // onClick={() =>
                                                                    //     openPasswordDialog(user)
                                                                    // }
                                                                >
                                                                    <LockResetIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Заблокировать">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    // onClick={() =>
                                                                    //     openDeleteDialog(user)
                                                                    // }
                                                                >
                                                                    <DeleteOutlineIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        {!isLoading && users.length === 0 && (
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
            {/* <Dialog
                open={isOpen && (dialog?.type === 'create' || dialog?.type === 'edit')}
                onClose={closeDialog}
                fullWidth
                maxWidth="sm"
                slotProps={{ transition: { onExited: handleExited } }}
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
                        </div>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeDialog}>Отменить</Button>
                    <Button variant="contained" disabled={!isFormValid} onClick={handleSubmitForm}>
                        {dialog?.type === 'edit' ? 'Сохранить изменения' : 'Зарегистрировать'}
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* ==== диалог: смена пароля ==== */}
            {/* <Dialog
                open={isOpen && dialog?.type === 'password'}
                onClose={closeDialog}
                fullWidth
                maxWidth="xs"
                slotProps={{ transition: { onExited: handleExited } }}
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
            </Dialog> */}

            {/* ==== диалог: Блокировка ==== */}
            {/* <Dialog
                open={isOpen && dialog?.type === 'delete'}
                onClose={closeDialog}
                fullWidth
                maxWidth="xs"
                slotProps={{ transition: { onExited: handleExited } }}
            >
                <DialogTitle>Заблокировать пользователя</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Вы уверены, что хотите заблокировать{' '}
                        <b>
                            {dialog?.user?.lastName} {dialog?.user?.firstName}{' '}
                            {dialog?.user?.middleName}
                        </b>
                        ? Пользователь потеряет доступ к системе.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Отменить</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Заблокировать пользователя
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
};
