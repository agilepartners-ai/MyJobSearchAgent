import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConversationResponse, CreateConversationBody } from '../types/tavus';

interface TavusContextData {
  // Conversation state
  conversation: ConversationResponse | null;
  isInCall: boolean;
  isVideoEnabled: boolean;
  isMuted: boolean;
  isControlsVisible: boolean;
  
  // Conversation settings
  conversationSettings: CreateConversationBody;
  callerName: string;
  
  // Actions
  setConversation: (conversation: ConversationResponse | null) => void;
  setIsInCall: (inCall: boolean) => void;
  setIsVideoEnabled: (enabled: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setIsControlsVisible: (visible: boolean) => void;
  setConversationSettings: (settings: CreateConversationBody) => void;
  setCallerName: (name: string) => void;
  
  // Helper methods
  getConversationUrl: () => string | null;
  getConversationId: () => string | null;
  resetConversation: () => void;
}

const TavusContext = createContext<TavusContextData | undefined>(undefined);

interface TavusProviderProps {
  children: ReactNode;
}

export const TavusProvider: React.FC<TavusProviderProps> = ({ children }) => {
  const [conversation, setConversation] = useState<ConversationResponse | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [callerName, setCallerName] = useState('');
  
  const [conversationSettings, setConversationSettings] = useState<CreateConversationBody>({
    persona_id: 'p5317866',
    conversation_name: 'Job Interview Practice',
    conversational_context: 'You are a friendly AI interview coach helping the user practice for job interviews. Provide constructive feedback and ask relevant interview questions.',
    custom_greeting: 'Hello! I\'m here to help you practice for your upcoming job interviews. What position are you preparing for?',
    properties: {
      max_call_duration: 1800, // 30 minutes
      participant_left_timeout: 60,
      participant_absent_timeout: 300,
      enable_recording: false,
      enable_closed_captions: true,
      apply_greenscreen: false,
      language: 'english'
    }
  });

  const getConversationUrl = (): string | null => {
    return conversation?.conversation_url || null;
  };

  const getConversationId = (): string | null => {
    return conversation?.conversation_id || null;
  };

  const resetConversation = () => {
    setConversation(null);
    setIsInCall(false);
    setIsVideoEnabled(true);
    setIsMuted(false);
    setIsControlsVisible(true);
  };

  const contextValue: TavusContextData = {
    conversation,
    isInCall,
    isVideoEnabled,
    isMuted,
    isControlsVisible,
    conversationSettings,
    callerName,
    setConversation,
    setIsInCall,
    setIsVideoEnabled,
    setIsMuted,
    setIsControlsVisible,
    setConversationSettings,
    setCallerName,
    getConversationUrl,
    getConversationId,
    resetConversation,
  };

  return (
    <TavusContext.Provider value={contextValue}>
      {children}
    </TavusContext.Provider>
  );
};

export const useTavus = (): TavusContextData => {
  const context = useContext(TavusContext);
  if (context === undefined) {
    throw new Error('useTavus must be used within a TavusProvider');
  }
  return context;
};
