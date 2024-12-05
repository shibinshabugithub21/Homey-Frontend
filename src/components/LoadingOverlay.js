import React from 'react';
import useStore from '@/app/store/useStore';

const LoadingOverlay = () => {
  const isLoading = useStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
