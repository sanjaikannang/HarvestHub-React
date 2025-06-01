import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    images: string[];
    onAddImage: (imageUrl: string) => void;
    onRemoveImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onAddImage, onRemoveImage }) => {
    const [imageInput, setImageInput] = useState('');

    const handleAddImage = () => {
        if (imageInput.trim()) {
            onAddImage(imageInput.trim());
            setImageInput('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter image URL"
                />
                <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                    Add Image
                </button>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No images added yet</p>
                    <p className="text-sm text-gray-400">Add image URLs to showcase your product</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;