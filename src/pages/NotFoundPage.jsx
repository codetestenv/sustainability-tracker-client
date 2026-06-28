import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="text-9xl font-extrabold text-primary-600 tracking-widest drop-shadow-sm select-none">
          404
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved to a new location.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
            className="shadow-lg shadow-primary-700/20"
          >
            Back to Safety
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
