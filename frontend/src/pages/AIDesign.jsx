import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadRoom from '../components/UploadRoom';
import DesignCard from '../components/DesignCard';
import Loader from '../components/Loader';
import designService from '../services/designService';

const AIDesign = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDesignGenerated = async (formData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await designService.generateDesign(formData);

      if (result.success) {
        // Add new design to the beginning of the list
        setDesigns([result.data, ...designs]);
        setSuccessMessage('Design generated successfully!');
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            AI Interior Design Generator
          </h1>
          <p className="text-gray-400">
            Transform your space with AI-powered interior design
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Upload Section */}
        <div className="mb-12">
          <UploadRoom onDesignGenerated={handleDesignGenerated} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="glass-effect rounded-2xl p-12">
            <Loader message="Generating your AI design... This may take a minute." />
          </div>
        )}

        {/* Designs Gallery */}
        {designs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Designs</h2>
              <span className="text-gray-400 text-sm">
                {designs.length} {designs.length === 1 ? 'design' : 'designs'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && designs.length === 0 && (
          <div className="glass-effect rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No designs yet
            </h3>
            <p className="text-gray-400">
              Upload a room image and describe your desired style to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AIDesign;
