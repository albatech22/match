const https = require('https');

const endpoints = [
    'matches',
    'matches/live',
    'matches/football',
    'sports'
];

const bases = [
    'https://api.sportsrc.org/',
    'https://westream.su/'
];

bases.forEach(base => {
    endpoints.forEach(ep => {
        const url = base + ep;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`\nURL: ${url} | Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        if (Array.isArray(json)) {
                            console.log(`- Array [${json.length}]`);
                            if (json.length > 0) console.log(`- Sample Item Keys: ${Object.keys(json[0]).join(', ')}`);
                            if (json.length > 0 && json[0].category) console.log(`- Sample Category: ${json[0].category}`);
                        } else {
                            const keys = Object.keys(json);
                            console.log(`- Object {${keys.join(', ')}}`);
                            if (json.data && Array.isArray(json.data)) {
                                console.log(`- .data Array [${json.data.length}]`);
                            }
                        }
                    } catch (e) {
                        console.log(`- Text (truncated): ${data.substring(0, 100)}`);
                    }
                }
            });
        }).on('error', (err) => console.log(`Error ${url}: ` + err.message));
    });
});
