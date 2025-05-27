import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import { useState } from 'react';

const RegisterLayout = () => {

    const navigate = useNavigate();

    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State for form errors
    const [errors, setErrors] = useState({
        nameError: '',
        emailError: '',
        passwordError: ''
    });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[`${name}Error` as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [`${name}Error`]: ''
            }));
        }
    };

    // Basic form validation
    const validateForm = () => {
        const newErrors = { nameError: '', emailError: '', passwordError: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.nameError = 'Full name is required';
            isValid = false;
        }

        if (!formData.email.trim()) {
            newErrors.emailError = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.emailError = 'Please enter a valid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.passwordError = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.passwordError = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle successful form submission here
            console.log('Form submitted:', formData);
            // You can add your registration logic here
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

                    {/* Register Form */}
                    <form
                        className='border border-gray-300 p-6 rounded-lg shadow-md bg-white'
                        onSubmit={handleSubmit}>
                        <div>

                            {/* Name Field */}
                            <Input
                                id='name'
                                label="Full Name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={'user'}
                                error={errors.nameError}
                                required
                            />

                            {/* Email Field */}
                            <Input
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                icon="email"
                                error={errors.emailError}
                                required
                            />

                            {/* Password Field */}
                            <Input
                                id="password"
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                icon="password"
                                error={errors.passwordError}
                                required
                                helperText="Password must be at least 6 characters"
                            />


                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                className="w-full mt-6"
                            >
                                Create Account
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="text-green-600 hover:text-green-500 font-semibold transition-colors duration-200">
                                    Sign in here
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterLayout;