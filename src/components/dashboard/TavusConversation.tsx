import React, { useState, useRef, useEffect } from 'react';
import { Video, Settings, X, Play, Square, Users, Mic, MicOff, Camera, CameraOff, ChevronUp, ChevronDown, Phone } from 'lucide-react';
import { TavusService } from '../../services/tavusService';
import { useTavus } from '../../contexts/TavusContext';

interface TavusConversationProps {
  isOpen: boolean;
  onClose: () => void;
  isModal?: boolean; // New prop to determine if component should render as modal
}

const TavusConversation: React.FC<TavusConversationProps> = ({ isOpen, onClose, isModal = true }) => {
  // Use context instead of local state
  const {
    conversation,
    setConversation,
    isInCall,
    setIsInCall,
    isVideoEnabled,
    setIsVideoEnabled,
    isMuted,
    setIsMuted,
    isControlsVisible,
    setIsControlsVisible,
    conversationSettings,
    setConversationSettings,
    callerName,
    setCallerName
  } = useTavus();

  // Local state for UI
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const handleCreateConversation = async () => {
    if (!TavusService.getApiKey()) {
      setError('Tavus API key not found. Please check your environment configuration.');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const newConversation = await TavusService.createConversation(conversationSettings);
      setConversation(newConversation);
      console.log('Conversation created:', newConversation);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create conversation');
      console.error('Error creating conversation:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEndConversation = async () => {
    if (!conversation) return;

    try {
      await TavusService.endConversation(conversation.conversation_id);
      setConversation(null);
      setIsInCall(false);
      setIsControlsVisible(true);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to end conversation');
      console.error('Error ending conversation:', err);
    }
  };

  const handleJoinConversation = () => {
    if (conversation?.conversation_url) {
      setIsInCall(true);
      setIsControlsVisible(false);
    }
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Helper functions for updating conversation settings
  const updateConversationName = (name: string) => {
    setConversationSettings({
      ...conversationSettings,
      conversation_name: name
    });
  };
  const updateCustomGreeting = (greeting: string) => {
    setConversationSettings({
      ...conversationSettings,
      custom_greeting: greeting
    });
  };

  const updateConversationContext = (context: string) => {
    setConversationSettings({
      ...conversationSettings,
      conversational_context: context
    });
  };

  const handleLeaveCall = async () => {
    try {
      if (conversation) {
        await TavusService.endConversation(conversation.conversation_id);
      }
    } catch (err: unknown) {
      console.error('Error ending conversation:', err);
    } finally {
      setIsInCall(false);
      setIsControlsVisible(true);
      setConversation(null);
      if (videoRef.current) {
        videoRef.current.src = '';
      }
    }
  };

  useEffect(() => {
    if (conversation && isInCall && videoRef.current) {
      videoRef.current.src = conversation.conversation_url;
    }
  }, [conversation, isInCall]);
  if (!isOpen) return null;

  // Ready to start screen (for non-modal mode)
  if (!isModal && !isReady) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto text-center p-8">
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <Video className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI Interview Coach
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Practice your job interviews with our intelligent AI coach. Get personalized feedback and build your confidence before the real interview.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              What you'll experience:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Realistic Interview Simulation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Experience a true-to-life interview environment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Personalized Questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Questions tailored to your role and experience</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Real-time Feedback</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get instant feedback on your responses</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <Camera className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Video Practice</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Practice your body language and presence</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsReady(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Yes, I'm Ready to Start! 🚀
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Make sure you're in a quiet environment with good lighting
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Full-screen video call interface
  if (isInCall && conversation) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Video Frame - Full Width */}
        <div className="w-full h-full relative">
          <iframe
            ref={videoRef}
            src={conversation.conversation_url}
            className="w-full h-full border-0"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            title="Tavus AI Conversation"
          />

          {/* Controls Toggle Button */}
          <button
            onClick={() => setIsControlsVisible(!isControlsVisible)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 text-white p-3 rounded-full hover:bg-opacity-100 transition-all z-10"
          >
            {isControlsVisible ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
          </button>

          {/* Control Panel */}
          {isControlsVisible && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 backdrop-blur-sm rounded-lg p-4 flex gap-4 transition-all duration-300">
              {/* Mute/Unmute Button */}
              <button
                onClick={handleToggleMute}
                className={`p-3 rounded-full transition-all ${
                  isMuted 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Video On/Off Button */}
              <button
                onClick={handleToggleVideo}
                className={`p-3 rounded-full transition-all ${
                  !isVideoEnabled 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
                title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
              </button>

              {/* End Call Button */}
              <button
                onClick={handleLeaveCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
                title="End call"
              >
                <Phone size={20} className="rotate-45" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Setup and configuration interface
  const setupContent = (
    <div className={`bg-white dark:bg-gray-800 ${isModal ? 'rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden' : 'w-full h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tavus AI Interview Coach
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Practice your job interviews with an AI coach
            </p>
          </div>
        </div>
        {isModal && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className={`p-6 overflow-y-auto ${isModal ? 'max-h-[calc(90vh-120px)]' : 'flex-1'}`}>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* API Key Check */}
        {!TavusService.getApiKey() && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
              Configuration Required
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Tavus API key not found in environment variables. Please add VITE_TAVUS_API_KEY to your .env file.
              Get your API key from the 
              <a href="https://tavusapi.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                Tavus Dashboard
              </a>
            </p>
          </div>
        )}

        {/* Conversation Settings */}
        {TavusService.getApiKey() && !conversation && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings size={20} />
                Conversation Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Interview Session Name
                  </label>
                  <input
                    type="text"
                    value={conversationSettings.conversation_name}
                    onChange={(e) => updateConversationName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Software Engineer Interview Practice"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interview Context
                </label>
                <textarea
                  value={conversationSettings.conversational_context || ''}
                  onChange={(e) => updateConversationContext(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe the role, company, or specific interview type you want to practice..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Greeting (Optional)
                </label>
                <textarea
                  value={conversationSettings.custom_greeting || ''}
                  onChange={(e) => updateCustomGreeting(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Optional: Custom greeting for the AI interviewer..."
                />
              </div>
            </div>

            <button
              onClick={handleCreateConversation}
              disabled={isCreating || !conversationSettings.conversation_name}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Interview Session...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start Interview Session
                </>
              )}
            </button>
          </div>
        )}

        {/* Active Conversation */}
        {conversation && (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                <Users size={20} />
                Interview Session Ready
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">Name:</span>
                  <div className="text-green-600 dark:text-green-400">{conversation.conversation_name}</div>
                </div>
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">Status:</span>
                  <div className="text-green-600 dark:text-green-400 capitalize">{conversation.status}</div>
                </div>
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">ID:</span>
                  <div className="text-green-600 dark:text-green-400 font-mono text-sm">{conversation.conversation_id}</div>
                </div>
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">Created:</span>
                  <div className="text-green-600 dark:text-green-400">{new Date(conversation.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleJoinConversation}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Video size={20} />
                  Start Video Call
                </button>
                
                <button
                  onClick={handleEndConversation}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Square size={20} />
                  End Conversation
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Tips for Your Interview Practice:</h4>
              <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                <li>• Speak clearly and maintain good eye contact with the camera</li>
                <li>• Practice common interview questions and behavioral scenarios</li>
                <li>• Ask the AI coach for feedback on your responses</li>
                <li>• Use this as an opportunity to build confidence before real interviews</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Return with conditional wrapper based on isModal prop
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        {setupContent}
      </div>
    );
  }

  return setupContent;
};

export default TavusConversation;
