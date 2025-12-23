
export interface IPTVChannel {
    id: string;
    name: string;
    logo?: string;
    url: string;
    group?: string;
}

const SPORTS_PLAYLIST_URL = 'https://iptv-org.github.io/iptv/categories/sports.m3u';

export async function fetchSportsChannels(): Promise<IPTVChannel[]> {
    try {
        const response = await fetch(SPORTS_PLAYLIST_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch playlist');
        }
        const text = await response.text();
        return parseM3U(text);
    } catch (error) {
        console.error('Error fetching sports channels:', error);
        return [];
    }
}

function parseM3U(content: string): IPTVChannel[] {
    const lines = content.split('\n');
    const channels: IPTVChannel[] = [];
    let currentChannel: Partial<IPTVChannel> = {};

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('#EXTINF:')) {
            // Parse metadata
            // Example: #EXTINF:-1 tvg-id="" tvg-name="" tvg-logo="http://logo.png" group-title="Sports",Channel Name
            const info = line.substring(8);
            const commaIndex = info.lastIndexOf(',');

            const name = info.substring(commaIndex + 1).trim();
            const meta = info.substring(0, commaIndex);

            // Extract logo
            const logoMatch = meta.match(/tvg-logo="([^"]+)"/);
            const logo = logoMatch ? logoMatch[1] : undefined;

            // Extract group (optional)
            const groupMatch = meta.match(/group-title="([^"]+)"/);
            const group = groupMatch ? groupMatch[1] : undefined;

            currentChannel = {
                id: crypto.randomUUID(), // Generate a temporary ID
                name: name || 'Unknown Channel',
                logo,
                group
            };
        } else if (line.startsWith('http') || line.startsWith('https')) {
            // This is the URL line
            if (currentChannel.name) {
                channels.push({
                    ...currentChannel,
                    url: line
                } as IPTVChannel);
                currentChannel = {};
            }
        }
    }

    return channels;
}
