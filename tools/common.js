var path = require('path');
var argv = require('minimist')(process.argv, { boolean: ['prod', 'production', 'serve'] });

function computeBaseDir() {
        var baseDir;
        if (argv.base) {
            baseDir = path.dirname(argv.base);
        } else {
            baseDir = path.dirname(argv.entry);
        }
        if (path.basename(baseDir) === 'src') {
            baseDir = path.dirname(baseDir);
        }

        return baseDir;
}

function computeRootDir(fullPath) {
    while (fullPath && fullPath.length > 0 && path.basename(fullPath) !== 'stack.foundation') {
        fullPath = path.dirname(fullPath);
    }

    return fullPath;
}

module.exports = {
    argv: argv,
    baseDir: function() {
        return computeBaseDir();
    },
    outputDir: function() {
        return path.resolve(computeBaseDir(), 'build');
    },
    rootDir: function() {
        return computeRootDir(path.resolve(argv.entry));
    }
};
