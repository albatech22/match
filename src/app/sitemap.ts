import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://kivustream.live' // Replace with your domain

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/live`,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tv`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        // You can fetch recent matches here and map them to urls
        // {
        //   url: `${baseUrl}/match/123456`,
        //   lastModified: new Date(),
        //   changeFrequency: 'hourly',
        //   priority: 0.7,
        // },
    ]
}
