/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        appDir: true,
    },
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(MP3)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    publicPath: `/_next/static/sounds/`,
                    outputPath: `${options.isServer ? '../' : ''}static/sounds/`,
                },
            },
        });

        return config;
    },
    i18n: {
        locales: ['en'],
        defaultLocale: 'en',
    },
};

module.exports = nextConfig;
