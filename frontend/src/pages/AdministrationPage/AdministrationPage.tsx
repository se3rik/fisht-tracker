import { useState, useEffect } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Switch,
} from '@mui/material';

import styles from './AdministrationPage.module.scss';

import { adminUsersApi } from '@/api';
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from '@/api/api-types/user';

import { PageHeading } from '@/components/pageHeading/PageHeading';
import { BaseTabs } from '@/components/tabs/BaseTabs';
import { BaseInput } from '@/components/ui/BaseInput/BaseInput';
import { BaseSelect } from '@/components/ui/BaseSelect/BaseSelect';

import type { TabValue } from '@/types/tabs/TabValue';

import { TABS } from '@/constants/administrationTabs';
import { taskDepartments } from '@/constants/taskDepartments';
import { DEPARTMENT_LABELS } from '@/constants/departmentsLabels';
import { SPECIALTY_LABELS } from '@/constants/specialityLabels';
import { DEPARTMENT_SPECIALTY_MAP } from '@/constants/departmentSpecialityMap';
import type { TaskDepartmentValues } from '@/types/task/TaskDepartment';

const roleLabels = {
    ADMIN: 'Администратор',
    USER: 'Сотрудник',
};

const emptyCreateForm: CreateUserRequest = {
    email: '',
    firstName: '',
    secondName: '',
    patronymic: '',
    password: '',
    department: undefined,
    specialty: undefined,
    roles: 'USER',
};

const emptyEditForm: UpdateUserRequest = {
    firstName: '',
    secondName: '',
    patronymic: '',
    department: undefined,
    specialty: undefined,
    roles: 'USER',
};

