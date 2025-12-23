const https = require('https');

const endpoints = [
    'matches',
    'matches/live',
    'matches/football',
    'sports'
];

const base = 'https://api.sportsrc.org/';

endpoints.forEach(ep => {
    https.get(base + ep, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            console.log(`\n--- Endpoint: ${ep} ---`);
            try {
                const json = JSON.parse(data);
                console.log('Keys:', Object.keys(json));
                if (Array.isArray(json)) {
                    console.log('Array length:', json.length);
                    if (json.length > 0) console.log('First item keys:', Object.keys(json[0]));
                } else if (json.data && Array.isArray(json.data)) {
                    console.log('Data array length:', json.data.length);
                    if (json.data.length > 0) console.log('First item in data keys:', Object.keys(json.data[0]));
                } else {
                    console.log('Full JSON (truncated):', data.substring(0, 200));
                }
            } catch (e) {
                console.log('Raw Data (truncated):', data.substring(0, 200));
            }
        });
    }).on('error', (err) => console.log(`Error ${ep}: ` + err.message));
});
