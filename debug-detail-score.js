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
                    resolve({ error: 'invalid json' });
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    // 1. Get matches to find a finished ID
    console.log('Fetching matches...');
    const matchesRes = await fetchUrl('https://api.sportsrc.org/?data=matches&category=football');

    if (matchesRes.data) {
        // Find a past match
        const finished = matchesRes.data.find(m => Date.now() > m.date + 120 * 60000); // 2 hours past

        if (finished) {
            console.log('Found finished match:', finished.id, finished.teams?.home?.name, 'vs', finished.teams?.away?.name);
            console.log('Date:', new Date(finished.date).toISOString());

            // 2. Fetch Detail for this match
            const detailUrl = `https://api.sportsrc.org/?data=detail&category=football&id=${finished.id}`;
            console.log('Fetching detail:', detailUrl);
            const detail = await fetchUrl(detailUrl);
            console.log('--- Detail Response ---');
            console.log(JSON.stringify(detail, null, 2));
        } else {
            console.log('No finished matches found in list.');
        }
    }
}

run();