const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join(
        '',
    );
};

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

    // ==== регистрация ====
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createForm, setCreateForm] = useState<CreateUserRequest>(emptyCreateForm);
    const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // ==== редактирование ====
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<UpdateUserRequest>(emptyEditForm);
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    // ==== смена пароля ====
    const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // ==== блокировка ====
    const [blockingUser, setBlockingUser] = useState<AdminUser | null>(null);
    const [isBlockOpen, setIsBlockOpen] = useState(false);
    const [isBlockSubmitting, setIsBlockSubmitting] = useState(false);
    const [blockError, setBlockError] = useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = async () => {
        setIsLoading(true);
        setLoadError(null);

        try {
            const data = await adminUsersApi.getAll({
                search: debouncedSearch || undefined,
                department: departmentFilter || undefined,
                isActive:
                    statusFilter === 'active'
                        ? true
                        : statusFilter === 'blocked'
                          ? false
                          : undefined,
            });

            setUsers(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab !== 'users') return;

        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            setLoadError(null);

            try {
                const data = await adminUsersApi.getAll({
                    search: debouncedSearch || undefined,
                    department: departmentFilter || undefined,
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

        load();

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

    // ==== регистрация: хендлеры ====

    const openCreateDialog = () => {
        setCreateForm({ ...emptyCreateForm, password: generatePassword() });
        setCreateError(null);
        setIsCreateOpen(true);
    };

    const closeCreateDialog = () => setIsCreateOpen(false);

    const handleCreateExited = () => {
        setCreateForm(emptyCreateForm);
        setCreateError(null);
    };

    const handleCreateFormChange = <K extends keyof CreateUserRequest>(
        field: K,
        value: CreateUserRequest[K],
    ) => {
        setCreateForm((prev) => {
            if (field === 'department') {
                return { ...prev, department: value as TaskDepartmentValues, specialty: undefined };
            }
            return { ...prev, [field]: value };
        });
    };

    const createAvailableSpecialties = createForm.department
        ? (DEPARTMENT_SPECIALTY_MAP[createForm.department] ?? [])
        : [];

    const isCreateFormValid =
        createForm.email.trim() &&
        createForm.firstName.trim() &&
        createForm.secondName.trim() &&
        createForm.password.trim().length >= 3;

    const handleSubmitCreate = async () => {
        if (!isCreateFormValid) return;

        setIsCreateSubmitting(true);
        setCreateError(null);

        try {
            await adminUsersApi.create({
                ...createForm,
                patronymic: createForm.patronymic || undefined,
            });

            closeCreateDialog();
            await fetchUsers();
        } catch (error) {
            setCreateError((error as Error).message);
        } finally {
            setIsCreateSubmitting(false);
        }
    };

    // ==== редактирование: хендлеры ====

    const openEditDialog = (user: AdminUser) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName,
            secondName: user.secondName,
            patronymic: user.patronymic ?? '',
            department: user.department ?? undefined,
            specialty: user.speciality ?? undefined,
            roles: user.roles,
        });
        setEditError(null);
        setIsEditOpen(true);
    };

    const closeEditDialog = () => setIsEditOpen(false);

    const handleEditExited = () => {
        setEditingUser(null);
        setEditForm(emptyEditForm);
        setEditError(null);
    };

    const handleEditFormChange = <K extends keyof UpdateUserRequest>(
        field: K,
        value: UpdateUserRequest[K],
    ) => {
        setEditForm((prev) => {
            if (field === 'department') {
                return { ...prev, department: value as TaskDepartmentValues, specialty: undefined };
            }
            return { ...prev, [field]: value };
        });
    };

    const editAvailableSpecialties = editForm.department
        ? (DEPARTMENT_SPECIALTY_MAP[editForm.department] ?? [])
        : [];

    const isEditFormValid = editForm.firstName?.trim() && editForm.secondName?.trim();

    const handleSubmitEdit = async () => {
        if (!editingUser || !isEditFormValid) return;

        setIsEditSubmitting(true);
        setEditError(null);

        try {
            await adminUsersApi.update(editingUser.id, {
                ...editForm,
                patronymic: editForm.patronymic || undefined,
            });

            closeEditDialog();
            await fetchUsers();
        } catch (error) {
            setEditError((error as Error).message);
        } finally {
            setIsEditSubmitting(false);
        }
    };

    // ==== смена пароля: хендлеры ====

    const openPasswordDialog = (user: AdminUser) => {
        setPasswordUser(user);
        setNewPassword(generatePassword());
        setPasswordError(null);
        setIsPasswordOpen(true);
    };

    const closePasswordDialog = () => setIsPasswordOpen(false);

    const handlePasswordExited = () => {
        setPasswordUser(null);
        setNewPassword('');
        setPasswordError(null);
    };

    const isPasswordValid = newPassword.trim().length >= 3;

    const handleSubmitPassword = async () => {
        if (!passwordUser || !isPasswordValid) return;

        setIsPasswordSubmitting(true);
        setPasswordError(null);

        try {
            await adminUsersApi.resetPassword(passwordUser.id, { password: newPassword });
            closePasswordDialog();
        } catch (error) {
            setPasswordError((error as Error).message);
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    // ==== блокировка: хендлеры ====

    const openBlockDialog = (user: AdminUser) => {
        setBlockingUser(user);
        setBlockError(null);
        setIsBlockOpen(true);
    };

    const closeBlockDialog = () => setIsBlockOpen(false);

    const handleBlockExited = () => {
        setBlockingUser(null);
        setBlockError(null);
    };

    const handleConfirmBlock = async () => {
        if (!blockingUser) return;

        setIsBlockSubmitting(true);
        setBlockError(null);

        try {
            await adminUsersApi.block(blockingUser.id);
            closeBlockDialog();
            await fetchUsers();
        } catch (error) {
            setBlockError((error as Error).message);
        } finally {
            setIsBlockSubmitting(false);
        }
    };

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
                                                                    onClick={() =>
                                                                        openEditDialog(user)
                                                                    }
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
                                                            <Tooltip
                                                                title={
                                                                    user.isActive
                                                                        ? 'Заблокировать'
                                                                        : 'Пользователь уже заблокирован'
                                                                }
                                                            >
                                                                <span>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        disabled={!user.isActive}
                                                                        onClick={() =>
                                                                            openBlockDialog(user)
                                                                        }
                                                                    >
                                                                        <DeleteOutlineIcon fontSize="small" />
                                                                    </IconButton>
                                                                </span>
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

            {/* ==== диалог: регистрация пользователя ==== */}
            <Dialog
                open={isCreateOpen}
                onClose={closeCreateDialog}
                fullWidth
                maxWidth="sm"
                slotProps={{ transition: { onExited: handleCreateExited } }}
            >
                <DialogTitle>Регистрация пользователя</DialogTitle>

                <DialogContent className={styles.dialogContent}>
                    <div className={styles.formRow}>
                        <TextField
                            label="Фамилия"
                            value={createForm.secondName}
                            onChange={(e) => handleCreateFormChange('secondName', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Имя"
                            value={createForm.firstName}
                            onChange={(e) => handleCreateFormChange('firstName', e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className={styles.formRow}>
                        <TextField
                            label="Отчество"
                            value={createForm.patronymic}
                            onChange={(e) => handleCreateFormChange('patronymic', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Роль"
                            value={createForm.roles}
                            onChange={(e) =>
                                handleCreateFormChange('roles', e.target.value as 'USER' | 'ADMIN')
                            }
                            fullWidth
                        >
                            {Object.entries(roleLabels).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <TextField
                        label="Почта"
                        type="email"
                        value={createForm.email}
                        onChange={(e) => handleCreateFormChange('email', e.target.value)}
                        fullWidth
                    />

                    <div className={styles.formRow}>
                        <TextField
                            select
                            label="Отдел"
                            value={createForm.department ?? ''}
                            onChange={(e) =>
                                handleCreateFormChange(
                                    'department',
                                    e.target.value as TaskDepartmentValues,
                                )
                            }
                            fullWidth
                        >
                            {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Должность"
                            value={createForm.specialty ?? ''}
                            onChange={(e) => handleCreateFormChange('specialty', e.target.value)}
                            disabled={!createForm.department}
                            fullWidth
                        >
                            {createAvailableSpecialties.map((value) => (
                                <MenuItem key={value} value={value}>
                                    {SPECIALTY_LABELS[value]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div>
                        <TextField
                            label="Временный пароль"
                            value={createForm.password}
                            onChange={(e) => handleCreateFormChange('password', e.target.value)}
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() =>
                                                    handleCreateFormChange(
                                                        'password',
                                                        generatePassword(),
                                                    )
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

                    {createError && (
                        <Typography variant="body2" color="error">
                            {createError}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeCreateDialog} disabled={isCreateSubmitting}>
                        Отменить
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isCreateFormValid || isCreateSubmitting}
                        onClick={handleSubmitCreate}
                    >
                        {isCreateSubmitting ? 'Регистрация...' : 'Зарегистрировать'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==== диалог: редактирование пользователя ==== */}
            <Dialog
                open={isEditOpen}
                onClose={closeEditDialog}
                fullWidth
                maxWidth="sm"
                slotProps={{ transition: { onExited: handleEditExited } }}
            >
                <DialogTitle>Редактирование пользователя</DialogTitle>

                <DialogContent className={styles.dialogContent}>
                    {editingUser && (
                        <Typography variant="caption" color="text.secondary">
                            {editingUser.email}
                        </Typography>
                    )}

                    <div className={styles.formRow}>
                        <TextField
                            label="Фамилия"
                            value={editForm.secondName}
                            onChange={(e) => handleEditFormChange('secondName', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Имя"
                            value={editForm.firstName}
                            onChange={(e) => handleEditFormChange('firstName', e.target.value)}
                            fullWidth
                        />
                    </div>

                    <div className={styles.formRow}>
                        <TextField
                            label="Отчество"
                            value={editForm.patronymic}
                            onChange={(e) => handleEditFormChange('patronymic', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Роль"
                            value={editForm.roles}
                            onChange={(e) =>
                                handleEditFormChange('roles', e.target.value as 'USER' | 'ADMIN')
                            }
                            fullWidth
                        >
                            {Object.entries(roleLabels).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    <div className={styles.formRow}>
                        <TextField
                            select
                            label="Отдел"
                            value={editForm.department ?? ''}
                            onChange={(e) =>
                                handleEditFormChange(
                                    'department',
                                    e.target.value as TaskDepartmentValues,
                                )
                            }
                            fullWidth
                        >
                            {Object.entries(DEPARTMENT_LABELS).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Должность"
                            value={editForm.specialty ?? ''}
                            onChange={(e) => handleEditFormChange('specialty', e.target.value)}
                            disabled={!editForm.department}
                            fullWidth
                        >
                            {editAvailableSpecialties.map((value) => (
                                <MenuItem key={value} value={value}>
                                    {SPECIALTY_LABELS[value]}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>

                    {editError && (
                        <Typography variant="body2" color="error">
                            {editError}
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeEditDialog} disabled={isEditSubmitting}>
                        Отменить
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isEditFormValid || isEditSubmitting}
                        onClick={handleSubmitEdit}
                    >
                        {isEditSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==== диалог: смена пароля ==== */}
            <Dialog
                open={isPasswordOpen}
                onClose={closePasswordDialog}
                fullWidth
                maxWidth="xs"
                slotProps={{ transition: { onExited: handlePasswordExited } }}
            >
                <DialogTitle>Сменить пароль</DialogTitle>
                <DialogContent className={styles.dialogContent}>
                    {passwordUser && (
                        <Typography variant="caption" color="text.secondary">
                            {passwordUser.secondName} {passwordUser.firstName}{' '}
                            {passwordUser.patronymic ?? ''} · {passwordUser.email}
                        </Typography>
                    )}

                    <TextField
                        label="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setNewPassword(generatePassword())}
                                        >
                                            <RefreshIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {passwordError && (
                        <Typography variant="body2" color="error">
                            {passwordError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closePasswordDialog} disabled={isPasswordSubmitting}>
                        Отменить
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!isPasswordValid || isPasswordSubmitting}
                        onClick={handleSubmitPassword}
                    >
                        {isPasswordSubmitting ? 'Сохранение...' : 'Сохранить пароль'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==== диалог: блокировка ==== */}
            <Dialog
                open={isBlockOpen}
                onClose={closeBlockDialog}
                fullWidth
                maxWidth="xs"
                slotProps={{ transition: { onExited: handleBlockExited } }}
            >
                <DialogTitle>Заблокировать пользователя</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Вы уверены, что хотите заблокировать{' '}
                        <b>
                            {blockingUser?.secondName} {blockingUser?.firstName}{' '}
                            {blockingUser?.patronymic ?? ''}
                        </b>
                        ? Пользователь потеряет доступ к системе.
                    </Typography>

                    {blockError && (
                        <Typography variant="body2" color="error" sx={{ marginTop: '12px' }}>
                            {blockError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeBlockDialog} disabled={isBlockSubmitting}>
                        Отменить
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={isBlockSubmitting}
                        onClick={handleConfirmBlock}
                    >
                        {isBlockSubmitting ? 'Блокировка...' : 'Заблокировать пользователя'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
