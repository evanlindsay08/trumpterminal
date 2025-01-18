export interface ChatMessage {
    id: string;
    content: string;
    timestamp: Date;
    sender: 'user' | 'ai';
    avatar?: string;
}

export interface ChatResponse {
    message: ChatMessage;
    status: 'success' | 'error';
} 