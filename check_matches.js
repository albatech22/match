const API_KEY = 'f8a66fd6984937cabf1fc9997da1216d14f041ca14dbe233d87df2b714b830af';
const BASE_URL = 'https://apiv3.apifootball.com';
const today = '2025-12-26';

async function checkMatches() {
    try {
        console.log(`Checking matches for ${today}...`);
        const url = `${BASE_URL}/?action=get_events&from=${today}&to=${today}&APIkey=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.log('No matches found or API error:', data);
            return;
        }

        console.log(`Found ${data.length} matches for today.`);

        const liveMatches = data.filter(m => m.match_live === '1');
        console.log(`Live matches: ${liveMatches.length}`);

        const topLeagues = data.filter(m =>
            ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1', 'UEFA Champions League'].includes(m.league_name)
        );
        console.log(`Top league matches: ${topLeagues.length}`);

        if (topLeagues.length > 0) {
            console.log('--- Top Matches ---');
            topLeagues.slice(0, 5).forEach(m => {
                console.log(`${m.league_name}: ${m.match_hometeam_name} ${m.match_hometeam_score}-${m.match_awayteam_score} ${m.match_awayteam_name} (${m.match_status})`);
            });
        }
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

checkMatches();
