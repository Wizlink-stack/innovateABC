const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '..', 'data');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function readJSON(filename) {
    const filePath = path.join(DATA_DIR, filename);
    ensureDir(DATA_DIR);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        return [];
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        return [];
    }
}

function writeJSON(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    ensureDir(DATA_DIR);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function appendJSON(filename, item) {
    const data = readJSON(filename);
    data.push({ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() });
    writeJSON(filename, data);
    return data[data.length - 1];
}

module.exports = { readJSON, writeJSON, appendJSON, DATA_DIR };
