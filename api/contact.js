const { appendJSON } = require('../lib/storage');

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Invalid email address' });
        return;
    }

    const entry = appendJSON('contacts.json', { name, email, subject, message });

    res.status(200).json({ success: true, message: 'Message received successfully', id: entry.id });
};
