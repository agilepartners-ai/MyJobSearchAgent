export interface CreateConversationProperties {
  max_call_duration?: number;
  participant_left_timeout?: number;
  participant_absent_timeout?: number;
  enable_recording?: boolean;
  enable_closed_captions?: boolean;
  apply_greenscreen?: boolean;
  language?: string;
  recording_s3_bucket_name?: string;
  recording_s3_bucket_region?: string;
  aws_assume_role_arn?: string;
}

export interface CreateConversationBody {
  replica_id?: string;
  persona_id?: string;
  callback_url?: string;
  conversation_name?: string;
  conversational_context?: string;
  custom_greeting?: string;
  properties?: CreateConversationProperties;
}

export interface ConversationResponse {
  conversation_id: string;
  conversation_name: string;
  status: 'active' | 'ended';
  conversation_url: string;
  replica_id: string;
  persona_id: string;
  created_at: string;
}

export interface TavusApiError {
  error: string;
  message: string;
}
