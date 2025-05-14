import React, { useState } from 'react';
import { Link as LinkIcon, AlertCircle } from 'lucide-react';
import { ImageInfo } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface UrlInputProps {
  onImageSelect: (imageInfo: ImageInfo) => void;
  className?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ onImageSelect, className }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const validateAndProcessImageUrl = async (inputUrl: string): Promise<string> => {
    try {
      // Handle Instagram and other social media URLs
      if (inputUrl.includes('instagram.com') || inputUrl.includes('facebook.com')) {
        throw new Error('Please provide a direct link to the image instead of a social media post URL');
      }

      const response = await fetch(inputUrl);
      if (!response.ok) {
        throw new Error('Failed to access the image. Please check if the URL is correct and publicly accessible');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new Error('The URL must point directly to an image file (JPG, PNG, etc.)');
      }

      return inputUrl;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Failed to validate image URL');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter an image URL');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const validatedUrl = await validateAndProcessImageUrl(url.trim());

      onImageSelect({
        source: 'url',
        url: validatedUrl,
        isBlurred: true
      });
      
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            className={cn(
              "block w-full pl-10 pr-3 py-3 rounded-lg transition-colors",
              "border focus:outline-none focus:ring-2",
              error
                ? "border-error-300 focus:border-error-500 focus:ring-error-200"
                : "border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-200 dark:focus:ring-primary-800",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100",
              "placeholder-gray-500 dark:placeholder-gray-400"
            )}
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className={cn(
            "w-full px-4 py-3 rounded-lg font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600",
            "text-white",
            "focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          )}
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? 'Validating URL...' : 'Analyze Image'}
        </button>
      </form>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg flex items-start space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Tips for URL input:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Use direct links to image files (ending in .jpg, .png, etc.)</li>
          <li>• URLs must use HTTPS for security</li>
          <li>• Ensure the image is publicly accessible</li>
          <li>• For social media images, right-click and copy the image address</li>
        </ul>
      </div>
    </div>
  );
};

export default UrlInput;