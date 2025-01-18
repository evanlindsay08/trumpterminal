interface ChatMessage {
    id: string;
    content: string;
    timestamp: Date;
    sender: 'user' | 'ai';
    avatar?: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    const sendButton = document.getElementById('send-button') as HTMLButtonElement;
    const chatMessages = document.getElementById('chat-messages') as HTMLDivElement;

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessageToChat({
            id: Date.now().toString(),
            content: message,
            timestamp: new Date(),
            sender: 'user'
        });

        chatInput.value = '';
        chatInput.disabled = true;
        sendButton.disabled = true;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            addMessageToChat(data.message);
        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToChat({
                id: Date.now().toString(),
                content: 'Sorry, there was an error processing your message.',
                timestamp: new Date(),
                sender: 'ai',
                avatar: '/images/trump-pose.png'
            });
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    function addMessageToChat(message: ChatMessage) {
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

    // Event Listeners
    sendButton.onclick = sendMessage;
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
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