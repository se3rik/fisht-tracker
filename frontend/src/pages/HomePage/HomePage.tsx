import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import styles from './HomePage.module.scss';

export const HomePage = () => {
    return (
        <>
            <section className={styles.pageTitleWrapper}>
                <span className={styles.pageTitle}>Главная страница</span>
            </section>
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
                        <span>Тут пока пусто</span>
                    </AccordionDetails>
                </Accordion>

                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <span>Ждут ответа</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <span>Тут пока пусто</span>
                    </AccordionDetails>
                </Accordion>
            </section>
        </>
    );
};
