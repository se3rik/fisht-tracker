import * as yup from 'yup';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

const createStartDateField = yup
    .string()
    .nullable()
    .defined()
    .default(null)
    .test('not-in-past', 'Дата начала не может быть в прошлом', (value) => {
        if (!value) return true;
        return dayjs(value).startOf('day').isSameOrAfter(dayjs().startOf('day'));
    });

const createDeadlineField = yup
    .string()
    .nullable()
    .defined()
    .default(null)
    .test('not-before-start', 'Дедлайн не может быть раньше даты начала', function (value) {
        if (!value) return true;

        const { startDate } = this.parent;

        if (!startDate) {
            return dayjs(value).startOf('day').isSameOrAfter(dayjs().startOf('day'));
        }

        return dayjs(value).isSameOrAfter(dayjs(startDate));
    });

const updateStartDateField = yup.string().nullable().defined().default(null);

const updateDeadlineField = yup
    .string()
    .nullable()
    .defined()
    .default(null)
    .test('not-before-start', 'Дедлайн не может быть раньше даты начала', function (value) {
        if (!value) return true;

        const { startDate } = this.parent;

        if (!startDate) return true;

        return dayjs(value).isSameOrAfter(dayjs(startDate));
    });

export const createTaskValidationSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(3, 'Необходимо минимум 3 символа'),
    description: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(10, 'Необходимо минимум 10 символов'),
    priority: yup.string().required('Это обязательное поле'),
    executorIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'Выберите хотя бы одного исполнителя')
        .required('Это обязательное поле'),
    answerableId: yup.string().required('Это обязательное поле'),
    initiatorId: yup.string().required('Это обязательное поле'),
    department: yup.string().required('Это обязательное поле'),
    startDate: createStartDateField,
    deadline: createDeadlineField,
});

export const updateTaskValidationSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(3, 'Необходимо минимум 3 символа'),
    description: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(10, 'Необходимо минимум 10 символов'),
    priority: yup.string().required('Это обязательное поле'),
    status: yup.string().required('Это обязательное поле'),
    executorIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'Выберите хотя бы одного исполнителя')
        .required('Это обязательное поле'),
    answerableId: yup.string().required('Это обязательное поле'),
    initiatorId: yup.string().required('Это обязательное поле'),
    department: yup.string().required('Это обязательное поле'),
    startDate: updateStartDateField,
    deadline: updateDeadlineField,
});
