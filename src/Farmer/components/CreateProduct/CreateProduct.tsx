import { Calendar, Clock, Image, IndianRupee, Package, Sparkles, Weight } from 'lucide-react';
import Input from '../../../Common/ui/Input';
import Select from '../../../Common/ui/Select';
import DateTimePicker from '../../../Common/ui/DateTimePicker';
import Button from '../../../Common/ui/Button';
import { Formik, FormikHelpers } from 'formik';
import { CreateProductRequest } from '../../../Types/farmerTypes';
import { createProductAPI } from '../../../Services/farmerAPI';
import toast from 'react-hot-toast';
import { createProductValidationSchema, initialValues } from '../../Schema/createProductSchema';
import { Spinner } from '../../../Common/ui/Spinner';
import { useState } from 'react';


interface CreateProductFormValues {
    name: string;
    description: string;
    quantity: string;
    unit: string;
    startingPrice: string;
    bidStartDate: string;
    bidEndDate: string;
    bidStartTime: string;
    bidEndTime: string;
    image1: string;
    image2: string;
    image3: string;
}

const CreateProduct = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dummy image URLs
    const dummyImages = [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574226516831-e1dff420e562?w=800&h=600&fit=crop'
    ];

    // Units
    const unitOptions = [
        { value: 'Kg', label: 'Kg', icon: Weight },
        { value: 'g', label: 'g', icon: Weight },
        { value: 'tons', label: 'tons', icon: Weight },
        { value: 'pieces', label: 'pieces', icon: Weight },
        { value: 'boxes', label: 'boxes', icon: Weight },
        { value: 'liters', label: 'liters', icon: Weight },
    ]

    // Handle form submission
    const handleSubmit = async (
        values: CreateProductFormValues,
        { setSubmitting, setStatus, resetForm }: FormikHelpers<CreateProductFormValues>
    ) => {
        try {
            setIsSubmitting(true);
            setStatus(null);

            // Use dummy images
            const images: string[] = dummyImages;

            // Format datetime strings to ISO format
            const formatDateTime = (date: string, time: string): string => {
                // Parse time in format "HH:MM" or "YYYY-MM-DD HH:MM"
                let timeOnly = time;
                if (time.includes(' ')) {
                    // If time contains date, extract only the time part
                    timeOnly = time.split(' ')[1];
                }

                // Combine date and time in ISO format
                return `${date}T${timeOnly}:00`;
            };

            // Format bid start and end times
            const formattedBidStartTime = formatDateTime(values.bidStartDate, values.bidStartTime);
            const formattedBidEndTime = formatDateTime(values.bidStartDate, values.bidEndTime);

            // Prepare the product data according to API payload structure
            const createProductData: CreateProductRequest = {
                name: values.name,
                description: values.description,
                quantity: {
                    value: parseInt(values.quantity),
                    unit: values.unit
                },
                startingPrice: parseFloat(values.startingPrice),
                bidStartDate: values.bidStartDate,
                bidEndDate: values.bidEndDate,
                bidStartTime: formattedBidStartTime,
                bidEndTime: formattedBidEndTime,
                images: images,
            };

            // Call the register API
            const result = await createProductAPI(createProductData);

            // Show success toast
            toast.success(result.message || 'Product created successfully!');

            // Reset form on success
            resetForm();

        } catch (error: any) {
            console.error('Product Creation failed:', error);

            const errorMessage = error.message || 'Product Creation failed. Please try again.';

            // Show error toast
            toast.error(errorMessage);
            setStatus(errorMessage);

        } finally {
            setSubmitting(false);
            setIsSubmitting(false);
        }

    };

    // Handle clear form
    const handleClearForm = (resetForm: () => void) => {
        resetForm();
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
                <div className="max-w-9xl mx-auto">
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
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
                        <div className="border-b border-gray-200 px-3 py-5">
                            <h2 className="text-xl font-semibold text-blackColor">Create New Product</h2>
                        </div>

                        <div className="px-2 py-4">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={createProductValidationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    resetForm
                                }) => (
                                    <form
                                        onSubmit={handleSubmit}>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>

                                            <div className="space-y-2">

                                                {/* Product Basic Information Section */}
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
                                                            value={values.name}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            placeholder="E.g : Organic Tomatoes"
                                                            icon={'product'}
                                                            error={touched.name && errors.name ? errors.name : ''}
                                                            success={values.name !== '' && !errors.name && touched.name}
                                                        />

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Input
                                                                    id="quantity"
                                                                    type="number"
                                                                    label="Quantity"
                                                                    name="quantity"
                                                                    value={values.quantity}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    min={1}
                                                                    icon={'weight'}
                                                                    placeholder="100"
                                                                    error={touched.quantity && errors.quantity ? errors.quantity : ''}
                                                                    success={values.quantity !== '' && !errors.quantity && touched.quantity}
                                                                />
                                                            </div>

                                                            <div>
                                                                <Select
                                                                    id="unit"
                                                                    name="unit"
                                                                    label="Unit"
                                                                    placeholder="Select Unit"
                                                                    value={values.unit}
                                                                    onChange={(value) => setFieldValue('unit', value)}
                                                                    onBlur={handleBlur}
                                                                    options={unitOptions}
                                                                    error={touched.unit && errors.unit ? errors.unit : ''}
                                                                    success={values.unit !== '' && !errors.unit && touched.unit}
                                                                />
                                                            </div>
                                                        </div>

                                                        <Input
                                                            id="description"
                                                            type="textarea"
                                                            label="Description"
                                                            name="description"
                                                            value={values.description}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            rows={4}
                                                            placeholder="Describe your product quality, farming methods, etc."
                                                            error={touched.description && errors.description ? errors.description : ''}
                                                            success={values.description !== '' && !errors.description && touched.description}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Product Pricing Section */}
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
                                                            name="startingPrice"
                                                            placeholder="250"
                                                            value={values.startingPrice}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            icon={'rupee'}
                                                            min={1}
                                                            size="md"
                                                            error={touched.startingPrice && errors.startingPrice ? errors.startingPrice : ''}
                                                            success={values.startingPrice !== '' && !errors.startingPrice && touched.startingPrice}
                                                        />
                                                    </div>

                                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                                        Set a competitive starting price to attract more bidders
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {/* Product Bid Schedule Section */}
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
                                                                value={values.bidStartDate && values.bidEndDate ? `${values.bidStartDate} - ${values.bidEndDate}` : ''}
                                                                onChange={(dateRange) => {
                                                                    if (dateRange && typeof dateRange === 'string') {
                                                                        const [startDate, endDate] = dateRange.split(' - ');
                                                                        setFieldValue('bidStartDate', startDate);
                                                                        setFieldValue('bidEndDate', endDate);
                                                                    }
                                                                }}
                                                                placeholder="Select bid start and end dates"
                                                                defaultDays={1}
                                                                maxRangeDays={3}
                                                                error={touched.bidStartDate && errors.bidStartDate ? errors.bidStartDate : ''}
                                                            />
                                                            <p className="text-[10px] text-gray-500 mt-1">
                                                                Minimum 1 day, Maximum 3 days.
                                                            </p>
                                                        </div>

                                                        <div className="bg-green-100 rounded-lg p-3">
                                                            <p className="text-sm text-green-800 flex items-center gap-2">
                                                                <Clock className="w-4 h-4" />
                                                                Bidding window : 1-3 days, 30 minutes - 2 hours daily
                                                            </p>
                                                        </div>

                                                        <DateTimePicker
                                                            id="bidTiming"
                                                            label="Bid Timing"
                                                            type="datetimerange"
                                                            value={values.bidStartTime && values.bidEndTime ? `${values.bidStartTime} - ${values.bidEndTime}` : ''}
                                                            onChange={(timeRange) => {
                                                                if (timeRange && typeof timeRange === 'string') {
                                                                    const [startTime, endTime] = timeRange.split(' - ');
                                                                    setFieldValue('bidStartTime', startTime);
                                                                    setFieldValue('bidEndTime', endTime);
                                                                }
                                                            }}
                                                            placeholder="Select bid date and time range"
                                                            startDate={values.bidStartDate}
                                                            endDate={values.bidEndDate}
                                                            minTimeDuration={30} // 30 minutes minimum
                                                            maxTimeDuration={120} // 2 hours maximum
                                                            error={touched.bidStartTime && errors.bidStartTime ? errors.bidStartTime : ''}
                                                        />
                                                        <p className="text-[10px] text-gray-500">
                                                            Select a date within your bid duration and set start/end times. Minimum 30 minutes, Maximum 2 hours.
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Product Image Upload Section */}
                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Image className="w-5 h-5 text-green-600" />
                                                        Product Images
                                                    </h3>
                                                    <div>
                                                        {/* <ImageUpload
                                                            id="product-images"
                                                            label="Product Images"
                                                            minImages={3}
                                                            maxImages={3}
                                                            maxFileSize={5} // 5MB
                                                            images={[values.image1, values.image2, values.image3].filter(Boolean)}
                                                            onChange={(images) => {
                                                                setFieldValue('image1', images[0] || '');
                                                                setFieldValue('image2', images[1] || '');
                                                                setFieldValue('image3', images[2] || '');
                                                            }}
                                                            
                                                            size="md"
                                                            error={touched.image1 && errors.image1 ? errors.image1 : ''}
                                                            success={values.image1 !== '' && !errors.image1 && touched.image1}
                                                        /> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4 mt-4 px-2">
                                            <div className="flex justify-end gap-4">
                                                <Button
                                                    type="reset"
                                                    variant="primary"
                                                    size="md"
                                                    onClick={() => handleClearForm(resetForm)}
                                                    className="px-4 flex items-center gap-2"
                                                    disabled={isSubmitting}
                                                >
                                                    Clear Form
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    size="md"
                                                    className='px-4 flex items-center gap-2'
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Spinner /> <span className='ml-3.5'>Creating...</span>
                                                        </>
                                                    ) : (
                                                        'Create Product'
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CreateProduct