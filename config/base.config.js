const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
const { FaviconsBundlerPlugin } = require('html-bundler-webpack-plugin/plugins');

class CurrentTimePlugin {
   constructor() {
      // You can add any options you might want to pass to the plugin here
   }

   apply(compiler) {
      compiler.hooks.done.tap("CurrentTimePlugin", (stats) => {
         setTimeout(() => {
            const currentTime = new Date().toLocaleString();
            console.log("\n\n" + "=========================================================");
            console.log("\t" + `Webpack compiled at: ${currentTime}`);
            console.log("=========================================================");
         }, 100);
      });
   }
}

module.exports = {
   mode: 'production',
   devtool: 'source-map',
   devServer: {
      static: {
         directory: path.resolve(__dirname, "../dist"),
         serveIndex: true,
         watch: true
      },
      // allow browser live reload after changes
      watchFiles: {
         paths: ['src/**/*.*'],
         options: {
           usePolling: true,
         },
      },
   },
   output: {
      path: path.resolve(__dirname, "../dist"),
      clean: true,
   },
   optimization: {
      minimize: false,
      minimizer: [
         new TerserPlugin({
            parallel: true
         }),
         new CssMinimizerPlugin()
      ]
   },
   resolve: {
      extensions: ['.js', '.css', '.scss'],
      modules: ["node_modules"],
      alias: {
         // NOTE: the best practice is using the `@` prefix for aliases
         '@fonts': path.resolve(__dirname, "../src/fonts"),
         '@images': path.join(__dirname, "../src/images"),
         '@styles': path.resolve(__dirname, "../src/styles"),
         '@scripts': path.resolve(__dirname, "../src/js"),
         request$: "xhr",
         components: path.resolve(__dirname, "../src/components"),
         modules: path.resolve(__dirname, "../src/modules"),
      }
   },
   module: {
      rules: [
         {
            // babel-loader
            test: /\.js$/,
            exclude: /node_modules/,
            rules: [
               {
                  use: [
                     {
                        loader: "babel-loader",
                        options: {
                           cacheDirectory: true,
                           babelrc: false,
                           rootMode: "upward"
                        }
                     }
                  ]
               }
            ]
         },
         {
            // json loader
            test: /\.json$/,
            loader: "json-loader"
         },
         {
            // style loaders
            test: /\.(s?css|sass)$/,
            use: [
               {
                  loader: "css-loader",
               },
               {
                  loader: "postcss-loader",
               },
               {
                  loader: "sass-loader",
               }
            ]
         },
         {
            // Loads fonts
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            type: "asset/resource",
            generator: {
               filename: "assets/fonts/[name][ext]"
            }
         },
         {
            // Load images
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/resource",
            include: /[\//]images[\//]/, // process only SVG images
            generator: {
               filename: "assets/images/[name][ext]"
            }
         }
      ]
   },
   stats: {
      children: true
   },
   plugins: [
      //new ESLintPlugin(), // error: No ESLint configuration found

      new CurrentTimePlugin(),

      new HtmlBundlerPlugin({
         entry: {
            article: "src/views/article.html"
         },
         js: {
            filename: "assets/js/[name].[contenthash:8].js"
         },
         css: {
            filename: "assets/css/[name].[contenthash:8].css",
            chunkFilename: "assets/css/[name].[contenthash:8].chunk.css"
         },
      }),

      // add the build-in favicons plugin to generate favicons for various platforms
      // see https://github.com/webdiscus/html-bundler-webpack-plugin?tab=readme-ov-file#favicons-bundler-plugin
      // new FaviconsBundlerPlugin({
      //    enabled: 'auto', // true, false, auto - generate favicons in production mode only
      //    // favicons configuration options, see https://github.com/itgalaxy/favicons#usage
      //    faviconOptions: {
      //       path: 'assets/images/favicons', // favicons output path relative to webpack output.path
      //       icons: {
      //          android: true, // Create Android homescreen icon.
      //          appleIcon: true, // Create Apple touch icons.
      //          appleStartup: false, // Create Apple startup images.
      //          favicons: true, // Create regular favicons.
      //          windows: false, // Create Windows 8 tile icons.
      //          yandex: false, // Create Yandex browser icon.
      //       },
      //    },
      // }),

      new FileManagerPlugin({
         events: {
            onEnd: [
               {
                  delete: [path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets/*")]
               },
               {
                  copy: [
                     {
                        // copy all generated assets
                        source: path.join(__dirname, "../dist/assets"),
                        destination: path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets")
                     }
                  ]
               },
            ]
         }
      }),
   ]
};
