import { useState } from 'react';

const DesignCard = ({ design }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="glass-effect rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-video bg-gray-800 overflow-hidden group">
        <img
          src={showOriginal ? design.original_image : design.generated_image}
          alt={design.prompt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Toggle Button */}
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="absolute top-4 right-4 px-3 py-2 bg-black/60 hover:bg-black/80 text-white text-xs font-medium rounded-lg backdrop-blur-sm transition-all duration-200"
        >
          {showOriginal ? 'Show AI Design' : 'Show Original'}
        </button>

        {/* Image Label */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white text-xs font-medium rounded-full backdrop-blur-sm">
          {showOriginal ? 'Original' : 'AI Generated'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Prompt */}
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-400 mb-1">Prompt</h3>
          <p className="text-white text-sm leading-relaxed">
            {design.prompt || 'No prompt provided'}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatDate(design.created_at)}</span>
          </div>

          {/* Download Button */}
          <a
            href={design.generated_image}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DesignCard;
