const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: ['.js'] },
        module: {
            rules: [
                { test: /\.(jpg|gif|png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        entry: {
            vendor: [
                // 'jquery',
                // 'tether',
                // 'bootstrap',
                // 'bootstrap/dist/css/bootstrap.css',
                // 'jquery-slimscroll',
                // 'waves/dist/waves.js',
                // './Content/js/sidebarmenu.js',
                // 'sticky-kit/dist/sticky-kit.js',
                // './Content/js/custom.js',
                // 'chartist',
                // 'chartist/dist/chartist.min.css',
                // 'chartist/dist/chartist-init.min.css',
                // 'echarts',
                // 'chartist-plugin-tooltip',
                // './Content/css/chartist-plugin-tooltip.css',
                // './Content/css/css-chart.css',
                // 'jquery-toast-plugin',
                // 'jquery-toast-plugin/dist/jquery.toast.min.css',
                // './Content/js/dashboard1.js',
                // './Content/js/toastr.js',
                // './assets/styleswitcher/jQuery.style.switcher.js',
                // './Content/css/style.css',

                'angular2-patternfly-shims',
                'core-js/es6/symbol',
                'core-js/es6/object',
                'core-js/es6/function',
                'core-js/es6/parse-int',
                'core-js/es6/parse-float',
                'core-js/es6/number',
                'core-js/es6/math',
                'core-js/es6/string',
                'core-js/es6/date',
                'core-js/es6/array',
                'core-js/es6/regexp',
                'core-js/es6/map',
                'core-js/es6/weak-map',
                'core-js/es6/set',
                'intl',
                'es6-shim',
                'es6-promise',
                '@angular/animations',
                '@angular/common',
                '@angular/compiler',
                '@angular/core',
                '@angular/forms',
                '@angular/http',
                '@angular/platform-browser',
                '@angular/platform-browser-dynamic',
                '@angular/router',
                'zone.js',
                // 'angular2-fontawesome',
                // './node_modules/ng-pick-datetime/assets/style/picker.min.css',
                './node_modules/font-awesome/css/font-awesome.css',
                // './script-code/assets/css/umbraco.css',
                // './script-code/assets/fonts/Dimbo Italic.ttf',
                './script-code/styles.css',
                // "./script-code/assets/js/jquery-3.1.0.min.js",
                // "./script-code/assets/js/helper.js",
                // "./script-code/assets/js/owl.carousel.min.js",
                // "./script-code/assets/js/select2.min.js",
                // "./script-code/assets/js/imagesloaded.pkgd.min.js",
                // "./script-code/assets/js/isotope.pkgd.min.js",
                // "./script-code/assets/js/jquery.magnific-popup.min.js",
                // "./script-code/assets/js/template.js"
                // 'bootstrap-datepicker',
                // 'bootstrap-timepicker',
            ]

        },
        output: {
            publicPath: '/dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery' }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
            new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(__dirname, './script-code')), // Workaround for https://github.com/angular/angular/issues/11580
            new webpack.ContextReplacementPlugin(/angular(\\|\/)core(\\|\/)@angular/, path.join(__dirname, './script-code')), // Workaround for https://github.com/angular/angular/issues/14898
            new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: path.join(__dirname, 'dist') },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) },
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
        plugins: [
            extractCSS,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: { mainFields: ['main'] },
        output: {
            path: path.join(__dirname, 'script-code', 'dist'),
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [{ test: /\.css(\?|$)/, use: ['to-string-loader', isDevBuild ? 'css-loader' : 'css-loader?minimize'] }]
        },
        entry: { vendor: ['aspnet-prerendering'] },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'script-code', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
}
