import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateTimePickerProps {
    id: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    type?: 'date' | 'datetime' | 'daterange' | 'datetimerange';
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
    maxRangeDays?: number; // Maximum days allowed in range (for bid duration)
    minTimeDuration?: number; // Minimum time duration in minutes (for bid timing)
    maxTimeDuration?: number; // Maximum time duration in minutes (for bid timing)
}

interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface TimeRange {
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
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
    endDate,
    maxRangeDays = 3,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedHour, setSelectedHour] = useState('');
    const [selectedMinute, setSelectedMinute] = useState('');
    const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
    const [selectingEnd, setSelectingEnd] = useState(false);
    const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
    const [timeRange, setTimeRange] = useState<TimeRange>({
        startHour: '',
        startMinute: '',
        endHour: '',
        endMinute: ''
    });
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
                setSelectedHour(date.getHours().toString().padStart(2, '0'));
                setSelectedMinute(date.getMinutes().toString().padStart(2, '0'));
            } else if (type === 'datetimerange') {
                // Parse format: "2024-01-15 09:00 - 11:00"
                const parts = value.split(' - ');
                if (parts.length === 2) {
                    const dateTimePart = parts[0].split(' ');
                    const endTime = parts[1];

                    if (dateTimePart.length === 2) {
                        const [datePart, startTime] = dateTimePart;
                        const [startHour, startMinute] = startTime.split(':');
                        const [endHour, endMinute] = endTime.split(':');

                        setSelectedDate(new Date(datePart));
                        setTimeRange({
                            startHour,
                            startMinute,
                            endHour,
                            endMinute
                        });
                    }
                }
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
            endDate.setDate(today.getDate() + Math.min(defaultDays, maxRangeDays) - 1);

            setDateRange({
                start: today,
                end: endDate
            });

            const formattedStart = formatDate(today);
            const formattedEnd = formatDate(endDate);
            onChange?.(`${formattedStart} - ${formattedEnd}`);
        }
    }, [type, defaultDays, maxRangeDays, onChange, value]);

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

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Updated function for datetimerange to only allow dates within the bid duration range
    const isDateInAllowedRange = (date: Date): boolean => {
        if (type === 'datetimerange' && startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Set time to start of day for proper comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            date.setHours(0, 0, 0, 0);
            return date >= start && date <= end;
        }
        return true;
    };

    const isDateInRange = (date: Date): boolean => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            return date >= start && date <= end;
        }
        return true;
    };

    const getDaysDifference = (start: Date, end: Date): number => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const isDateDisabled = (date: Date): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Past dates are disabled
        if (date < today) return true;

        // For datetimerange, only allow dates within the bid duration range
        if (type === 'datetimerange' && !isDateInAllowedRange(date)) {
            return true;
        }

        // For datetime, check if date is in allowed range
        if (type === 'datetime' && !isDateInRange(date)) {
            return true;
        }

        if (minDate && date < new Date(minDate)) return true;
        if (maxDate && date > new Date(maxDate)) return true;

        // For date range, check if selecting this date would exceed max range
        if (type === 'daterange' && dateRange.start && selectingEnd) {
            const daysDiff = getDaysDifference(dateRange.start, date) + 1;
            if (daysDiff > maxRangeDays) return true;
        }

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

                // Validate range doesn't exceed max days
                const daysDiff = getDaysDifference(newStart, end) + 1;
                if (daysDiff > maxRangeDays) {
                    // Auto-adjust to max range
                    const adjustedEnd = new Date(newStart);
                    adjustedEnd.setDate(newStart.getDate() + maxRangeDays - 1);
                    setDateRange({ start: newStart, end: adjustedEnd });

                    const formattedStart = formatDate(newStart);
                    const formattedEnd = formatDate(adjustedEnd);
                    onChange?.(`${formattedStart} - ${formattedEnd}`);
                } else {
                    setDateRange({ start: newStart, end });

                    const formattedStart = formatDate(newStart);
                    const formattedEnd = formatDate(end);
                    onChange?.(`${formattedStart} - ${formattedEnd}`);
                }

                setSelectingEnd(false);
                setIsOpen(false);
            }
        } else if (type === 'datetimerange') {
            setSelectedDate(date);
            setActiveTab('time');
        } else {
            setSelectedDate(date);
            if (type === 'date') {
                onChange?.(formatDate(date));
                setIsOpen(false);
            }
        }
    };


    const isValidTimeRange = (): boolean => {
        if (!timeRange.startHour || !timeRange.startMinute || !timeRange.endHour || !timeRange.endMinute) {
            return false;
        }

        const startTime = parseInt(timeRange.startHour) * 60 + parseInt(timeRange.startMinute);
        const endTime = parseInt(timeRange.endHour) * 60 + parseInt(timeRange.endMinute);

        return endTime > startTime;
    };

    // Handle time range confirmation
    const handleTimeRangeConfirm = () => {
        if (!selectedDate || !isValidTimeRange()) return;

        const startTime = `${timeRange.startHour}:${timeRange.startMinute}`;
        const endTime = `${timeRange.endHour}:${timeRange.endMinute}`;
        const formattedValue = `${formatDate(selectedDate)} ${startTime} - ${endTime}`;

        onChange?.(formattedValue);
        setIsOpen(false);
    };


    const getInputValue = (): string => {
        if (type === 'daterange' && dateRange.start && dateRange.end) {
            return `${formatDisplayDate(dateRange.start)} - ${formatDisplayDate(dateRange.end)}`;
        } else if (type === 'datetime' && selectedDate) {
            const timeStr = selectedHour !== '' && selectedMinute !== ''
                ? `${selectedHour}:${selectedMinute}`
                : '00:00';
            return `${formatDisplayDate(selectedDate)} ${timeStr}`;
        } else if (type === 'datetimerange' && selectedDate && timeRange.startHour && timeRange.endHour) {
            const startTime = `${timeRange.startHour}:${timeRange.startMinute}`;
            const endTime = `${timeRange.endHour}:${timeRange.endMinute}`;
            return `${formatDisplayDate(selectedDate)} ${startTime} - ${endTime}`;
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

    const isDateRangeStart = (date: Date): boolean => {
        return type === 'daterange' && !!dateRange.start && dateRange.start !== null && date.toDateString() === dateRange.start.toDateString();
    };

    const isDateRangeEnd = (date: Date): boolean => {
        return type === 'daterange' && !!dateRange.end && dateRange.end !== null && date.toDateString() === dateRange.end.toDateString();
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

    const generateHourOptions = (): string[] => {
        const options: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            options.push(hour.toString().padStart(2, '0'));
        }
        return options;
    };

    // Updated to generate minutes from 1-59
    const generateMinuteOptions = (): string[] => {
        const options: string[] = [];
        for (let minute = 1; minute <= 59; minute++) {
            options.push(minute.toString().padStart(2, '0'));
        }
        return options;
    };

    return (
        <>
            <div className={`w-full ${className}`}>
                {label && (
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-red-500">*</span>}
                    </label>
                )}

                <div className="relative" ref={dropdownRef}>
                    <div
                        className={`
                            w-full px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg
                            focus:border-green-500 focus:ring-green-500 shadow-sm cursor-pointer
                            transition-all duration-200 ease-in-out
                            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'hover:border-gray-400'}
                            ${disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : ''}
                            flex items-center justify-between
                        `}
                        onClick={() => !disabled && setIsOpen(!isOpen)}
                    >
                        <span className={getInputValue() ? 'text-gray-900' : 'text-gray-400'}>
                            {getInputValue() || placeholder || `Select ${type === 'daterange' ? 'date range' : type === 'datetime' ? 'date & time' : type === 'datetimerange' ? 'date & time range' : 'date'}`}
                        </span>
                        <div className="flex items-center space-x-2">
                            {(type === 'datetime' || type === 'datetimerange') && <Clock className="h-4 w-4 text-gray-400" />}
                            <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                            {/* Tab Navigation for datetimerange */}
                            {type === 'datetimerange' && (
                                <div className="flex border-b border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('date')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'date'
                                            ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <Calendar className="h-4 w-4 inline mr-2" />
                                        Select Date
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('time')}
                                        disabled={!selectedDate}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'time'
                                            ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                            } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Clock className="h-4 w-4 inline mr-2" />
                                        Select Time
                                    </button>
                                </div>
                            )}

                            {/* Calendar Section */}
                            {(type !== 'datetimerange' || activeTab === 'date') && (
                                <>
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between p-1.5 border-b border-gray-100 bg-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => navigateMonth('prev')}
                                            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-gray-600" />
                                        </button>

                                        <h3 className="text-base font-semibold text-gray-800">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </h3>

                                        <button
                                            type="button"
                                            onClick={() => navigateMonth('next')}
                                            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                                        >
                                            <ChevronRight className="h-5 w-5 text-gray-600" />
                                        </button>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="p-4">
                                        <div className="grid grid-cols-7 gap-1 mb-3">
                                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                                <div key={day} className="text-sm font-medium text-gray-500 text-center p-1.5">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1">
                                            {getDaysInMonth(currentMonth).map((date, index) => {
                                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                                const isInRange = isDateInSelectedRange(date);
                                                const isRangeStart = isDateRangeStart(date);
                                                const isRangeEnd = isDateRangeEnd(date);
                                                const isDisabled = isDateDisabled(date);
                                                const isToday = new Date().toDateString() === date.toDateString();

                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleDateClick(date)}
                                                        disabled={isDisabled}
                                                        className={`text-sm p-1.5 rounded-md transition-all duration-200 relative
                                                            flex items-center justify-center font-medium
                                                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                                                            ${isSelected ? 'bg-green-600 text-white shadow-md' : ''}
                                                            ${isRangeStart || isRangeEnd ? 'bg-green-600 text-white shadow-md' : ''}
                                                            ${isInRange && !isRangeStart && !isRangeEnd ? 'bg-green-500 text-green-800' : ''}
                                                            ${isToday && !isSelected && !isInRange && !isRangeStart && !isRangeEnd ? 'bg-gray-100 text-green-600 font-bold' : ''}
                                                            ${isDisabled ? 'cursor-not-allowed opacity-30' : 'hover:bg-green-500'}
                                                            ${!isDisabled && !isSelected && !isInRange && !isRangeStart && !isRangeEnd && !isToday ? 'hover:bg-gray-100' : ''}
                                                        `}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Updated Time Range Picker for datetimerange type with scrollable dropdowns */}
                            {type === 'datetimerange' && activeTab === 'time' && (
                                <div className="p-4 bg-gray-50">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Start Time */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                                <div className="flex space-x-2">
                                                    <div className="flex-1">
                                                        <select
                                                            value={timeRange.startHour}
                                                            onChange={(e) => setTimeRange(prev => ({ ...prev, startHour: e.target.value }))}
                                                            className="w-full text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none max-h-60 overflow-y-auto"
                                                            size={14}
                                                        >
                                                            {generateHourOptions().map(hour => (
                                                                <option
                                                                    className="py-1 text-sm rounded-md font-medium text-center text-gray-600 bg-white hover:bg-green-500"
                                                                    key={hour} 
                                                                    value={hour}>{hour}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1">
                                                        <select
                                                            value={timeRange.startMinute}
                                                            onChange={(e) => setTimeRange(prev => ({ ...prev, startMinute: e.target.value }))}
                                                            className="w-full text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none max-h-60 overflow-y-auto"
                                                            size={14}
                                                        >
                                                            {generateMinuteOptions().map(minute => (
                                                                <option
                                                                    className="py-1 text-sm rounded-md font-medium text-center text-gray-600 bg-white hover:bg-green-500"
                                                                    key={minute} value={minute}>{minute}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* End Time */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                                <div className="flex space-x-2">
                                                    <div className="flex-1">
                                                        <select
                                                            value={timeRange.endHour}
                                                            onChange={(e) => setTimeRange(prev => ({ ...prev, endHour: e.target.value }))}
                                                            className="w-full text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none max-h-60 overflow-y-auto"
                                                            size={14}
                                                        >
                                                            {generateHourOptions().map(hour => (
                                                                <option
                                                                    className="py-1 text-sm rounded-md font-medium text-center text-gray-600 bg-white hover:bg-green-500"
                                                                    key={hour} value={hour}>{hour}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex-1">
                                                        <select
                                                            value={timeRange.endMinute}
                                                            onChange={(e) => setTimeRange(prev => ({ ...prev, endMinute: e.target.value }))}
                                                            className="w-full text-sm border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 focus:outline-none max-h-60 overflow-y-auto"
                                                            size={14}
                                                        >
                                                            {generateMinuteOptions().map(minute => (
                                                                <option
                                                                    className="py-1 text-sm rounded-md font-medium text-center text-gray-600 bg-white hover:bg-green-500"
                                                                    key={minute} value={minute}>{minute}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Validation Message */}
                                        {timeRange.startHour && timeRange.startMinute && timeRange.endHour && timeRange.endMinute && !isValidTimeRange() && (
                                            <div className="text-red-500 text-sm">
                                                End time must be after start time
                                            </div>
                                        )}

                                        {/* Confirm Button */}
                                        <div className="flex justify-end space-x-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleTimeRangeConfirm}
                                                disabled={!selectedDate || !isValidTimeRange()}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedDate && isValidTimeRange()
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                Confirm
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        </>
    )
}

export default DateTimePicker;