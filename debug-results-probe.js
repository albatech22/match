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
                    resolve({ error: 'invalid json', raw: data.substring(0, 100) });
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log('--- Probing for Results ---');

    const endpoints = [
        'https://api.sportsrc.org/?data=results&category=results&league=PL',
        'https://api.sportsrc.org/?data=results&category=fixtures&league=PL',
        'https://api.sportsrc.org/?data=matches&category=football'
    ];

    for (const url of endpoints) {
        console.log(`\nFetching: ${url}`);
        const res = await fetchUrl(url);
        if (res.data && res.data.length > 0) {
            console.log(`Count: ${res.data.length}`);
            console.log('Sample item keys:', Object.keys(res.data[0]));
            console.log('Sample item:', JSON.stringify(res.data[0], null, 2));

            // Check for Aston Villa specifically in matches
            const villa = res.data.find(m =>
                (m.home_team && m.home_team.includes('Villa')) ||
                (m.teams?.home?.name && m.teams.home.name.includes('Villa'))
            );
            if (villa) {
                console.log('Found Aston Villa match:', JSON.stringify(villa, null, 2));
            }
        } else {
            console.log('Response empty or invalid structure:', JSON.stringify(res).substring(0, 200));
        }
    }
}

run();
