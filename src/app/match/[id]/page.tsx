import { Metadata } from 'next';
import { getMatchDetails } from '@/lib/api-football';
import MatchDetailClient from '@/components/match/MatchDetailClient';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        const data = await getMatchDetails(id);
        const match = data?.response?.[0];

        if (!match) {
            return {
                title: 'Match introuvable | Sport Stream',
                description: 'Détails du match non disponibles.'
            };
        }

        const homeTeam = match.teams.home.name;
        const awayTeam = match.teams.away.name;
        const league = match.league.name;

        return {
            title: `${homeTeam} vs ${awayTeam} - ${league} | En Direct & Stats`,
            description: `Suivez le match ${homeTeam} contre ${awayTeam} en direct. Scores, statistiques et vidéos.`,
            openGraph: {
                title: `${homeTeam} vs ${awayTeam} - ${league}`,
                description: `Regarder ${homeTeam} vs ${awayTeam} en direct.`,
                images: [match.teams.home.logo, match.teams.away.logo] // Optional: optimize this
            }
        };

    } catch (error) {
        return {
            title: 'Match | Sport Stream',
            description: 'Regardez vos matchs préférés en direct.'
        };
    }
}

export default async function MatchPage({ params }: Props) {
    const { id } = await params;
    return <MatchDetailClient id={id} />;
}
