export function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: '#5b8cff',
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}
