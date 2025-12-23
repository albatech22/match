const https = require('https');

// Probe Leauges
const leaguesUrl = 'https://api.sportsrc.org/?data=results&category=leagues';

console.log('Fetching Leagues...');
https.get(leaguesUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('--- Leagues Response ---');
        console.log(data.substring(0, 500));

        // After leagues, let's try scores for PL (Premier League) as an example
        const scoresUrl = 'https://api.sportsrc.org/?data=results&category=scores&league=PL';
        console.log('\nFetching Scores for PL...');
        https.get(scoresUrl, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
                console.log('--- PL Scores Response ---');
                console.log(data2.substring(0, 1000));
            });
        });
    });
});
