import React from "react";
import { Search, Mail, Lock, User, Phone, Eye, EyeOff, LucideIcon, AlertCircle, Check } from "lucide-react";

type IconType = "search" | "mail" | "email" | "lock" | "password" | "user" | "phone"

type InputSize = "sm" | "md" | "lg";

interface InputBoxProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
    id: string;
    type?: "text" | "email" | "password" | "tel" | "number" | "url" | "search";
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: IconType | LucideIcon | React.ComponentType<any>;
    label?: string;
    error?: string;
    success?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    size?: InputSize;
    helperText?: string;
}


const Input: React.FC<InputBoxProps> = ({
    id,
    type = "text",
    placeholder = "",
    value,
    onChange,
    icon,
    label,
    error,
    success = false,
    disabled = false,
    required = false,
    className = "",
    size = "md",
    helperText,
    ...props
}) => {

    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [isFocused, setIsFocused] = React.useState<boolean>(false);

    // Icon mapping for common icons
    const iconMap: Record<IconType, LucideIcon> = {
        search: Search,
        mail: Mail,
        email: Mail,
        lock: Lock,
        password: Lock,
        user: User,
        phone: Phone,
    };

    const IconComponent = typeof icon === "string" ? iconMap[icon] : icon;
    const isPasswordType = type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    const handlePasswordToggle = (): void => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (): void => {
        setIsFocused(true);
    };

    const handleBlur = (): void => {
        setIsFocused(false);
    };

    // Size configurations
    const sizeConfig = {
        sm: {
            input: "px-3 py-2 text-sm",
            icon: "h-4 w-4",
            label: "text-xs",
            leftPadding: "pl-8",
            rightPadding: "pr-8",
        },
        md: {
            input: "px-4 py-3 text-sm",
            icon: "h-5 w-5",
            label: "text-sm",
            leftPadding: "pl-11",
            rightPadding: "pr-11",
        },
        lg: {
            input: "px-5 py-4 text-base",
            icon: "h-6 w-6",
            label: "text-base",
            leftPadding: "pl-12",
            rightPadding: "pr-12",
        },
    };


    // Default variant styles
    const getInputClasses = () => {
        const baseClasses = "w-full transition-all duration-200 ease-in-out focus:outline-none";
        const focusClasses = isFocused ? "" : "";

        return `${baseClasses} ${focusClasses} bg-white border border-gray-300 rounded-lg
          focus:border-blue-500 focus:ring-blue-500 shadow-sm
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
          ${success ? "border-green-500 focus:border-green-500 focus:ring-green-500" : ""}
          ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "hover:border-gray-400"}`;
    };

    const getLabelClasses = () => {
        const baseClasses = `block font-medium transition-all duration-200 mb-2 ${sizeConfig[size].label}`;

        return `${baseClasses} ${error ? "text-red-700" : success ? "text-green-700" : "text-gray-700"
            }`;
    };

    return (
        <>
            <div className={`w-full ${className}`}>
                {/* Label */}
                {
                    label && (
                        <label htmlFor={id} className={getLabelClasses()}>
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                    )
                }

                {/* Input Container */}
                <div className="relative group">
                    {/* Left Icon */}
                    {IconComponent && (
                        <div className={`absolute inset-y-0 left-0 ${size === 'sm' ? 'pl-2' : size === 'lg' ? 'pl-4' : 'pl-3'} flex items-center pointer-events-none z-10`}>
                            <IconComponent
                                className={`${sizeConfig[size].icon} transition-colors duration-200 ${isFocused
                                    ? error
                                        ? "text-red-500"
                                        : success
                                            ? "text-green-500"
                                            : "text-blue-500"
                                    : "text-gray-400"
                                    }`}
                            />
                        </div>
                    )}

                    {/* Input Field */}
                    <input
                        id={id}
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        required={required}
                        className={`
            ${getInputClasses()}
            ${sizeConfig[size].input}
            ${IconComponent ? sizeConfig[size].leftPadding : ""}
            ${isPasswordType || success || error ? sizeConfig[size].rightPadding : ""}
            placeholder:text-gray-400 placeholder:transition-colors
            focus:placeholder:text-gray-300
            disabled:text-gray-500 disabled:placeholder:text-gray-300
          `}
                        {...props}
                    />

                    {/* Right Icons Container */}
                    <div className={`absolute inset-y-0 right-0 ${size === 'sm' ? 'pr-2' : size === 'lg' ? 'pr-4' : 'pr-3'} flex items-center space-x-1`}>
                        {/* Success Icon */}
                        {success && !error && (
                            <Check className={`${sizeConfig[size].icon} text-green-500 animate-pulse`} />
                        )}

                        {/* Error Icon */}
                        {error && (
                            <AlertCircle className={`${sizeConfig[size].icon} text-red-500`} />
                        )}

                        {/* Password Toggle */}
                        {isPasswordType && (
                            <button
                                type="button"
                                onClick={handlePasswordToggle}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-blue-500"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className={`${sizeConfig[size].icon}`} />
                                ) : (
                                    <Eye className={`${sizeConfig[size].icon}`} />
                                )}
                            </button>
                        )}
                    </div >
                </div >

                {/* Helper Text and Error Message */}
                < div className="mt-2 min-h-[1.25rem]" >
                    {error && (
                        <p className="text-xs text-red-600 flex items-center animate-slide-down">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            {error}
                        </p>
                    )}
                    {
                        !error && helperText && (
                            <p className="text-xs text-gray-500">{helperText}</p>
                        )
                    }
                    {
                        success && !error && (
                            <p className="text-xs text-green-600 flex items-center animate-slide-down">
                                <Check className="h-4 w-4 mr-1 flex-shrink-0" />
                                Looks good!
                            </p>
                        )
                    }
                </div >
            </div >
        </>
    )
}

export default Input;