import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/'], // Hide API routes from crawlers
        },
        sitemap: 'https://kivustream.live/sitemap.xml',
    }
}
