let cachedRate = null;
let cachedAt = 0;
const CACHE_TTL = 60000; // 60 seconds

const FALLBACK_RATE = 67000;

async function fetchRate() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        if (data && data.bitcoin && data.bitcoin.usd) {
            return data.bitcoin.usd;
        }
        throw new Error('Invalid response');
    } catch (error) {
        console.error('CoinGecko fetch error:', error.message);
        return null;
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const now = Date.now();
    if (cachedRate && (now - cachedAt) < CACHE_TTL) {
        res.status(200).json({
            rate: cachedRate,
            cached: true,
            timestamp: new Date(cachedAt).toISOString()
        });
        return;
    }

    const rate = await fetchRate();

    if (rate) {
        cachedRate = rate;
        cachedAt = now;
        res.status(200).json({
            rate: cachedRate,
            cached: false,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(200).json({
            rate: FALLBACK_RATE,
            fallback: true,
            timestamp: new Date().toISOString()
        });
    }
};
