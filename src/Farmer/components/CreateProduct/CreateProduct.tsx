import { Calendar, Clock, Image, IndianRupee, Package, Sparkles, Weight } from 'lucide-react';
import Input from '../../../Common/ui/Input';
import Select from '../../../Common/ui/Select';
import DateTimePicker from '../../../Common/ui/DateTimePicker';
import ImageUpload from '../../../Common/ui/ImageUpload';
import Button from '../../../Common/ui/Button';

const CreateProduct = () => {

    // Units
    const unitOptions = [
        {
            value: 'Kg',
            label: 'Kg',
            icon: Weight
        },
        {
            value: 'g',
            label: 'g',
            icon: Weight
        },
        {
            value: 'tons',
            label: 'tons',
            icon: Weight
        },
        {
            value: 'pieces',
            label: 'pieces',
            icon: Weight
        },
        {
            value: 'boxes',
            label: 'boxes',
            icon: Weight
        },
        {
            value: 'liters',
            label: 'liters',
            icon: Weight
        },
    ]

    return (
        <>


            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            Create New Product
                        </div>
                        <h1 className="text-4xl text-gray-900 mb-2">
                            List Your Product
                        </h1>
                        <p className="text-gray-600 text-md max-w-2xl mx-auto">
                            Set up your product for bidding and reach thousands of potential buyers
                        </p>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                        <div className="border-b border-gray-200 px-4 py-5">
                            <h2 className="text-xl font-semibold text-blackColor">Create New Product</h2>
                        </div>

                        <div className="px-4 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Basic Information Section */}
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Package className="w-5 h-5 text-green-600" />
                                            Basic Information
                                        </h3>
                                        <div className="space-y-4">
                                            <Input
                                                id="name"
                                                label="Product Name"
                                                name="name"
                                                type="text"
                                                // value={formData.name}
                                                // onChange={onInputChange}
                                                placeholder="E.g : Organic Tomatoes"
                                                icon="product"
                                                required
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        label="Quantity"
                                                        name="quantity"
                                                        // value={formData.quantity}
                                                        // onChange={onInputChange}
                                                        required
                                                        min={1}
                                                        icon="weight"
                                                        placeholder="100"
                                                    />
                                                </div>

                                                <div>
                                                    <Select
                                                        id="unit"
                                                        name="unit"
                                                        label="Unit"
                                                        placeholder="Select Unit"
                                                        // value={formData.unit}
                                                        // onChange={handleUnitChange}
                                                        options={unitOptions}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <Input
                                                id="description"
                                                type="textarea"
                                                label="Description"
                                                name="description"
                                                // value={formData.description}
                                                // onChange={onInputChange}
                                                required
                                                rows={4}
                                                placeholder="Describe your product quality, farming methods, etc."
                                            />
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="bg-green-50 rounded-xl p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <IndianRupee className="w-5 h-5 text-green-600" />
                                            Pricing
                                        </h3>

                                        <div>
                                            <Input
                                                id="startingPrice"
                                                type="number"
                                                label="Starting Price (₹)"
                                                placeholder="250"
                                                // value={formData.startingPrice}
                                                // onChange={(e) => onInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                                                icon="rupee"
                                                required
                                                min={1}
                                                size="md"
                                            />
                                        </div>

                                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                            Set a competitive starting price to attract more bidders
                                        </p>
                                    </div>
                                </div>

                                {/* Timing & Media Section */}
                                <div className="space-y-4">
                                    <div className="bg-green-50 rounded-xl p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                            Bidding Schedule
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <DateTimePicker
                                                    id="bidDateRange"
                                                    label="Bid Start - End Date"
                                                    type="daterange"
                                                    // value={getDateRangeValue()}
                                                    // onChange={handleDateRangeChange}
                                                    placeholder="Select bid start and end dates"
                                                    defaultDays={1}
                                                    maxRangeDays={3}
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Minimum 1 day, Maximum 3 days.
                                                </p>
                                            </div>

                                            <div className="bg-green-100 rounded-lg p-3">
                                                <p className="text-sm text-green-800 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Bidding window: 1-3 days, 30 minutes - 2 hours daily
                                                </p>
                                            </div>

                                            <DateTimePicker
                                                id="bidTiming"
                                                label="Bid Timing"
                                                type="datetimerange"
                                                // value={formData.bidTiming}
                                                // onChange={handleBidTimingChange}
                                                placeholder="Select bid date and time range"
                                                // startDate={formData.bidStartDate}
                                                // endDate={formData.bidEndDate}
                                                minTimeDuration={30} // 30 minutes minimum
                                                maxTimeDuration={120} // 2 hours maximum
                                                required
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Select a date within your bid duration and set start/end times. Minimum 30 minutes, Maximum 2 hours.
                                            </p>
                                        </div>
                                    </div>


                                    {/* Image Upload Section */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Image className="w-5 h-5 text-green-600" />
                                            Product Images
                                        </h3>
                                        <div>
                                            <ImageUpload
                                                id="product-images"
                                                label="Product Images"
                                                minImages={3}
                                                maxImages={3}
                                                maxFileSize={5} // 5MB
                                                // images={images}
                                                // onChange={setImages}
                                                // onError={setError}
                                                // error={error}
                                                required
                                                size="md"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 px-6 py-4">
                            <div className="flex justify-end">
                                <Button
                                    className='px-10'
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tips Section */}
                    <div className="mt-8 rounded-2xl p-6 text-blackColor border border-gray-300 bg-gray-50">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Pro Tips for Better Sales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                                <span>Use high-quality, well-lit photos showing your product from multiple angles</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span>Write detailed descriptions including quality, origin, and harvest information</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span>Set competitive starting prices to attract more bidders and increase final value</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default CreateProduct