import express from 'express';
import path from 'path';
import { config } from 'dotenv';
import { ChatService } from './services/chatService';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3000;
const chatService = new ChatService();

// Middleware
app.use(express.json());
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../views')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await chatService.generateResponse(message);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app; 