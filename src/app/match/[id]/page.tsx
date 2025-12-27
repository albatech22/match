import MatchDetailClient from '@/components/match/MatchDetailClient';
import { getMatchDetails } from '@/lib/api-football';
import { Metadata, ResolvingMetadata } from 'next';
import Script from 'next/script';

interface Props {
    params: Promise<{ id: string }>;
}

// Dynamic Metadata Generation
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;

    // Fetch match data for SEO
    // We use the same cached function, next.js will dedupe the request if configured correctly,
    // or we fetch it fresh. Since this runs on server, it's fast.
    const data = await getMatchDetails(id).catch(() => null);
    const match = data?.response?.[0];

    if (!match) {
        return {
            title: 'Match introuvable | Kivu Stream',
            description: 'Détails du match non disponibles.'
        };
    }

    const homeTeam = match.teams.home.name;
    const awayTeam = match.teams.away.name;
    const league = match.league.name;
    const status = match.fixture.status.long;
    const date = new Date(match.fixture.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });

    const title = `${homeTeam} vs ${awayTeam} - Score en Direct & Stats | ${league}`;
    const description = `Suivez le match ${homeTeam} contre ${awayTeam} en direct (${league}). Score en temps réel, buteurs, statistiques, compositions et résumé vidéo sur Kivu Stream.`;

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [match.league.logo || '', ...previousImages], // Use league logo or generate specialized OG image
            type: 'article',
            section: 'Sports',
            tags: [homeTeam, awayTeam, league, 'Football', 'Live Score'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [match.teams.home.logo || '', match.teams.away.logo || ''], // Use team logos
        }
    };
}

export default async function MatchPage({ params }: Props) {
    const { id } = await params;
    const data = await getMatchDetails(id).catch(() => null);
    const match = data?.response?.[0];

    // JSON-LD Structured Data for Google Rich Snippets
    // optimizing for "Zeinze" SEO (Number 1 on Google)
    const jsonLd = match ? {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        'name': `${match.teams.home.name} vs ${match.teams.away.name}`,
        'startDate': match.fixture.date,
        'location': {
            '@type': 'Place',
            'name': match.fixture.venue.name || 'Stade',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': match.fixture.venue.city || 'Ville inconnue',
                'addressCountry': match.league.country
            }
        },
        'competitor': [
            {
                '@type': 'SportsTeam',
                'name': match.teams.home.name,
                'logo': match.teams.home.logo
            },
            {
                '@type': 'SportsTeam',
                'name': match.teams.away.name,
                'logo': match.teams.away.logo
            }
        ],
        'homeTeam': {
            '@type': 'SportsTeam',
            'name': match.teams.home.name,
            'logo': match.teams.home.logo
        },
        'awayTeam': {
            '@type': 'SportsTeam',
            'name': match.teams.away.name,
            'logo': match.teams.away.logo
        },
        'eventStatus': 'https://schema.org/EventScheduled', // Can be dynamic based on status
        'description': `Match de ${match.league.name} entre ${match.teams.home.name} et ${match.teams.away.name}.`,
        'organizer': {
            '@type': 'Organization',
            'name': match.league.name,
            'url': 'https://kivustream.live'
        },
        'image': [match.teams.home.logo, match.teams.away.logo]
    } : null;

    return (
        <div className="min-h-screen bg-black">
            {match && (
                <Script
                    id="match-json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <MatchDetailClient id={id} />
        </div>
    );
}
