import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, className }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const file = acceptedFiles[0];
      onImageSelect(file);
      
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[220px]",
          isDragActive 
            ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20" 
            : "border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500",
          preview ? "bg-black/5 dark:bg-white/5" : ""
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img
                src={preview}
                alt="Upload preview"
                className="max-h-[200px] max-w-full object-contain rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-0 right-0 p-1 bg-error-100 dark:bg-error-900/60 rounded-full text-error-700 dark:text-error-400 hover:bg-error-200 dark:hover:bg-error-800 transition-colors"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="dropzone" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400">
                {isDragActive ? (
                  <ImageIcon className="h-8 w-8 animate-pulse" />
                ) : (
                  <Upload className="h-8 w-8" />
                )}
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {isDragActive ? "Drop image here" : "Upload an image"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Drag & drop an image or click to browse
              </p>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Supports JPG, PNG, GIF, WebP
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageUploader;