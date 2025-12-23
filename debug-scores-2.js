const https = require('https');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('Fetching Leagues...');
        const leagues = await fetchUrl('https://api.sportsrc.org/?data=results&category=leagues');
        console.log('Leagues count:', leagues.data ? leagues.data.length : 0);
        if (leagues.data && leagues.data.length > 0) {
            console.log('Sample League:', JSON.stringify(leagues.data[0], null, 2));
        }

        console.log('\nFetching Scores for PL...');
        const scores = await fetchUrl('https://api.sportsrc.org/?data=results&category=scores&league=PL');
        console.log('Scores count:', scores.data ? scores.data.length : 0);
        if (scores.data && scores.data.length > 0) {
            console.log('Sample Score:', JSON.stringify(scores.data[0], null, 2));
        } else {
            console.log('No scores found for PL. trying generic scores...');
            // fallback to generic if PL is empty/offseason
            // const allScores = await fetchUrl('https://api.sportsrc.org/?data=results&category=scores');
            // console.log('Generic Scores count:', allScores.data ? allScores.data.length : 0);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
