import React from 'react';
import DateTimePicker from '../../../Auth/ui/DateTimePicker';
import Input from '../../../Auth/ui/Input';

interface BidPricingProps {
    formData: {
        startingPrice: string;
        bidStartDate: string;
        bidEndDate: string;
        bidStartTime: string;
        bidEndTime: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDateTimeChange: (field: string, value: string) => void;
}

const BidPricing: React.FC<BidPricingProps> = ({
    formData,
    onInputChange,
    onDateTimeChange
}) => {
    // Handle date range change (for bidStartDate and bidEndDate)
    const handleDateRangeChange = (value: string) => {
        const dates = value.split(' - ');
        if (dates.length === 2) {
            onDateTimeChange('bidStartDate', dates[0]);
            onDateTimeChange('bidEndDate', dates[1]);
        }
    };

    // Handle individual datetime changes
    const handleStartTimeChange = (value: string) => {
        onDateTimeChange('bidStartTime', value);
    };

    const handleEndTimeChange = (value: string) => {
        onDateTimeChange('bidEndTime', value);
    };

    // Create date range value for display
    const getDateRangeValue = () => {
        if (formData.bidStartDate && formData.bidEndDate) {
            const startDate = new Date(formData.bidStartDate);
            const endDate = new Date(formData.bidEndDate);
            const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        return '';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Starting Price */}
                <div className="md:col-span-1">
                    <Input
                        id="startingPrice"
                        type="number"
                        label="Starting Price (₹)"
                        placeholder="250"
                        value={formData.startingPrice}
                        onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                        icon="product"
                        required
                        min={1}
                        size="md"
                    />
                </div>

                {/* Empty space for layout */}
                <div className="md:col-span-1"></div>

                {/* Bid Duration (Date Range) */}
                <div className="md:col-span-2">
                    <DateTimePicker
                        id="bidDateRange"
                        label="Bid Duration"
                        type="daterange"
                        value={getDateRangeValue()}
                        onChange={handleDateRangeChange}
                        placeholder="Select bid start and end dates"
                        defaultDays={3}
                        required
                        className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Default duration is set to 3 days. You can adjust the dates as needed.
                    </p>
                </div>

                {/* Bid Start Time */}
                <div className="md:col-span-1">
                    <DateTimePicker
                        id="bidStartTime"
                        label="Bid Start Time"
                        type="datetime"
                        value={formData.bidStartTime}
                        onChange={handleStartTimeChange}
                        placeholder="Select start date and time"
                        startDate={formData.bidStartDate}
                        endDate={formData.bidEndDate}
                        required
                    />
                </div>

                {/* Bid End Time */}
                <div className="md:col-span-1">
                    <DateTimePicker
                        id="bidEndTime"
                        label="Bid End Time"
                        type="datetime"
                        value={formData.bidEndTime}
                        onChange={handleEndTimeChange}
                        placeholder="Select end date and time"
                        startDate={formData.bidStartDate}
                        endDate={formData.bidEndDate}
                        required
                    />
                </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Bid Timing Guidelines
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Bid start and end times must be within the selected date range</li>
                                <li>Ensure sufficient time between start and end for meaningful bidding</li>
                                <li>Consider your target audience's active hours when setting times</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BidPricing;