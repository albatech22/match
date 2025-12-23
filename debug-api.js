const https = require('https');

const url = 'https://api.sportsrc.org/?data=matches&category=football';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(data);
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
