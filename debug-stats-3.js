const https = require('https');

const endpoints = [
    'https://api.sportsrc.org/?data=news&category=football',
    'https://api.sportsrc.org/?data=scores&category=football'
];

endpoints.forEach(url => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- Response for ${url} ---\n`);
            console.log(data.substring(0, 500));
        });
    }).on('error', (err) => {
        console.log(`Error fetching ${url}: ` + err.message);
    });
});
