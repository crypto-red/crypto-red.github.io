var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: process.env.NODE_ENV === 'production' ? "inline-source-map": false,
    entry: path.join(__dirname, "src/js/client.js"),
    mode: process.env.NODE_ENV,
    optimization: process.env.NODE_ENV === 'production' ? {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    toplevel: true,
                    extractComments: false,
                    mangle: {
                        toplevel: true,
                        eval: true,
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
                    },
                    compress: {
                        drop_console: true,
                        passes: 3,
                    },
                    output: {
                        comments: false,
                        beautify: false,
                    },
                }
            })
        ],
        chunkIds: 'named',
        splitChunks: {
            chunks: 'async',
            minSize: 200 * 1024,
            maxSize: 600 * 1024,
            minChunks: 2,
            maxAsyncRequests: 8,
            maxInitialRequests: 8,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: false
                }
            }
        }
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
                            presets: ['react', 'env', 'stage-0']
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
        ]
    },
    output: {
        path: path.join(__dirname),
        filename: "father-chunk.norris.min.js",
        chunkFilename: "child-chunk.[id].min.js",
    },
    resolve: {
        alias: {
            'bn.js': path.join(__dirname, 'node_modules/bn.js/lib/bn.js'),
        }
    },
    plugins: process.env.NODE_ENV === "development" ? [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html"
        }),
        new BundleAnalyzerPlugin()
    ]: [new BundleAnalyzerPlugin()],
    devServer: {
        static: {
            directory: path.join(__dirname, "/"),
        },
        client: {
            reconnect: false,
        },
        hot: false,
        liveReload: false,
    },
};
