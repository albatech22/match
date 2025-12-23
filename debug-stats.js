const https = require('https');

const endpoints = [
    'https://api.sportsrc.org/?data=tables&category=football',
    'https://api.sportsrc.org/?data=news&category=football'
];

endpoints.forEach(url => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- Response for ${url} ---\n`);
            console.log(data.substring(0, 1000)); // Log first 1000 chars to avoid huge output
        });
    }).on('error', (err) => {
        console.log(`Error fetching ${url}: ` + err.message);
    });
});
