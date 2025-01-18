interface ChatMessage {
    id: string;
    content: string;
    timestamp: Date;
    sender: 'user' | 'ai';
    avatar?: string;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Chat script loaded');
    
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    const sendButton = document.getElementById('send-button') as HTMLButtonElement;
    const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;

    if (!chatInput || !sendButton || !chatMessages) {
        console.error('Could not find required elements');
        return;
    }

    async function sendMessage() {
        console.log('Sending message...');
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: message,
            timestamp: new Date(),
            sender: 'user'
        };

        addMessageToChat(userMessage);
        chatInput.value = '';
        chatInput.disabled = true;
        sendButton.disabled = true;

        try {
            console.log('Fetching response...');
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response received:', data);
            addMessageToChat(data.message);
        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToChat({
                id: Date.now().toString(),
                content: 'Sorry, there was an error processing your message.',
                timestamp: new Date(),
                sender: 'ai',
                avatar: '/images/agentimg.png'
            });
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    function addMessageToChat(message: ChatMessage) {
        console.log('Adding message to chat:', message);
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', message.sender);
        
        let html = '';
        if (message.sender === 'ai' && message.avatar) {
            html += `
                <div class="message-avatar">
                    <img src="${message.avatar}" alt="AI Avatar" />
                </div>
            `;
        }
        
        html += `
            <div class="message-content">${message.content}</div>
        `;
        
        messageElement.innerHTML = html;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Direct event handler assignments
    sendButton.addEventListener('click', () => {
        console.log('Send button clicked');
        sendMessage();
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            sendMessage();
        }
    });

    console.log('Event listeners attached');
});

function copyAddress() {
    const address = document.querySelector('.contract-address')!.textContent;
    navigator.clipboard.writeText(address || '').then(() => {
        // Show popup
        const popup = document.getElementById('copyPopup')!;
        popup.classList.add('show');
        
        // Hide popup after 2 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 2000);
        
        // Change button text
        const button = document.querySelector('.copy-button')!;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = 'Copy Address';
        }, 2000);
    });
} 