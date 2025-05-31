import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import { useDispatch } from 'react-redux';
import { RegisterRequest } from '../../Types/authTypes';
import { setCredentials, setError, setLoading } from '../../State/Slices/authSlice';
import { initialValues, registerValidationSchema } from '../Schema/registerSchema';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { RegisterApi } from '../../Services/authAPI';
import { Spinner } from '../ui/Spinner';
import { ShoppingCart, User } from 'lucide-react';
import Select from '../ui/Select';
import toast from 'react-hot-toast';


interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    role: string;
}

const RegisterLayout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Role options with icons
    const roleOptions = [
        {
            value: 'Farme',
            label: 'Farmer',
            icon: User
        },
        {
            value: 'Buyer',
            label: 'Buyer',
            icon: ShoppingCart
        }
    ];

    // Handle form submission
    const handleSubmit = async (
        values: RegisterFormValues,
        { setSubmitting, setStatus }: FormikHelpers<RegisterFormValues>
    ) => {
        try {
            setIsSubmitting(true);
            dispatch(setLoading(true));
            dispatch(setError(null));

            // Prepare the registration data
            const registerData: RegisterRequest = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role
            };

            // Call the register API
            const result = await RegisterApi(registerData);

            // If registration is successful, store credentials and navigate
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));

            // Show success toast
            toast.success(result.message || 'Registration successful!');

            // Navigate to login page after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 1500); // Small delay to show the toast

        } catch (error: any) {
            console.error('Registration failed:', error);

            const errorMessage = error.message || 'Registration failed. Please try again.';

            // Show error toast
            toast.error(errorMessage);
            
            setStatus(errorMessage);
            dispatch(setError(errorMessage));
        } finally {
            setSubmitting(false);
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }

    };

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join our platform and get started today</p>
                    </div>

                    <Formik
                        initialValues={
                            {
                                ...initialValues,
                                role: 'Farmer'
                            }
                        }
                        validationSchema={registerValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting: formikSubmitting }) => (
                            <form
                                onSubmit={handleSubmit}
                                className='border border-gray-300 p-6 rounded-lg shadow-md bg-whiteColor'>
                                <div>

                                    {/* Name Field */}
                                    <Input
                                        id='name'
                                        label="Full Name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        icon={'user'}
                                        error={touched.name && errors.name ? errors.name : ''}
                                        success={values.name !== '' && !errors.name && touched.name}
                                    />

                                    {/* Email Field */}
                                    <Input
                                        id="email"
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        icon="email"
                                        error={touched.email && errors.email ? errors.email : ''}
                                        success={values.email !== '' && !errors.email && touched.email}
                                    />

                                    {/* Password Field */}
                                    <Input
                                        id="password"
                                        label="Password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        icon="password"
                                        error={touched.password && errors.password ? errors.password : ''}
                                        success={values.password !== '' && !errors.password && touched.password}
                                    />

                                    {/* Role Selection */}
                                    <Select
                                        id="role"
                                        name="role"
                                        label="Select Role"
                                        placeholder="Choose your role"
                                        value={values.role}
                                        onChange={(value) => setFieldValue('role', value)}
                                        onBlur={handleBlur}
                                        options={roleOptions}
                                        error={touched.role && errors.role ? errors.role : ''}
                                        success={values.role !== '' && !errors.role && touched.role}
                                    />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="md"
                                        className="w-full mt-6"
                                        disabled={formikSubmitting || isSubmitting}
                                    >
                                        {formikSubmitting || isSubmitting ? (
                                            <>
                                                <Spinner /> <span className='ml-3.5'>Registering...</span>
                                            </>
                                        ) : (
                                            'Register'
                                        )}
                                    </Button>
                                </div>

                                {/* Login Link */}
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={handleLogin}
                                            className="text-greenColor hover:text-greenColor font-semibold transition-colors duration-200 cursor-pointer">
                                            Log in here
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default RegisterLayout;