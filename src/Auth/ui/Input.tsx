import React from "react";
import { Search, Mail, Lock, User, Phone, Eye, EyeOff, LucideIcon, Wheat } from "lucide-react";

type IconType = "search" | "mail" | "email" | "lock" | "password" | "user" | "phone" | "product"

type InputSize = "sm" | "md" | "lg";

interface BaseInputProps {
    id: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    icon?: IconType | LucideIcon | React.ComponentType<any>;
    label?: string;
    error?: string;
    success?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    size?: InputSize;
}

interface InputFieldProps extends BaseInputProps {
    type?: "text" | "email" | "password" | "tel" | "number" | "url" | "search" | "product";
    min?: string | number;
    max?: string | number;
    step?: string | number;
}

interface TextareaFieldProps extends BaseInputProps {
    type: "textarea";
    rows?: number;
    cols?: number;
    resize?: "none" | "both" | "horizontal" | "vertical";
}

type InputBoxProps = (InputFieldProps | TextareaFieldProps) &
    Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>,
        "onChange" | "onBlur" | "size" | "type">;

const Input: React.FC<InputBoxProps> = ({
    id,
    type = "text",
    placeholder = "",
    value,
    onChange,
    onBlur,
    icon,
    label,
    error,
    success = false,
    disabled = false,
    required = false,
    className = "",
    size = "md",
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
        product: Wheat
    };

    const IconComponent = typeof icon === "string" ? iconMap[icon] : icon;
    const isPasswordType = type === "password";
    const isTextarea = type === "textarea";
    const inputType = isPasswordType && showPassword ? "text" : type;

    const handlePasswordToggle = (): void => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (): void => {
        setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setIsFocused(false);
        if (onBlur) {
            onBlur(e);
        }
    };

    // Size configurations
    const sizeConfig = {
        sm: {
            input: "px-3 py-2 text-sm",
            textarea: "px-3 py-2 text-sm",
            icon: "h-4 w-4",
            label: "text-xs",
            leftPadding: "pl-8",
            rightPadding: "pr-8",
        },
        md: {
            input: "px-4 py-3 text-sm",
            textarea: "px-3 py-2 text-sm",
            icon: "h-5 w-5",
            label: "text-sm",
            leftPadding: "pl-11",
            rightPadding: "pr-11",
        },
        lg: {
            input: "px-5 py-4 text-base",
            textarea: "px-4 py-3 text-base",
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
          focus:border-greenColor focus:ring-greenColor shadow-sm
          ${error ? "border-redColor focus:border-redColor focus:ring-redColor" : ""}
          ${success ? "border-greenColor focus:border-greenColor focus:ring-greenColor" : ""}
          ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "hover:border-gray-400"}`;
    };

    const getLabelClasses = () => {
        const baseClasses = `block font-medium transition-all duration-200 mb-2 ${sizeConfig[size].label}`;
        return baseClasses;
    };

    // Extract textarea-specific props
    const textareaProps = isTextarea ? {
        rows: (props as TextareaFieldProps).rows || 4,
        cols: (props as TextareaFieldProps).cols,
        style: {
            resize: (props as TextareaFieldProps).resize || 'vertical'
        }
    } : {};

    // Extract input-specific props for number type
    const inputProps = !isTextarea ? {
        min: (props as InputFieldProps).min,
        max: (props as InputFieldProps).max,
        step: (props as InputFieldProps).step,
    } : {};

    // Remove props that shouldn't be passed to the DOM element
    const {
        rows, cols, resize, min, max, step,
        ...cleanProps
    } = props as any;

    return (
        <>
            <div className={`w-full ${className}`}>
                {/* Label */}
                {label && (
                    <label htmlFor={id} className={getLabelClasses()}>
                        {label}
                        {required && <span className="text-redColor">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative group">
                    {/* Left Icon - Only for input fields, not textarea */}
                    {IconComponent && !isTextarea && (
                        <div className={`absolute inset-y-0 left-0 ${size === 'sm' ? 'pl-2' : size === 'lg' ? 'pl-4' : 'pl-3'} flex items-center pointer-events-none z-10`}>
                            <IconComponent
                                className={`${sizeConfig[size].icon} transition-colors duration-200 ${isFocused
                                    ? error
                                        ? "text-redColor"
                                        : success
                                            ? "text-greenColor"
                                            : "text-greenColor"
                                    : "text-gray-400"
                                    }`}
                            />
                        </div>
                    )}

                    {/* Conditional Rendering: Input vs Textarea */}
                    {isTextarea ? (
                        <textarea
                            id={id}
                            value={value}
                            onChange={onChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            disabled={disabled}
                            required={required}
                            className={`
                                ${getInputClasses()}
                                ${sizeConfig[size].textarea}
                                placeholder:text-gray-400 placeholder:transition-colors
                                focus:placeholder:text-gray-300
                                disabled:text-gray-500 disabled:placeholder:text-gray-300
                            `}
                            {...textareaProps}
                            {...cleanProps}
                        />
                    ) : (
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
                            {...inputProps}
                            {...cleanProps}
                        />
                    )}

                    {/* Right Icons Container - Only for input fields, not textarea */}
                    {!isTextarea && (
                        <div className={`absolute inset-y-0 right-0 ${size === 'sm' ? 'pr-2' : size === 'lg' ? 'pr-4' : 'pr-3'} flex items-center space-x-1`}>
                            {/* Password Toggle */}
                            {isPasswordType && (
                                <button
                                    type="button"
                                    onClick={handlePasswordToggle}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:text-greenColor"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className={`${sizeConfig[size].icon}`} />
                                    ) : (
                                        <Eye className={`${sizeConfig[size].icon}`} />
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Helper Text and Error Message */}
                <div className="mt-1 min-h-[1.25rem]">
                    {error && (
                        <p className="text-[11px] text-redColor flex items-center animate-slide-down">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Input;