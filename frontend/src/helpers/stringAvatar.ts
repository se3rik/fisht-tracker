export function stringAvatar(name: string) {
    const initials =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('') || '?';
    return {
        sx: {
            bgcolor: '#405b91',
        },
        children: initials,
    };
}
