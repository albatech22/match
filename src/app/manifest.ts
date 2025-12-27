import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Kivu Stream',
        short_name: 'KivuStream',
        description: 'Scores de football en direct et streaming',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/assets/images/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            },
            {
                src: '/assets/images/icon-512.png',
                sizes: '192x192',
                type: 'image/png',
            }
        ],
    }
}
