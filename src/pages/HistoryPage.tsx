import React from 'react';
import { useHistory } from '../context/HistoryContext';
import { History, Trash2, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from '../lib/utils';
import { AnalysisStatus } from '../types';

const HistoryPage: React.FC = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();

  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-10"
        >
          <div className="mb-6 inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            <History className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Analysis History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your analysis history will appear here after you analyze images.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex items-center">
          <History className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analysis History
          </h1>
        </div>
        
        <button
          onClick={clearHistory}
          className="flex items-center px-4 py-2 bg-error-100 dark:bg-error-900/30 hover:bg-error-200 dark:hover:bg-error-800/50 text-error-700 dark:text-error-400 rounded-md transition-colors"
        >
          <Trash2 size={16} className="mr-2" />
          Clear All
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {history.map((item) => {
          let statusIcon;
          let statusText;
          let statusColor;

          switch (item.result.status) {
            case AnalysisStatus.SAFE:
              statusIcon = <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />;
              statusText = "Safe";
              statusColor = "bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-400";
              break;
            case AnalysisStatus.UNSAFE:
              statusIcon = <AlertTriangle className="h-5 w-5 text-error-600 dark:text-error-400" />;
              statusText = "Unsafe";
              statusColor = "bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-400";
              break;
            default:
              statusIcon = <HelpCircle className="h-5 w-5 text-warning-600 dark:text-warning-400" />;
              statusText = "Error";
              statusColor = "bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-400";
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center"
            >
              <div className="flex-shrink-0 h-16 w-16 mr-4 overflow-hidden rounded-lg">
                <img
                  src={item.imageUrl}
                  alt="Analyzed"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/64x64/gray/white?text=Error';
                  }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${statusColor}`}>
                    {statusIcon}
                    <span className="ml-1">{statusText}</span>
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(item.timestamp)} ago
                  </span>
                </div>
                
                <div className="mt-1">
                  {item.result.status !== AnalysisStatus.ERROR && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                        {item.result.status === AnalysisStatus.SAFE
                          ? `${Math.round(item.result.safeScore * 100)}% Safe`
                          : `${Math.round(item.result.unsafeScore * 100)}% Unsafe`}
                      </span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            item.result.status === AnalysisStatus.SAFE
                              ? 'bg-success-500'
                              : 'bg-error-500'
                          }`}
                          style={{
                            width: `${Math.round(
                              item.result.status === AnalysisStatus.SAFE
                                ? item.result.safeScore * 100
                                : item.result.unsafeScore * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => removeFromHistory(item.id)}
                className="p-2 text-gray-400 hover:text-error-500 dark:hover:text-error-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Remove from history"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default HistoryPage;