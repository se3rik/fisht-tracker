import * as yup from 'yup';

const regExpEmail = new RegExp(/^\S+@\S+\.\S+$/);

export const signInValidationSchema = yup.object().shape({
    email: yup.string().trim().required('Это обязательное поле'),
    password: yup.string().trim().required('Это обязательное поле'),
});

export const signUpValidationSchema = yup.object().shape({
    email: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .matches(regExpEmail, 'Неверный формат почты'),
    firstName: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(2, 'Необходимо минимум 2 символа'),
    secondName: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(2, 'Необходимо минимум 2 символа'),
    password: yup
        .string()
        .trim()
        .required('Это обязательное поле')
        .min(6, 'Необходимо минимум 6 символов'),
});
