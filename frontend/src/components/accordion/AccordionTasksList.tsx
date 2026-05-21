import AssignmentIcon from '@mui/icons-material/Assignment';

import styles from './AccordionTasksList.module.scss';

import type { AccordionTask } from '@/types/accordion/AccordionTask';

type AccordionTasksListProps = {
    tasksList: AccordionTask[];
};

export const AccordionTasksList = ({ tasksList }: AccordionTasksListProps) => {
    return (
        <div className={styles.contentWrapper}>
            <ul className={styles.tasksList}>
                {tasksList.map((task: AccordionTask) => (
                    <li className={styles.taskItem} key={task.id}>
                        <AssignmentIcon
                            className={styles.taskIcon}
                            fontSize="small"
                            sx={{ color: '#aaa9ac' }}
                        />
                        <span className={styles.taskKey}>{task.key}</span>
                        <span className={styles.taskTitle}>{task.title}</span>
                        <span className={styles.taskDeadline}>{task.deadline}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
