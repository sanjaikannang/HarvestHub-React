import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../Services/authAPI';
import { RegisterRequest } from '../../Types/authTypes';
import { setCredentials } from '../../State/Slices/authSlice';
import { initialValues, registerValidationSchema } from '../Schema/registerSchema';
import { Formik, FormikHelpers } from 'formik';

interface RegisterFormValues {
    name: string;
    email: string;
    password: string;
    role: string;
}

const RegisterLayout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Initialize the register mutation hook
    const [register, { isLoading }] = useRegisterMutation();

    // Handle form submission
    const handleSubmit = async (
        values: RegisterFormValues,
        { setSubmitting, setStatus }: FormikHelpers<RegisterFormValues>
    ) => {

        try {
            // Clear any previous status messages
            setStatus('');

            // Prepare the registration data (excluding confirmPassword)
            const registerData: RegisterRequest = {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role
            };

            // Call the register mutation
            const result = await register(registerData).unwrap();

            // If registration is successful, store credentials and navigate
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));

            // Navigate to login page after successful registration
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setSubmitting(false);
        }

    };

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join our platform and get started today</p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={registerValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, isSubmitting, status }) => (
                            <form
                                className='border border-gray-300 p-6 rounded-lg shadow-md bg-whiteColor'                                >
                                <div>

                                    {/* Display general error message */}
                                    {status && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                            <p className="text-sm text-red-600">{status}</p>
                                        </div>
                                    )}

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
                                        success={touched.name && !errors.name && values.name !== ''}
                                        required
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
                                        success={touched.email && !errors.email && values.email !== ''}
                                        required
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
                                        success={touched.password && !errors.password && values.password !== ''}
                                        required
                                        helperText="Password must contain uppercase, lowercase, and number"
                                    />


                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="md"
                                        className="w-full mt-6"
                                    // disabled={isSubmitting || isLoading}
                                    >
                                        {isSubmitting || isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </div>

                                {/* Login Link */}
                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={handleLogin}
                                            className="text-greenColor hover:text-greenColor font-semibold transition-colors duration-200">
                                            Sign in here
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