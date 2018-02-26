const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.ts$/, include: /(script-code|admin|config|core-services|modules)/, use: ['awesome-typescript-loader?silent=true', 'angular2-template-loader'] },
                { test: /\.html$/, use: 'html-loader?minimize=false' },
                { test: /\.css$/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }
            ]
        },
        plugins: [new CheckerPlugin()]
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './dist';
    const clientBundleConfig = merge(sharedConfig, {
        entry: {
            'polyfills': './script-code/polyfills.ts',
            'main-client': './script-code/app/main.ts'
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new webpack.optimize.UglifyJsPlugin()
            ])
    });

    // const adminBundleOutputDir = './admin';
    // const adminBundleConfig = merge(sharedConfig, {
    //     entry: {
    //         'admin-app': './admin/app/main.ts'
    //     },
    //     output: { path: path.join(__dirname, clientBundleOutputDir) },
    //     plugins: [
    //         new webpack.DllReferencePlugin({
    //             context: __dirname,
    //             manifest: require('./dist/vendor-manifest.json')
    //         })
    //     ].concat(isDevBuild ? [
    //         // Plugins that apply in development builds only
    //         new webpack.SourceMapDevToolPlugin({
    //             filename: '[file].map', // Remove this line if you prefer inline source maps
    //             moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
    //         })
    //     ] : [
    //             // Plugins that apply in production builds only
    //             new webpack.optimize.UglifyJsPlugin()
    //         ])
    // });

    return [clientBundleConfig];
};
