import React from 'react';
import { CheckCircle, AlertTriangle, Clock, RefreshCcw, Gauge, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { AnalysisStatus, ImageAnalysisResult, ImageInfo } from '../types';

interface AnalysisResultProps {
  result: ImageAnalysisResult | null;
  isLoading: boolean;
  onRetry: () => void;
  imageInfo: ImageInfo | null;
  onToggleBlur: () => void;
  className?: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  result, 
  isLoading, 
  onRetry,
  imageInfo,
  onToggleBlur,
  className 
}) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md", className)}
      >
        <div className="flex flex-col items-center text-center">
          {imageInfo && (
            <div className="mb-6 w-full max-w-md overflow-hidden rounded-lg relative">
              <img
                src={imageInfo.url}
                alt="Analyzing"
                className={cn(
                  "w-full h-auto object-cover transition-all duration-300",
                  imageInfo.isBlurred && "blur-xl"
                )}
              />
            </div>
          )}
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Clock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Analyzing Image
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Our AI models (CNN and SWIN V2-T) are analyzing the image for potential nudity content...
          </p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return null;
  }

  let statusIcon;
  let statusColor;
  let statusTitle;
  let confidence;

  switch (result.status) {
    case AnalysisStatus.SAFE:
      statusIcon = <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />;
      statusColor = "bg-success-100 dark:bg-success-900/30";
      statusTitle = "Image is Safe";
      confidence = `${Math.round(result.safeScore * 100)}% Safe`;
      break;
    case AnalysisStatus.UNSAFE:
      statusIcon = <AlertTriangle className="h-8 w-8 text-error-600 dark:text-error-400" />;
      statusColor = "bg-error-100 dark:bg-error-900/30";
      statusTitle = "Nudity Detected";
      confidence = `${Math.round(result.unsafeScore * 100)}% Unsafe`;
      break;
    default:
      statusIcon = <AlertTriangle className="h-8 w-8 text-warning-600 dark:text-warning-400" />;
      statusColor = "bg-warning-100 dark:bg-warning-900/30";
      statusTitle = "Analysis Failed";
      confidence = "Unable to process";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md", className)}
    >
      <div className="flex flex-col">
        {imageInfo && (
          <div className="mb-6 w-full overflow-hidden rounded-lg relative group">
            <img
              src={imageInfo.url}
              alt="Analyzed"
              className={cn(
                "w-full h-auto object-cover transition-all duration-300",
                imageInfo.isBlurred && "blur-xl"
              )}
            />
            <button
              onClick={onToggleBlur}
              className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 hover:bg-black/80 text-white rounded-full flex items-center space-x-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              {imageInfo.isBlurred ? (
                <>
                  <Eye size={18} />
                  <span>Show Image</span>
                </>
              ) : (
                <>
                  <EyeOff size={18} />
                  <span>Blur Image</span>
                </>
              )}
            </button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-center">
          <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6", statusColor)}>
            {statusIcon}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {statusTitle}
            </h3>
            
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mb-3">
              <span className="text-gray-600 dark:text-gray-400">Confidence: <strong>{confidence}</strong></span>
              
              {result.status !== AnalysisStatus.ERROR && (
                <>
                  <div className="w-full md:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round(result.status === AnalysisStatus.SAFE ? result.safeScore * 100 : result.unsafeScore * 100)}%` }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "h-2 rounded-full",
                        result.status === AnalysisStatus.SAFE 
                          ? "bg-success-500" 
                          : "bg-error-500"
                      )}
                    ></motion.div>
                  </div>
                  
                  {result.modelConfidence && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Gauge size={16} />
                      <span>Model Confidence: {Math.round(result.modelConfidence * 100)}%</span>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {result.status === AnalysisStatus.SAFE && "No inappropriate content detected in this image."}
              {result.status === AnalysisStatus.UNSAFE && "This image contains content that may be inappropriate."}
              {result.status === AnalysisStatus.ERROR && "There was an error analyzing this image. Please try again."}
            </p>
            
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900"
            >
              <RefreshCcw size={16} className="mr-2" />
              Analyze another image
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;