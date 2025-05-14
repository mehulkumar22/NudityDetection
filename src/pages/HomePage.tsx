import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import ImageUploader from '../components/ImageUploader';
import UrlInput from '../components/UrlInput';
import AnalysisResult from '../components/AnalysisResult';
import { Upload, Link as LinkIcon, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageAnalysisResult, ImageInfo } from '../types';
import { useHistory } from '../context/HistoryContext';
import { mockAnalyzeImage } from '../services/imageAnalysisService';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const { addToHistory } = useHistory();

  const resetAnalysis = useCallback(() => {
    setResult(null);
    setIsAnalyzing(false);
    setImageInfo(null);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const imageUrl = URL.createObjectURL(file);
      setImageInfo({
        source: 'file',
        url: imageUrl,
        isBlurred: true,
        file
      });
      
      const analysisResult = await mockAnalyzeImage(file);
      setResult(analysisResult);
      
      addToHistory({
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl,
        result: analysisResult
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({
        status: 'ERROR',
        safeScore: 0,
        unsafeScore: 0,
        error: 'Failed to analyze image'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToHistory]);

  const handleUrlSubmit = useCallback(async (info: ImageInfo) => {
    setIsAnalyzing(true);
    setResult(null);
    setImageInfo(info);
    
    try {
      const analysisResult = await mockAnalyzeImage(info.url);
      setResult(analysisResult);
      
      addToHistory({
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl: info.url,
        result: analysisResult
      });
    } catch (error) {
      console.error('Error analyzing image from URL:', error);
      setResult({
        status: 'ERROR',
        safeScore: 0,
        unsafeScore: 0,
        error: 'Failed to analyze image'
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [addToHistory]);

  const toggleBlur = useCallback(() => {
    setImageInfo(prev => prev ? {
      ...prev,
      isBlurred: !prev.isBlurred
    } : null);
  }, []);

  useEffect(() => {
    return () => {
      if (imageInfo?.source === 'file' && imageInfo.url) {
        URL.revokeObjectURL(imageInfo.url);
      }
    };
  }, [imageInfo]);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-6 inline-flex p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          <Shield className="h-7 w-7" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Nudity Detection
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload an image or provide a URL to analyze for potentially inappropriate content using our advanced AI models.
        </p>
      </motion.section>

      {!result && !isAnalyzing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="flex items-center justify-center gap-2">
                  <Upload size={18} />
                  <span>Upload Image</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center justify-center gap-2">
                  <LinkIcon size={18} />
                  <span>Image URL</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="upload" className="mt-0">
                <ImageUploader onImageSelect={handleImageUpload} />
              </TabsContent>
              
              <TabsContent value="url" className="mt-0">
                <UrlInput onImageSelect={handleUrlSubmit} />
              </TabsContent>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your images are analyzed securely. We do not store or share your content.
                </p>
              </div>
            </div>
          </Tabs>
        </motion.div>
      ) : (
        <AnalysisResult 
          result={result}
          isLoading={isAnalyzing}
          onRetry={resetAnalysis}
          imageInfo={imageInfo}
          onToggleBlur={toggleBlur}
        />
      )}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
          <div className="mb-3 text-primary-600 dark:text-primary-400">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Advanced AI Models
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Powered by CNN and SWIN V2-T models for accurate detection of inappropriate content.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
          <div className="mb-3 text-secondary-600 dark:text-secondary-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Fast & Accurate
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Get reliable results in seconds with high precision detection of inappropriate content.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
          <div className="mb-3 text-accent-600 dark:text-accent-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Privacy Focused
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Your images are processed securely. We don't store or share your content.
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;