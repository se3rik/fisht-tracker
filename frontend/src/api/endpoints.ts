export const endpoints = {
    auth: {
        login: '/login',
        logout: '/logout',
        refresh: '/refresh',
    },
    profile: {
        getInfo: '/profile',
        updateData: '/updateProfile',
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
