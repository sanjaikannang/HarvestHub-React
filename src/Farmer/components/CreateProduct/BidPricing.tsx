import React from 'react';
import DateTimePicker from '../../../Auth/ui/DateTimePicker';
import Input from '../../../Auth/ui/Input';

interface BidPricingProps {
    formData: {
        startingPrice: string;
        bidStartDate: string;
        bidEndDate: string;
        bidTiming: string; // New field for combined date and time range
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

    // Handle bid timing change (combined date and time range)
    const handleBidTimingChange = (value: string) => {
        onDateTimeChange('bidTiming', value);
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
        <>
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

                    {/* Bid Duration (Date Range) */}
                    <div className="md:col-span-1">
                        <DateTimePicker
                            id="bidDateRange"
                            label="Bid Duration"
                            type="daterange"
                            value={getDateRangeValue()}
                            onChange={handleDateRangeChange}
                            placeholder="Select bid start and end dates"
                            defaultDays={1}
                            maxRangeDays={3}
                            required
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Minimum 1 day, Maximum 3 days.
                        </p>
                    </div>

                    {/* Bid Timing (Combined Date and Time Range) */}
                    <div className="md:col-span-1">
                        <DateTimePicker
                            id="bidTiming"
                            label="Bid Timing"
                            type="datetimerange"
                            value={formData.bidTiming}
                            onChange={handleBidTimingChange}
                            placeholder="Select bid date and time range"
                            startDate={formData.bidStartDate}
                            endDate={formData.bidEndDate}
                            minTimeDuration={30} // 30 minutes minimum
                            maxTimeDuration={120} // 2 hours maximum
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Select a date within your bid duration and set start/end times. Minimum 30 minutes, Maximum 2 hours.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BidPricing;