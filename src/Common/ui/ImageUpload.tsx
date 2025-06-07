import React, { useRef, useState, useCallback } from "react";
import { CloudUpload, Image as AlertCircle } from "lucide-react";

type ImageUploadSize = "sm" | "md" | "lg";

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    name: string;
    size: number;
}

interface ImageUploadProps {
    id: string;
    label?: string;
    error?: string;
    success?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    size?: ImageUploadSize;
    minImages?: number;
    maxImages?: number;
    maxFileSize?: number; // in MB
    acceptedFormats?: string[];
    images?: UploadedImage[];
    onChange?: (images: UploadedImage[]) => void;
    onError?: (error: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    id,
    label,
    error,
    success = false,
    disabled = false,
    required = false,
    className = "",
    size = "md",
    minImages = 0,
    maxImages = 5,
    maxFileSize = 5, // 5MB default
    acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    images = [],
    onChange,
    onError,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Size configurations
    const sizeConfig = {
        sm: {
            container: "p-4",
            icon: "h-8 w-8",
            text: "text-xs",
            subText: "text-xs",
            label: "text-xs",
            preview: "h-16 w-16",
            removeBtn: "h-4 w-4",
        },
        md: {
            container: "p-8",
            icon: "h-10 w-10",
            text: "text-sm",
            subText: "text-sm",
            label: "text-sm",
            preview: "h-20 w-20",
            removeBtn: "h-5 w-5",
        },
        lg: {
            container: "p-12",
            icon: "h-14 w-14",
            text: "text-base",
            subText: "text-base",
            label: "text-base",
            preview: "h-24 w-24",
            removeBtn: "h-6 w-6",
        },
    };

    const getLabelClasses = () => {
        const baseClasses = `block font-medium transition-all duration-200 mb-1 ${sizeConfig[size].label}`;
        return baseClasses;
    };

    const validateFile = (file: File): string | null => {
        if (!acceptedFormats.includes(file.type)) {
            return `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`;
        }

        if (file.size > maxFileSize * 1024 * 1024) {
            return `File size too large. Maximum size: ${maxFileSize}MB`;
        }

        return null;
    };

    const createImagePreview = (file: File): Promise<UploadedImage> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    file,
                    preview: e.target?.result as string,
                    name: file.name,
                    size: file.size,
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFiles = useCallback(async (fileList: FileList) => {
        if (disabled) return;

        const files = Array.from(fileList);
        const currentCount = images.length;
        const availableSlots = maxImages - currentCount;

        if (files.length > availableSlots) {
            onError?.(`Can only add ${availableSlots} more image(s). Maximum ${maxImages} images allowed.`);
            return;
        }

        setIsUploading(true);

        const validFiles: File[] = [];
        let hasErrors = false;

        for (const file of files) {
            const validationError = validateFile(file);
            if (validationError) {
                onError?.(validationError);
                hasErrors = true;
                break;
            }
            validFiles.push(file);
        }

        if (!hasErrors && validFiles.length > 0) {
            try {
                const newImages = await Promise.all(
                    validFiles.map(file => createImagePreview(file))
                );

                const updatedImages = [...images, ...newImages];
                onChange?.(updatedImages);
            } catch (err) {
                onError?.("Failed to process images");
            }
        }

        setIsUploading(false);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [images, maxImages, disabled, onChange, onError, maxFileSize, acceptedFormats]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    }, [handleFiles, disabled]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    }, [handleFiles]);

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const canAddMore = images.length < maxImages;
    const hasMinimumImages = images.length >= minImages;

    return (
        <div className={`w-full ${className}`}>
            {/* Label */}
            {label && (
                <label htmlFor={id} className={getLabelClasses()}>
                    {label}
                    {required && <span className="text-redColor">*</span>}
                    <span className="text-gray-400 font-normal ml-2">
                        ({images.length}/{maxImages})
                    </span>
                </label>
            )}

            {/* Upload Area */}
            {canAddMore && (
                <div
                    className={`
                        border-2 border-dashed rounded-lg text-center transition-all duration-200 cursor-pointer
                        ${isDragOver
                            ? "border-greenColor bg-green-50"
                            : error
                                ? "border-redColor bg-red-50"
                                : success
                                    ? "border-greenColor bg-green-50"
                                    : "border-gray-300 hover:border-gray-400"
                        }
                        ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"}
                        ${sizeConfig[size].container}
                    `}
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        id={id}
                        type="file"
                        multiple
                        accept={acceptedFormats.join(",")}
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={disabled}
                    />

                    {isUploading ? (
                        <div className="animate-pulse">
                            <div className={`mx-auto ${sizeConfig[size].icon} bg-gray-300 rounded mb-4`}></div>
                            <p className={`text-gray-500 ${sizeConfig[size].text}`}>Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <CloudUpload
                                className={`mx-auto ${sizeConfig[size].icon} mb-4 transition-colors duration-200 ${isDragOver
                                        ? "text-greenColor"
                                        : error
                                            ? "text-redColor"
                                            : "text-gray-400"
                                    }`}
                            />
                            <p className={`text-gray-500 ${sizeConfig[size].text} mb-1`}>
                                {isDragOver
                                    ? "Drop images here"
                                    : images.length === 0
                                        ? "No images added yet"
                                        : "Add more images"
                                }
                            </p>
                            <p className={`text-gray-400 ${sizeConfig[size].subText}`}>
                                Drag & drop or click to select 
                                <br />
                                {acceptedFormats.map(f => f.split('/')[1]).join(', ')}
                            </p>
                        </>
                    )}
                </div>
            )}
        
            {/* Helper Text and Error Message */}
            <div className="mt-1">
                {error && (
                    <p className="text-[11px] text-redColor flex items-center animate-slide-down">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {error}
                    </p>
                )}

                {!error && minImages > 0 && !hasMinimumImages && (
                    <p className="text-[11px] text-gray-500 flex items-center">
                        Minimum {minImages} image{minImages > 1 ? 's' : ''} required
                    </p>
                )}

                {success && hasMinimumImages && (
                    <p className="text-[11px] text-greenColor flex items-center">
                        ✓ Images uploaded successfully
                    </p>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;