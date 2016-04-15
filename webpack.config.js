// webpack.config.js

var webpack = require('webpack');

// path root helper variables
var paths = {
    node : __dirname + "/node_modules",
    src : __dirname + "/src"
};


module.exports = {

    // our entry script to make the bundle
    entry: {
        background : "./src/js/entry/background.js"
    },
    // where to send final bundle
    output: {
        path: __dirname + "/build/js/",
        filename: "[name]-bundle.js"
    },


    resolve: {
        modulesDirectories : ["web_modules", "node_modules", "bower_modules"],

        // set of aliases to make requires nicer and symantic
        alias: {


        }
    },

    // modules to include globally (the key is the variable it will be)
    plugins: [
        new webpack.ProvidePlugin({
            "_"               : "underscore",

            // jquery and some external plugins
            $                 : 'jquery',
            jQuery            : 'jquery'
        })
    ]

    // module: {
    //     loaders: [
    //         {
    //             test: /masonry-layout|imagesloaded/,
    //             loader: 'imports?define=>false&this=>window'
    //         },
    //         {
    //             test: /.modernizrrc/,
    //             loader: "modernizr"
    //         }
    //     ]
    // }

};