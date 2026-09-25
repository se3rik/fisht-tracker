export const endpoints = {
    auth: {
        login: '/login',
        logout: '/logout',
        refresh: '/refresh',
    },
    profile: {
        getInfo: '/profile',
        updateData: '/updateProfile',
        changePassword: '/profile/password',
    },
    tasks: {
        getAllTasks: '/tasks',
        getTaskById: '/tasks',
    },
    admin: {
        users: {
            base: '/admin/users',
        },
    },
};
