import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Formik, FormikHelpers } from 'formik';
import { initialValues, loginValidationSchema } from '../Schema/loginSchema';
import { Spinner } from '../ui/Spinner';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setCredentials, setError, setLoading } from '../../State/Slices/authSlice';
import { LoginRequest } from '../../Types/authTypes';
import { LoginApi } from '../../Services/authAPI';
import toast from 'react-hot-toast';


interface LoginFormValues {
    email: string;
    password: string;
}


const LoginLayout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to navigate based on user role
    const navigateByRole = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                navigate('/admin');
                break;
            case 'buyer':
                navigate('/buyer');
                break;
            case 'farmer':
                navigate('/farmer');
                break;
            default:
                navigate('/'); // Default to landing page if role is not recognized
                break;
        }
    };

    // Handle form submission
    const handleSubmit = async (
        values: LoginFormValues,
        { setSubmitting, setStatus }: FormikHelpers<LoginFormValues>
    ) => {
        try {
            setIsSubmitting(true);
            dispatch(setLoading(true));
            dispatch(setError(null));

            // Prepare the registration data
            const registerData: LoginRequest = {
                email: values.email,
                password: values.password,
            };

            // Call the register API
            const result = await LoginApi(registerData);

            // If Login is successful, store credentials and navigate
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));

            // Show success toast
            toast.success(result.message || 'Registration successful!');

            // Navigate to login page after successful registration
            setTimeout(() => {
                navigateByRole(result.user.role ?? '');
            }, 1500); // Small delay to show the toast

        } catch (error: any) {
            console.error('Login failed:', error);

            const errorMessage = error.message || 'Login failed. Please try again.';

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

    const handleRegister = () => {
        navigate('/register');
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={loginValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting: formikSubmitting }) => (
                            <form
                                onSubmit={handleSubmit}
                                className='border border-gray-300 p-6 rounded-lg shadow-md bg-whiteColor'>
                                <div>

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
                                                <Spinner /> <span className='ml-3.5'>Login...</span>
                                            </>
                                        ) : (
                                            'Login'
                                        )}
                                    </Button>
                                </div>

                                {/* Register Link */}
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        Don't have an account?{' '}
                                        <button
                                            onClick={handleRegister}
                                            className="text-greenColor hover:text-greenColor font-semibold transition-colors duration-200">
                                            Register now
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

export default LoginLayout;