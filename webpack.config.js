var path = require('path');
var common = require('./tools/common');
var webpack = require('webpack');
var fs = require('fs');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
var blobPlugin = require('less-plugin-glob');

var baseDir = common.baseDir();
var outputDir = common.outputDir();
var production = common.argv.prod || common.argv.production;
var compress = common.argv.compress || common.argv.gzip;

console.log('Using entrypoint: ' + common.argv.entry);
console.log('Using base: ' + baseDir)
console.log('Using output: ' + outputDir)

var plugins = [];

if (production) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: true,
            comments: false,
            sourceMap: false
        }),
        new WebpackBundleSizeAnalyzerPlugin(path.resolve(outputDir, 'size-report.txt')),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            },
            'global': 'window'
        })
    );
} else {
    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            },
            'global': 'window'
        })
    );
}

if (compress) {
    plugins.push(new CompressionPlugin());
}

if (common.argv.serve) {
    console.log('Treating ' + baseDir + ' as a web application');
    plugins.push(
        new CopyWebpackPlugin([
            {
                from: path.resolve(baseDir, 'index.html'), to: path.resolve(outputDir, 'index.html'),
                transform: function (content, path) {
                    if (compress) {
                        return content.toString()
                            .replace(new RegExp('/bundle.js', 'g'), '/bundle.js.gz');
                    }
                    return content.toString();
                }
            },
        ]),
        function () {
            this.plugin("done", function (stats) {
                let indexPath = path.resolve(outputDir, 'index.html');
                // fs.writeFileSync(indexPath, fs.readFileSync(indexPath).toString().replace(/(\.\/)?bundle\.([a-zA-Z0-9\.]*)js/, stats.compilation.chunks[0].files[0]));
            });
        });
}

module.exports = {
    devtool: 'source-map',
    entry: common.argv.entry,
    output: {
        path: outputDir,
        publicPath: '/',
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.webpack.js', '.web.js', '.js', '.html']
    },
    module: {
        rules: [
            { test: /\.html$/, loader: 'raw-loader' },
            {
                test: /\.css$/, use: [
                    { loader: 'style-loader' },
                    { loader: "css-loader" }]
            },
            {
                test: /\.less$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                            root: true,
                            plugins: [blobPlugin],
                            paths: []
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            "baseUrl": "",
                            "target": "es5",
                            "module": "esnext",
                            "moduleResolution": "node",
                            "declaration": false,
                            "noImplicitAny": false,
                            "sourceMap": true,
                            "emitDecoratorMetadata": true,
                            "experimentalDecorators": true,
                            "traceResolution": true,
                            "outDir": "./dist",
                            "rootDir": process.cwd(),
                            "skipLibCheck": true,
                            "types": ["node"],
                            "typeRoots": ["node_modules/@types"],
                            "lib": ["es2015", "dom"]
                        }
                    }
                }]
            },
            {
                test: /\.(ttf|eot|svg|png|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: plugins
};
