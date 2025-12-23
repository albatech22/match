const https = require('https');

// Trying alternative endpoint names based on common patterns or documentation guesses
const endpoints = [
    'https://api.sportsrc.org/?data=standings&category=football',
    'https://api.sportsrc.org/?data=league&category=football', // sometimes returns tables
    'https://api.sportsrc.org/?data=videos&category=football'
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
