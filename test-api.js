const http = require('http');

function request(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    resolve(body);
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function runTests() {
    console.log('Starting API tests...\n');

    // Test BTC Rate
    try {
        const rate = await request('/api/btc-rate');
        console.log('✅ BTC Rate API:', rate);
    } catch (e) {
        console.log('❌ BTC Rate API failed:', e.message);
    }

    // Test Reviews
    try {
        const reviews = await request('/api/reviews');
        console.log('✅ Reviews API:', reviews.reviews.length, 'reviews loaded');
    } catch (e) {
        console.log('❌ Reviews API failed:', e.message);
    }

    // Test News
    try {
        const news = await request('/api/news');
        console.log('✅ News API:', news.news.length, 'articles loaded');
    } catch (e) {
        console.log('❌ News API failed:', e.message);
    }

    // Test Contact Form
    try {
        const contact = await request('/api/contact', 'POST', {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'This is a test message'
        });
        console.log('✅ Contact API:', contact);
    } catch (e) {
        console.log('❌ Contact API failed:', e.message);
    }

    // Test Chat
    try {
        const chat = await request('/api/chat', 'POST', {
            message: 'Hello, this is a test',
            sessionId: 'test-session-123'
        });
        console.log('✅ Chat API:', chat.success ? 'Success' : 'Failed');
    } catch (e) {
        console.log('❌ Chat API failed:', e.message);
    }

    console.log('\nAll tests completed!');
    process.exit(0);
}

runTests();

