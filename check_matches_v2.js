const API_KEY = 'f8a66fd6984937cabf1fc9997da1216d14f041ca14dbe233d87df2b714b830af';
const BASE_URL = 'https://apiv3.apifootball.com';
const today = '2025-12-26';

async function checkMatches() {
    try {
        const url = `${BASE_URL}/?action=get_events&from=${today}&to=${today}&APIkey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.log('No matches found.');
            return;
        }

        const stats = {
            total: data.length,
            live: data.filter(m => m.match_live === '1').length,
            leagues: {}
        };

        data.forEach(m => {
            stats.leagues[m.league_name] = (stats.leagues[m.league_name] || 0) + 1;
        });

        console.log(`TOTAL_MATCHES: ${stats.total}`);
        console.log(`LIVE_MATCHES: ${stats.live}`);

        // Find top leagues
        const sortedLeagues = Object.entries(stats.leagues)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        console.log('TOP_LEAGUES:');
        sortedLeagues.forEach(([name, count]) => {
            console.log(`- ${name}: ${count}`);
        });

    } catch (error) {
        console.error('ERROR:', error);
    }
}

checkMatches();
