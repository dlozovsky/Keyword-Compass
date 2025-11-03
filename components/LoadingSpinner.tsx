
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-sky-500 border-t-transparent"></div>
        <p className="text-slate-300">Analyzing keywords...</p>
    </div>
  );
};

export default LoadingSpinner;
