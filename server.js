const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const apiFiles = fs.readdirSync(path.join(__dirname, 'api')).filter(f => f.endsWith('.js'));
apiFiles.forEach(file => {
    const route = '/' + file.replace('.js', '');
    const handler = require(path.join(__dirname, 'api', file));
    app.all('/api' + route, handler);
});

// Serve static files
app.use(express.static(__dirname));

// SPA fallback for HTML pages
const htmlPages = ['index.html', 'about.html', 'features.html', 'news.html', 'reviews.html', 'converter.html', 'contact.html'];
htmlPages.forEach(page => {
    const route = '/' + page.replace('.html', '');
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, page));
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ABTCMINING server running at http://localhost:${PORT}`);
});
