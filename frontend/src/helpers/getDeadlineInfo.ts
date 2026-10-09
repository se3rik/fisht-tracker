import dayjs from 'dayjs';

export type DeadlineUrgency = 'overdue' | 'urgent' | 'normal' | 'none';

export type DeadlineInfo = {
    label: string;
    urgency: DeadlineUrgency;
};

export const getDeadlineInfo = (deadline: string | null | undefined): DeadlineInfo => {
    if (!deadline) {
        return { label: 'Не определен', urgency: 'none' };
    }

    const now = dayjs();
    const target = dayjs(deadline);
    const diffMs = target.diff(now);
    const diffDays = target.startOf('day').diff(now.startOf('day'), 'day');

    if (diffMs < 0) {
        const overdueDays = Math.abs(diffDays);
        return {
            label: `Просрочено на ${overdueDays} ${pluralizeDays(overdueDays)}`,
            urgency: 'overdue',
        };
    }

    if (diffDays === 0) {
        return { label: 'Сегодня', urgency: 'urgent' };
    }

    if (diffDays === 1) {
        return { label: 'Завтра', urgency: 'urgent' };
    }

    return {
        label: `Через ${diffDays} ${pluralizeDays(diffDays)}`,
        urgency: diffDays <= 3 ? 'urgent' : 'normal',
    };
};

const pluralizeDays = (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return 'день';
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'дня';
    return 'дней';
};
