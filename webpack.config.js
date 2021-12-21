var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    devtool: false,
    entry: path.join(__dirname, "src/js/client.js"),
    mode: process.env.NODE_ENV,
    optimization: process.env.NODE_ENV === 'production' ? {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    mangle: {
                        reserved: [
                            'Buffer',
                            'BigInteger',
                            'Point',
                            'ECPubKey',
                            'ECKey',
                            'sha512_asm',
                            'asm',
                            'ECPair',
                            'HDNode'
                        ]
                    }
                }
            })
        ]
    }: {minimize: false, minimizer: []},
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.(js||jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['react', 'env', 'stage-0'],
                            plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
                        }
                    }
                ]
            },
            {
              test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(woff2|png|svg|jpg|gif)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    },
    output: {
        path: path.join(__dirname),
        filename: "client.min.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
        },
    },

};
