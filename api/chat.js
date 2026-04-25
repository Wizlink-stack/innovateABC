const { readJSON, appendJSON } = require('../lib/storage');

const botResponses = [
    "Thank you for reaching out! Our support team will get back to you shortly.",
    "We appreciate your interest in ABTCMINING. How else can we help?",
    "Our team is reviewing your message. Expect a response within 24 hours.",
    "For urgent matters, please email us at support@innovateabc.com.",
    "Did you know you can track your mining performance in real-time on our dashboard?"
];

function getBotReply(userMessage) {
    const lower = userMessage.toLowerCase();
    if (lower.includes('price') || lower.includes('rate') || lower.includes('btc')) {
        return "You can check live BTC to USD rates using our converter tool. Would you like me to guide you there?";
    }
    if (lower.includes('invest') || lower.includes('mining')) {
        return "Our mining program offers competitive returns with renewable energy-powered operations. Visit our Features page to learn more!";
    }
    if (lower.includes('contact') || lower.includes('email') || lower.includes('support')) {
        return "You can reach our support team at support@innovateabc.com or use the contact form on our website.";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return "Hello! Welcome to ABTCMINING. How can I assist you today?";
    }
    return botResponses[Math.floor(Math.random() * botResponses.length)];
}

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const chats = readJSON('chats.json');
        res.status(200).json({ chats });
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { message, sessionId } = req.body || {};

    if (!message || !message.trim()) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    const userEntry = appendJSON('chats.json', {
        sender: 'user',
        message: message.trim(),
        sessionId: sessionId || 'anonymous'
    });

    const botReply = getBotReply(message.trim());

    const botEntry = appendJSON('chats.json', {
        sender: 'bot',
        message: botReply,
        sessionId: sessionId || 'anonymous'
    });

    res.status(200).json({
        success: true,
        userMessage: userEntry,
        botReply: botEntry
    });
};
