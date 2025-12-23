const https = require('https');

const endpoints = [
    'https://api.sportsrc.org/?data=results&category=leagues',
    'https://api.sportsrc.org/?data=results&category=tables&league=PL' // Trying Premier League as example
];

endpoints.forEach(url => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- Response for ${url} ---\n`);
            console.log(data.substring(0, 1000));
        });
    }).on('error', (err) => {
        console.log(`Error fetching ${url}: ` + err.message);
    });
});
