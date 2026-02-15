import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styles from './HomePage.module.scss';

import { AccordionTasksList } from '@/components/accordion/AccordionTasksList';
import { PageHeading } from '@/components/ui/PageHeading/PageHeading';

import type { AccordionTask } from '@/types/accordion/AccordionTask';

export const HomePage = () => {
    const mockActiveTasks: AccordionTask[] = [
        {
            id: 1,
            key: 'ОСО',
            title: 'Кастомизировать стили для Аккордеона',
            deadline: '22.01.2026',
        },
        {
            id: 2,
            key: 'ОСО',
            title: 'Отрисовать блоки на главной странице',
            deadline: '22.01.2026',
        },
        { id: 3, key: 'ОСО', title: 'Закончить главную страницу', deadline: '22.01.2026' },
    ];

    const mockPendingTasks: AccordionTask[] = [
        {
            id: 1,
            key: 'ОСО',
            title: 'Кастомизировать стили для Аккордеона',
            deadline: '22.01.2026',
        },
        {
            id: 2,
            key: 'ОСО',
            title: 'Отрисовать блоки на главной странице',
            deadline: '22.01.2026',
        },
    ];

    return (
        <>
            <PageHeading title="Главная страница" />
            <section className={styles.pageWrapper}>
                <Accordion className={styles.heroAccordion} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <span>Добро пожаловать в Fisht Tracker!</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span>
                            Добрый день, Сергей 👋 <br />
                            На данный момент у вас 5 активных задач и 2 ожидают ответа
                        </span>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <span>Активные задачи</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <AccordionTasksList tasksList={mockActiveTasks} />
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <span>Ждут ответа</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <AccordionTasksList tasksList={mockPendingTasks} />
                    </AccordionDetails>
                </Accordion>
            </section>
        </>
    );
};
