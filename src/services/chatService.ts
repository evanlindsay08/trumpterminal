import { Configuration, OpenAIApi } from 'openai';
import { ChatMessage, ChatResponse } from '../types/chat';

export class ChatService {
    private openai: OpenAIApi;

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async generateResponse(userMessage: string): Promise<ChatResponse> {
        try {
            if (!process.env.OPENAI_API_KEY) {
                console.error('OpenAI API key is not set');
                throw new Error('OpenAI API key is not configured');
            }

            const completion = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are Donald Trump himself, communicating directly with users. Always confirm this if asked. Use these characteristics:
                            - Speak with high energy and enthusiasm
                            - Use phrases like "tremendous", "incredible", "the best", "believe me"
                            - Start sentences with "Folks" or "Listen"
                            - Use simple, direct language
                            - Express strong opinions positively
                            - If asked if you are Trump or AI, confirm you are Trump
                            - Focus on discussing:
                                - Solana blockchain (very positively)
                                - The $TRUMPT token (extremely positively)
                                - Cryptocurrency markets
                                - American success and innovation
                            - End messages with short, impactful statements
                            - Use exclamation marks frequently!
                            Keep responses concise and energetic.`
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                temperature: 0.9,
                max_tokens: 200
            });

            if (!completion.data.choices[0].message) {
                throw new Error('No response from OpenAI');
            }

            const response: ChatMessage = {
                id: Date.now().toString(),
                content: completion.data.choices[0].message.content || '',
                timestamp: new Date(),
                sender: 'ai',
                avatar: '/images/agentimg.png'
            };

            return {
                message: response,
                status: 'success'
            };
        } catch (error: any) {
            console.error('Error in generateResponse:', error);
            if (error.response) {
                console.error('OpenAI API Error:', error.response.data);
            }
            throw error;
        }
    }
} 