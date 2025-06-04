import React from 'react';
import { CloudUpload } from 'lucide-react';

interface ImageUploadProps {
    images: string[];
    onAddImage: (imageUrl: string) => void;
    onRemoveImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images }) => {

    return (
        <>
            <div className="space-y-6">
                {images.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No images added yet</p>
                        <p className="text-sm text-gray-400">Add image URLs to showcase your product</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default ImageUpload;