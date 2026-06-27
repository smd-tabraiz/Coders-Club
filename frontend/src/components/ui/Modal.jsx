import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden glass rounded-2xl shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/20">
              {title && (
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
