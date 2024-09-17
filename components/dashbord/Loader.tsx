import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white w-80 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
        {/* Petit cercles qui tournent */}
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-gray-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-4 h-4 bg-gray-600 rounded-full animate-bounce delay-300"></div>
        </div>
        <p className="text-gray-600 font-semibold mt-4">Chargement...</p>
      </div>
    </div>
  );
};

export default Loader;
