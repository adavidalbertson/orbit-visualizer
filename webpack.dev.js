import HtmlWebpackPlugin from 'html-webpack-plugin';
import { URL } from 'url';
import common from './webpack.common.js';
import { merge } from 'webpack-merge';

export default merge(common, {
    devServer: {
        compress: true,
        port: 9000,
        static: {
            directory: new URL('./public', import.meta.url).pathname,
        },
    },
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
    ],
});