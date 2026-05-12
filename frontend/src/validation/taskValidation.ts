import * as yup from 'yup';

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
    executorId: yup.string().required('Это обязательное поле'),
    answerableId: yup.string().required('Это обязательное поле'),
    initiatorId: yup.string().required('Это обязательное поле'),
    department: yup.string().required('Это обязательное поле'),
    startDate: yup.string().nullable().defined().default(null),
    deadline: yup.string().nullable().defined().default(null),
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
    executorId: yup.string().required('Это обязательное поле'),
    answerableId: yup.string().required('Это обязательное поле'),
    initiatorId: yup.string().required('Это обязательное поле'),
    department: yup.string().required('Это обязательное поле'),
    startDate: yup.string().nullable().defined().default(null),
    deadline: yup.string().nullable().defined().default(null),
});
