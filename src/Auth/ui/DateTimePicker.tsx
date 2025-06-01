import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimePickerProps {
    id: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'date' | 'datetime' | 'daterange';
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    minDate?: string;
    maxDate?: string;
    defaultDays?: number; // For date range default selection
    startDate?: string; // For datetime picker to restrict date selection
    endDate?: string; // For datetime picker to restrict date selection
}

interface DateRange {
    start: Date | null;
    end: Date | null;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    id,
    label,
    value = '',
    onChange,
    type = 'date',
    placeholder,
    error,
    required = false,
    disabled = false,
    className = '',
    minDate,
    maxDate,
    defaultDays = 3,
    startDate,
    endDate
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
    const [selectingEnd, setSelectingEnd] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Parse existing value on mount
    useEffect(() => {
        if (value) {
            if (type === 'daterange') {
                const dates = value.split(' - ');
                if (dates.length === 2) {
                    setDateRange({
                        start: new Date(dates[0]),
                        end: new Date(dates[1])
                    });
                }
            } else if (type === 'datetime') {
                const date = new Date(value);
                setSelectedDate(date);
                setSelectedTime(date.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                }));
            } else {
                setSelectedDate(new Date(value));
            }
        }
    }, [value, type]);

    // Set default date range
    useEffect(() => {
        if (type === 'daterange' && !value) {
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + defaultDays);

            setDateRange({
                start: today,
                end: endDate
            });

            const formattedStart = formatDate(today);
            const formattedEnd = formatDate(endDate);
            onChange?.(`${formattedStart} - ${formattedEnd}`);
        }
    }, [type, defaultDays, onChange, value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSelectingEnd(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const formatDateTime = (date: Date): string => {
        return date.toISOString().slice(0, 16);
    };

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isDateInRange = (date: Date): boolean => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return date >= start && date <= end;
        }
        return true;
    };

    const isDateDisabled = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (type === 'datetime' && !isDateInRange(date)) {
            return true;
        }

        if (minDate && date < new Date(minDate)) return true;
        if (maxDate && date > new Date(maxDate)) return true;

        return false;
    };

    const getDaysInMonth = (date: Date): Date[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const days: Date[] = [];

        // Add empty cells for days before the first day of the month
        const startDay = firstDay.getDay();
        for (let i = 0; i < startDay; i++) {
            days.push(new Date(year, month, -startDay + i + 1));
        }

        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        if (type === 'daterange') {
            if (!selectingEnd && (!dateRange.start || dateRange.end)) {
                // Start new selection
                setDateRange({ start: date, end: null });
                setSelectingEnd(true);
            } else if (selectingEnd) {
                // Complete selection
                const start = dateRange.start!;
                const end = date >= start ? date : start;
                const newStart = date >= start ? start : date;

                setDateRange({ start: newStart, end });
                setSelectingEnd(false);

                const formattedStart = formatDate(newStart);
                const formattedEnd = formatDate(end);
                onChange?.(`${formattedStart} - ${formattedEnd}`);
                setIsOpen(false);
            }
        } else {
            setSelectedDate(date);
            if (type === 'date') {
                onChange?.(formatDate(date));
                setIsOpen(false);
            }
        }
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const [hours, minutes] = time.split(':');
            const dateTime = new Date(selectedDate);
            dateTime.setHours(parseInt(hours), parseInt(minutes));
            onChange?.(formatDateTime(dateTime));
        }
    };

    const handleApplyDateTime = () => {
        if (selectedDate && selectedTime) {
            const [hours, minutes] = selectedTime.split(':');
            const dateTime = new Date(selectedDate);
            dateTime.setHours(parseInt(hours), parseInt(minutes));
            onChange?.(formatDateTime(dateTime));
            setIsOpen(false);
        }
    };

    const getInputValue = (): string => {
        if (type === 'daterange' && dateRange.start && dateRange.end) {
            return `${formatDisplayDate(dateRange.start)} - ${formatDisplayDate(dateRange.end)}`;
        } else if (type === 'datetime' && selectedDate) {
            const timeStr = selectedTime || '00:00';
            return `${formatDisplayDate(selectedDate)} ${timeStr}`;
        } else if (type === 'date' && selectedDate) {
            return formatDisplayDate(selectedDate);
        }
        return '';
    };

    const isDateInSelectedRange = (date: Date): boolean => {
        if (type !== 'daterange' || !dateRange.start) return false;

        if (dateRange.end) {
            return date >= dateRange.start && date <= dateRange.end;
        } else if (selectingEnd) {
            return date.getTime() === dateRange.start.getTime();
        }

        return false;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(currentMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(currentMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const generateTimeOptions = (): string[] => {
        const options: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                options.push(timeStr);
            }
        }
        return options;
    };

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative" ref={dropdownRef}>
                <div
                    className={`
            w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg
            focus:border-green-500 focus:ring-green-500 shadow-sm cursor-pointer
            transition-all duration-200 ease-in-out
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'hover:border-gray-400'}
            ${disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : ''}
            flex items-center justify-between
          `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <span className={getInputValue() ? 'text-gray-900' : 'text-gray-400'}>
                        {getInputValue() || placeholder || `Select ${type === 'daterange' ? 'date range' : type === 'datetime' ? 'date & time' : 'date'}`}
                    </span>
                    <div className="flex items-center space-x-2">
                        {type === 'datetime' && <Clock className="h-4 w-4 text-gray-400" />}
                        <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigateMonth('prev')}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <h3 className="text-sm font-medium">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>

                            <button
                                type="button"
                                onClick={() => navigateMonth('next')}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="p-4">
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <div key={day} className="text-xs font-medium text-gray-500 text-center p-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {getDaysInMonth(currentMonth).map((date, index) => {
                                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                                    const isInRange = isDateInSelectedRange(date);
                                    const isDisabled = isDateDisabled(date);
                                    const isToday = new Date().toDateString() === date.toDateString();

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleDateClick(date)}
                                            disabled={isDisabled}
                                            className={`
                        p-2 text-sm rounded-md transition-all duration-200 relative
                        ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                        ${isSelected ? 'bg-green-500 text-white' : ''}
                        ${isInRange && !isSelected ? 'bg-green-100 text-green-800' : ''}
                        ${isToday && !isSelected && !isInRange ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}
                        ${!isDisabled && !isSelected && !isInRange && !isToday ? 'hover:bg-gray-100' : ''}
                      `}
                                        >
                                            {date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Picker for datetime type */}
                        {type === 'datetime' && (
                            <div className="border-t border-gray-200 p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                                        <select
                                            value={selectedTime}
                                            onChange={(e) => handleTimeChange(e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">Select time</option>
                                            {generateTimeOptions().map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleApplyDateTime}
                                        disabled={!selectedDate || !selectedTime}
                                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Range Selection Info */}
                        {type === 'daterange' && selectingEnd && (
                            <div className="border-t border-gray-200 p-4 bg-blue-50">
                                <p className="text-xs text-blue-600">
                                    Select end date for your range
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                    {error}
                </p>
            )}
        </div>
    );
};

export default DateTimePicker;