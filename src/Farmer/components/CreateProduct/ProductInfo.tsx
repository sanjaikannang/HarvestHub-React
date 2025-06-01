import React from 'react';
import Input from '../../../Auth/ui/Input';
import Select from '../../../Auth/ui/Select';
import { Weight, Wheat } from 'lucide-react';

interface ProductInfoProps {
    formData: {
        name: string;
        description: string;
        quantity: string;
        unit: string;
        category: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ formData, onInputChange }) => {

    // Categories
    const categoryOptions = [
        {
            value: 'Fruits',
            label: 'Fruits',
            icon: Wheat
        },
        {
            value: 'Vegetables',
            label: 'Vegetables',
            icon: Wheat
        },
        {
            value: 'Grains',
            label: 'Grains',
            icon: Wheat
        },
        {
            value: 'Pulses',
            label: 'Pulses',
            icon: Wheat
        },
        {
            value: 'Dairy',
            label: 'Dairy',
            icon: Wheat
        },
        {
            value: 'Spices',
            label: 'Spices',
            icon: Wheat
        },
        {
            value: 'Nuts',
            label: 'Nuts',
            icon: Wheat
        }
    ]

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

    // Handle Select component onChange (it passes just the value string)
    const handleCategoryChange = (value: string) => {
        // Create a synthetic event to match your existing onInputChange signature
        const syntheticEvent = {
            target: {
                name: 'category',
                value: value
            }
        } as React.ChangeEvent<HTMLSelectElement>;

        onInputChange(syntheticEvent);
    };

    const handleUnitChange = (value: string) => {
        const syntheticEvent = {
            target: {
                name: 'unit',
                value: value
            }
        } as React.ChangeEvent<HTMLSelectElement>;

        onInputChange(syntheticEvent);
    };


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Input
                        id="name"
                        label="Product Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={onInputChange}
                        placeholder="E.g : Organic Tomatoes"
                        icon="product"
                        required
                    />
                </div>

                <div>
                    <Select
                        id="category"
                        name="category"
                        label="Category"
                        placeholder="Select Category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        options={categoryOptions}
                        required
                    />
                </div>

                <div>
                    <Input
                        id="quantity"
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={onInputChange}
                        required
                        min={1}
                        placeholder="100"
                    />
                </div>

                <div>
                    <Select
                        id="unit"
                        name="unit"
                        label="Unit"
                        placeholder="Select Unit"
                        value={formData.unit}
                        onChange={handleUnitChange}
                        options={unitOptions}
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <Input
                        id="description"
                        type="textarea"
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={onInputChange}
                        required
                        rows={4}
                        placeholder="Describe your product quality, farming methods, etc."
                        className="md:col-span-2"
                    />
                </div>
            </div>
        </>
    );
};

export default ProductInfo;