import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Users, Settings, Mic, Camera } from 'lucide-react';

const MockInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleReady = () => {
    setIsReady(true);
    // Here we can later integrate with the actual TavusConversation component
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with back button */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
              AI Interview Coach
            </h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {!isReady ? (
            // Welcome/Ready screen
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Ready for Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
                    Mock Interview?
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Practice with our AI interviewer to build confidence and improve your interview skills. 
                  Get real-time feedback and personalized coaching.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Realistic Simulation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Experience a true-to-life interview environment</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Personalized Questions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Questions tailored to your role and experience</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Feedback</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get instant feedback on your responses</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Camera className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Video Practice</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Practice your body language and presence</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleReady}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Yes, I'm Ready to Start! 🚀
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Make sure you have a quiet environment and working camera/microphone
                </p>
              </div>
            </div>
          ) : (
            // After clicking ready - this will be expanded later
            <div className="text-center space-y-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Setting up your interview...
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Great! The AI interviewer will be ready shortly.
              </p>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
