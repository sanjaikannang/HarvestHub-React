import * as Yup from 'yup';


export const registerValidationSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .required('Full name is required'),

    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(50, 'Password must be less than 50 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
});


// Initial form values
export const initialValues = {
    name: '',
    email: '',
    password: '',
    role: 'user'
};