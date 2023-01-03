import { URL } from 'url';

export default {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
        ],
    },
    output: {
        clean: true,
        filename: 'bundle.js',
        path: new URL('./dist', import.meta.url).pathname,
        publicPath: '/public'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};