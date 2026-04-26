'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxFiles?: number;
}

export default function ImageUpload({ images, onChange, maxFiles = 5 }: ImageUploadProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            acceptedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    onChange([...images, result].slice(0, maxFiles));
                };
                reader.readAsDataURL(file);
            });
        },
        [images, onChange, maxFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: maxFiles - images.length,
        disabled: images.length >= maxFiles,
    });

    const removeImage = (i: number) => {
        onChange(images.filter((_, idx) => idx !== i));
    };

    return (
        <div className="space-y-3">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer group
                    ${isDragActive
                        ? 'border-brand-400 bg-brand-50/40 dark:bg-brand-900/15'
                        : images.length >= maxFiles
                            ? 'border-gray-200/50 dark:border-gray-800/30 bg-gray-50/30 dark:bg-gray-900/20 opacity-50 cursor-not-allowed'
                            : 'border-gray-200/80 dark:border-gray-700/40 bg-white/30 dark:bg-gray-900/20 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50/20 dark:hover:bg-brand-900/10'
                    }`}
            >
                <input {...getInputProps()} />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${isDragActive
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white scale-110 shadow-lg shadow-brand-500/30'
                    : 'bg-gray-100/80 dark:bg-gray-800/60 text-gray-400 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 group-hover:text-brand-500'
                    }`}>
                    <Upload size={22} />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    or click to browse · {images.length}/{maxFiles} uploaded
                </p>
            </div>

            {/* Image Previews */}
            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {images.map((img, i) => (
                            <motion.div
                                key={i}
                                className="relative aspect-square rounded-2xl overflow-hidden group"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:scale-105"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
