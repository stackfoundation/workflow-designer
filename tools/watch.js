require('shelljs/global');
var webpack = require('webpack'),
    WebpackDevServer = require("webpack-dev-server"),
    config = require('../webpack.config.js'),
    compiler = webpack(config),
    common = require('./common'),
    notifier = require('node-notifier');;



if (common.argv['serve']) {
    var server = new WebpackDevServer(compiler, {
        contentBase: common.outputDir(),
        hot: true,
        historyApiFallback: true,
        compress: true,
        filename: "bundle.js",
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000
        }
      });
    
      server.listen(8080, "localhost", function() {});
}
else {
    compiler.apply(new webpack.ProgressPlugin({profile: true}));
    
    compiler.watch({}, function(err, stats) {
        console.log(stats.toString({colors: true}));
        
        if (stats.hasErrors()) {
            notifier.notify({
                'title': 'Error in build',
                'message': ' '
            });
        }
        else {
            notifier.notify({
                'title': 'Build Successful',
                'message': ' '
            });
        }
    });
}