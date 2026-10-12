import type { Department, Specialty } from '../../generated/prisma/enums.js';

type Assignee = { department: Department | null; speciality: Specialty | null; isActive: boolean };

// The staffing table orders management first, then chief/lead/category specialists and workers.
// Equal positions cannot assign tasks to one another.
export function specialtyRank(specialty: Specialty | null): number | null {
    if (!specialty) return null;
    if (specialty === 'HEAD') return 1;
    if (specialty === 'SERVICE_CHIEF' || specialty === 'DEPARTMENT_CHIEF' || specialty === 'CHIEF_SPECIALIST_AGRONOMIST') return 2;
    if (specialty === 'DEPUTY_HEAD' || specialty === 'DEPUTY_DEPARTMENT_CHIEF') return 3;
    if (specialty.startsWith('CHIEF_SPECIALIST')) return 4;
    if (specialty.startsWith('LEAD_SPECIALIST')) return 5;
    if (specialty.startsWith('SPECIALIST_1')) return 6;
    return 7;
}

export function canAssignTask(sender: Assignee, recipient: Assignee): boolean {
    const senderRank = specialtyRank(sender.speciality);
    const recipientRank = specialtyRank(recipient.speciality);
    return sender.isActive && recipient.isActive && !!sender.department &&
        sender.department === recipient.department && senderRank !== null &&
        recipientRank !== null && senderRank < recipientRank;
}
