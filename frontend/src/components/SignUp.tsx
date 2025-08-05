import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Toast from './Toast';
import ModelViewer from './ModelViewer';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
      });

      if (error) {
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          setToastMessage('Too many requests. Please wait an hour before trying again.');
          setToastType('error');
          setShowToast(true);
        } else {
          setToastMessage(error.message);
          setToastType('error');
          setShowToast(true);
        }
      } else {
        // Sign up successful
        setToastMessage('Sign up successful! Please check your email to verify your account.');
        setToastType('success');
        setShowToast(true);

        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err) {
      setToastMessage('An unexpected error occurred');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex bg-white overflow-hidden w-full h-screen"
      style={{ 
        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif'
      }}
    >
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        duration={toastType === 'success' ? 3000 : 5000}
      />
      {/* Form Container */}
      <div 
        className="bg-white flex items-center justify-center flex-shrink-0"
        style={{ 
          width: '730px', 
          height: '100vh'
        }}
      >
        {/* Form Layout */}
        <div 
          className="bg-white flex flex-col"
          style={{ 
            width: '610px',
            height: '730px',
            paddingTop: '40px',
            paddingRight: '44px',
            paddingBottom: '40px',
            paddingLeft: '44px',
            gap: '51px'
          }}
        >
          {/* Header Section */}
          <div className="text-center space-y-1.5">
            <h1 
              className="text-black"
              style={{ 
                fontSize: '20px',
                fontWeight: '800',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                margin: '0'
              }}
            >
              Cudliy.
            </h1>
            <h2 
              className="text-black"
              style={{ 
                fontSize: '36px',
                fontWeight: '700',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                margin: '6px 0 0 0'
              }}
            >
              Create an account
            </h2>
          </div>

          {/* Form */}
          <div className="flex flex-col" style={{ gap: '20px' }}>
            <div>
              <label 
                htmlFor="email" 
                className="block text-black mb-1.5"
                style={{ 
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif'
                }}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="davidsampson1@gmail.com"
                style={{ 
                  height: '46px',
                  paddingLeft: '14px',
                  paddingRight: '14px',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="fullName" 
                className="block text-black mb-1.5"
                style={{ 
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif'
                }}
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="David Sampson"
                style={{ 
                  height: '46px',
                  paddingLeft: '14px',
                  paddingRight: '14px',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  outline: 'none'
                }}
              />
            </div>

            <div className="relative">
              <label 
                htmlFor="password" 
                className="block text-black mb-1.5"
                style={{ 
                  fontSize: '13px',
                  fontWeight: '700',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif'
                }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                style={{ 
                  height: '46px',
                  paddingLeft: '14px',
                  paddingRight: '44px',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                className="absolute right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                style={{ top: '34px' }}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9.5C10.62 9.5 9.5 10.62 9.5 12C9.5 13.38 10.62 14.5 12 14.5C13.38 14.5 14.5 13.38 14.5 12C14.5 10.62 13.38 9.5 12 9.5Z" fill="#B0B0B0"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.99 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.498a10.523 10.523 0 01-1.617 3.257m-4.249-4.249a3.375 3.375 0 00-4.75-4.75L6.228 6.228z" fill="#B0B0B0"/>
                    <path d="M19.5 19.5L4.5 4.5" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex justify-center items-center bg-black text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 disabled:opacity-50 cursor-pointer"
              style={{ 
                height: '46px',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                border: 'none'
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center space-y-4">
            <p 
              className="text-gray-600"
              style={{ 
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                fontSize: '14px',
                margin: '0'
              }}
            >
              Already have an account?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="text-black hover:opacity-70 transition-colors underline cursor-pointer bg-transparent border-none"
                style={{ 
                  fontWeight: '700',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontSize: '14px'
                }}
              >
                Login here
              </button>
            </p>
            <div 
              className="flex justify-center space-x-4 text-gray-500"
              style={{ 
                fontSize: '12px',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif'
              }}
            >
              <a href="#" className="hover:underline" style={{ textDecoration: 'none' }}>
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:underline" style={{ textDecoration: 'none' }}>
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Model Side Panel */}
      <div 
        className="flex-1 relative"
        style={{ 
          height: '100vh',
          background: '#000000'
        }}
      >
        <ModelViewer
          modelUrl="/output (8).glb"
          alt="Cudliy 3D Model"
          autoRotate={true}
          cameraControls={true}
          showControls={false}
          backgroundColor="transparent"
          shadowIntensity={0.8}

          loadingMessage="Loading Cudliy Experience..."
          errorMessage="Failed to load 3D model"
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
          onLoad={() => console.log('3D model loaded successfully')}
          onError={(error) => console.error('3D model error:', error)}
        />
      </div>
    </div>
  );
};

export default SignUpPage;