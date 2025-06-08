import * as Yup from 'yup';

export const createProductValidationSchema = Yup.object({
    name: Yup.string()
        .required('Product name is required')
        .max(100, 'Product name cannot exceed 100 characters'),

    description: Yup.string()
        .required('Description is required')
        .max(1000, 'Description cannot exceed 1000 characters'),

    quantity: Yup.number()
        .required('Quantity is required')
        .positive('Quantity must be greater than zero')
        .integer('Quantity must be an integer'),

    unit: Yup.string()
        .required('Unit is required'),

    startingPrice: Yup.number()
        .required('Starting price is required')
        .min(0, 'Starting price cannot be negative'),

    bidStartDate: Yup.date()
        .required('Bid start date is required'),

    bidEndDate: Yup.date()
        .required('Bid end date is required')
        .min(
            Yup.ref('bidStartDate'),
            'Bid end date cannot be before start date'
        ),

    bidStartTime: Yup.string()
        .required('Bid start time is required'),

    bidEndTime: Yup.string()
        .required('Bid end time is required'),

    // image1: Yup.string()
    //     .required('At least one image is required'),

    // image2: Yup.string()
    //     .nullable(), // Optional

    // image3: Yup.string()
    //     .nullable() // Optional
});


// Initial form values
export const initialValues = {
    name: '',
    description: '',
    quantity: '',
    unit: '',
    startingPrice: '',
    bidStartDate: '',
    bidEndDate: '',
    bidStartTime: '',
    bidEndTime: '',
    image1: '',
    image2: '',
    image3: ''
};