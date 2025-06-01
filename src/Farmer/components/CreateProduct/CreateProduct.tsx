import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Package, DollarSign, ImageIcon } from 'lucide-react';
import ProductInfo from './ProductInfo';
import BidPricing from './BidPricing';
import ImageUpload from './ImageUpload';
import Button from '../../../Auth/ui/Button';

const CreateProduct: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: '',
        unit: 'kg',
        startingPrice: '',
        bidStartDate: '',
        bidEndDate: '',
        bidStartTime: '',
        bidEndTime: '',
        category: '',
        images: [] as string[]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 1, title: 'Product Information', icon: Package, description: 'Basic product details' },
        { id: 2, title: 'Pricing & Bidding', icon: DollarSign, description: 'Set pricing and bidding schedule' },
        { id: 3, title: 'Product Images', icon: ImageIcon, description: 'Upload product photos' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateTimeChange = () => {

    }

    const handleAddImage = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
        }));
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                return formData.name && formData.description && formData.quantity && formData.category;
            case 2:
                return formData.startingPrice && formData.bidStartDate && formData.bidEndDate &&
                    formData.bidStartTime && formData.bidEndTime;
            case 3:
                return true; // Images are optional
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(1) || !validateStep(2)) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Product created successfully!');
        }, 2000);
    };

    const StepIndicator = () => (
        <>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = currentStep > step.id;
                        const isCurrent = currentStep === step.id;

                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={`
                                w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all
                                ${isCompleted ? 'bg-greenColor text-whiteColor' :
                                            isCurrent ? 'bg-green-100 text-greenColor border-2 border-greenColor' :
                                                'bg-gray-200 text-gray-400'}
                            `}>
                                        {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-xs sm:text-sm font-medium ${isCurrent ? 'text-greenColor' : 'text-gray-500'}`}>
                                            {step.title}
                                        </p>
                                        <p className="text-xs text-gray-400 hidden sm:block">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`flex-1 h-[1px] ${isCompleted ? 'bg-greenColor' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ProductInfo
                        formData={{
                            name: formData.name,
                            description: formData.description,
                            quantity: formData.quantity,
                            unit: formData.unit,
                            category: formData.category
                        }}
                        onInputChange={handleInputChange}
                    />
                );
            case 2:
                return (
                    <BidPricing
                        formData={{
                            startingPrice: formData.startingPrice,
                            bidStartDate: formData.bidStartDate,
                            bidEndDate: formData.bidEndDate,
                            bidStartTime: formData.bidStartTime,
                            bidEndTime: formData.bidEndTime
                        }}
                        onInputChange={handleInputChange}
                        onDateTimeChange={handleDateTimeChange}
                    />
                );
            case 3:
                return (
                    <ImageUpload
                        images={formData.images}
                        onAddImage={handleAddImage}
                        onRemoveImage={handleRemoveImage}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 mt-4 mb-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Create New Product</h1>
                        <p className="text-gray-600">Add your product details and set up bidding parameters.</p>
                    </div>

                    {/* Step Indicator */}
                    <StepIndicator />

                    {/* Form Card */}
                    <div className="bg-whiteColor rounded-lg shadow-lg border border-gray-200">
                        <div className="p-6 sm:p-8">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {steps[currentStep - 1].title}
                                </h2>
                                <p className="text-gray-600">
                                    {steps[currentStep - 1].description}
                                </p>
                            </div>

                            {/* Step Content */}
                            {renderStepContent()}
                        </div>

                        {/* Navigation */}
                        <div className="bg-gray-50 px-6 sm:px-8 py-5 flex justify-between items-center rounded-b-lg gap-14">
                            <Button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                size="sm"
                                className={`
                                    w-full sm:w-auto
                                    ${currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
                                        : 'bg-greenColor text-gray-700'
                                    }
                                `}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            <span className="text-sm text-gray-500 hidden sm:block">
                                Step {currentStep} of {steps.length}
                            </span>

                            {currentStep < 3 ? (
                                <Button
                                    type="submit"
                                    onClick={handleNext}
                                    size="sm"
                                    disabled={!validateStep(currentStep)}
                                    variant="primary"
                                    className={`
                                        w-full sm:w-auto
                                        ${!validateStep(currentStep)
                                            ? 'cursor-not-allowed'
                                            : ''
                                        }
                                    `}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !validateStep(1) || !validateStep(2)}
                                    variant="primary"
                                    size="sm"
                                    className={`
                                        w-full sm:w-auto
                                        ${isSubmitting || !validateStep(1) || !validateStep(2)
                                            ? 'opacity-60 cursor-not-allowed'
                                            : ''
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Create Product
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;