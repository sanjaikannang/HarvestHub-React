import React, { useState } from 'react';
import { User, Mail } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const RegisterLayout = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Farmer'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const roleOptions = [
        { value: 'Farmer', label: 'Farmer' },
        { value: 'Buyer', label: 'Buyer' },
        { value: 'Admin', label: 'Admin' }
    ];

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join our platform and get started today</p>
                </div>

                {/* Register Form */}
                <Card variant="glass">
                    <div className="space-y-6">
                        {/* Name Field */}
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            icon={<User className="h-5 w-5 text-gray-400" />}
                        />

                        {/* Email Field */}
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            icon={<Mail className="h-5 w-5 text-gray-400" />}
                        />

                        {/* Password Field */}
                        <PasswordInput
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create a strong password"
                        />

                        {/* Role Field */}
                        <Select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            options={roleOptions}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            className="w-full"
                        >
                            Create Account
                        </Button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={handleLogin}
                                className="text-green-600 hover:text-green-500 font-semibold transition-colors duration-200">
                                Sign in here
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RegisterLayout;