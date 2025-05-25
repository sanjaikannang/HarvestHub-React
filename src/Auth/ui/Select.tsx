import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
    placeholder,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`block w-full px-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-green-500'} focus:border-transparent transition-all duration-200 bg-white/50 ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Select;