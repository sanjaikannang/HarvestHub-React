
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

type SelectSize = "sm" | "md" | "lg";

interface SelectOption {
    value: string;
    label: string;
    icon?: LucideIcon | React.ComponentType<any>;
}

interface SelectProps {
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
    options: SelectOption[];
    error?: string;
    success?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    size?: SelectSize;
}

const Select: React.FC<SelectProps> = ({
    id,
    label,
    placeholder = "Select an option",
    value,
    onChange,
    onBlur,
    options,
    error,
    success = false,
    disabled = false,
    required = false,
    className = "",
    size = "md",
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Size configurations
    const sizeConfig = {
        sm: {
            select: "px-3 py-2 text-sm",
            option: "px-3 py-2 text-sm",
            icon: "h-4 w-4",
            label: "text-xs",
        },
        md: {
            select: "px-4 py-2.5 text-sm",
            option: "px-4 py-2.5 text-sm",
            icon: "h-5 w-5",
            label: "text-sm",
        },
        lg: {
            select: "px-5 py-4 text-base",
            option: "px-5 py-4 text-base",
            icon: "h-6 w-6",
            label: "text-base",
        },
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setIsFocused(!isOpen);
        }
    };

    const handleOptionSelect = (optionValue: string) => {
        if (onChange) {
            onChange(optionValue);
        }
        setIsOpen(false);
        setIsFocused(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        setTimeout(() => {
            if (!selectRef.current?.contains(document.activeElement)) {
                setIsFocused(false);
                if (onBlur) {
                    onBlur(e);
                }
            }
        }, 150);
    };

    const selectedOption = options.find(option => option.value === value);

    const getSelectClasses = () => {
        const baseClasses = "w-full transition-all duration-200 ease-in-out focus:outline-none cursor-pointer";

        return `${baseClasses} bg-white border border-gray-300 rounded-lg
          focus:border-greenColor focus:ring-greenColor shadow-sm
          ${error ? "border-redColor focus:border-redColor focus:ring-redColor" : ""}
          ${success ? "border-greenColor focus:border-greenColor focus:ring-greenColor" : ""}
          ${disabled ? "bg-gray-50 border-gray-200 cursor-not-allowed" : "hover:border-gray-400"}
          ${isOpen ? "border-greenColor" : ""}`;
    };

    const getLabelClasses = () => {
        const baseClasses = `block font-medium transition-all duration-200 mb-1 ${sizeConfig[size].label}`;
        return baseClasses;
    };

    return (
        <>
            <div className={`w-full ${className}`} ref={selectRef}>
                {/* Label */}
                {label && (
                    <label htmlFor={id} className={getLabelClasses()}>
                        {label}
                        {required && <span className="text-redColor">*</span>}
                    </label>
                )}

                {/* Select Container */}
                <div className="relative">
                    {/* Select Button */}
                    <div
                        id={id}
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-haspopup="listbox"
                        tabIndex={disabled ? -1 : 0}
                        className={`
                        ${getSelectClasses()}
                        ${sizeConfig[size].select}
                        flex items-center justify-between
                    `}
                        onClick={handleToggle}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleToggle();
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {selectedOption?.icon && (
                                <selectedOption.icon
                                    className={`${sizeConfig[size].icon} transition-colors duration-200 ${isFocused
                                        ? error
                                            ? "text-redColor"
                                            : success
                                                ? "text-greenColor"
                                                : "text-greenColor"
                                        : "text-gray-400"
                                        }`}
                                />
                            )}
                            <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
                                {selectedOption ? selectedOption.label : placeholder}
                            </span>
                        </div>

                        <ChevronDown
                            className={`${sizeConfig[size].icon} text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                                }`}
                        />
                    </div>

                    {/* Dropdown Options */}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    role="option"
                                    aria-selected={value === option.value}
                                    className={`
                                    ${sizeConfig[size].option}
                                    flex items-center space-x-3 cursor-pointer transition-colors duration-150
                                    hover:bg-green-50 hover:text-greenColor
                                    ${value === option.value ? "bg-green-50 text-greenColor" : "text-gray-700"}
                                `}
                                    onClick={() => handleOptionSelect(option.value)}
                                >
                                    {option.icon && (
                                        <option.icon
                                            className={`${sizeConfig[size].icon} ${value === option.value ? "text-greenColor" : "text-gray-400"
                                                }`}
                                        />
                                    )}
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                <div className="mt-1">
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

export default Select