const https = require('https');

// Test with a dummy ID or try to find a real one first if possible, but let's try a direct hit with a potentially valid ID if I had one, 
// OR just query matches again to get a valid ID and THEN query detail.

const listUrl = 'https://api.sportsrc.org/?data=matches&category=football';

https.get(listUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data && json.data.length > 0) {
                const matchId = json.data[0].id; // Get first match ID
                console.log(`Found Match ID: ${matchId}`);

                const detailUrl = `https://api.sportsrc.org/?data=detail&category=football&id=${matchId}`;
                console.log(`Fetching detail from: ${detailUrl}`);

                https.get(detailUrl, (detailRes) => {
                    let detailData = '';
                    detailRes.on('data', chunk => detailData += chunk);
                    detailRes.on('end', () => {
                        console.log('--- Detail Response ---');
                        console.log(detailData.substring(0, 2000));
                    });
                });
            } else {
                console.log('No matches found to test detail endpoint.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
});
