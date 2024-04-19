const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");

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
   // NOTE: add the source JS file directly in the template using <script src="scripts/app.js"> tag, NOT here
   // entry: {
   //   app: [path.join(__dirname, '../src/js/app.js')],
   // },
   devServer: {
      static: {
         directory: path.resolve(__dirname, "../dist"),
         serveIndex: true,
         watch: true
      }
   },
   output: {
      path: path.resolve(__dirname, "../dist")
      //filename: 'js/[name].js', // <= MOVE into `js.filename` bundler plugin option
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
      //extensions: ['.js', '.css', '.scss'], // DON'T mix JS and SCSS extensions
      extensions: [".js"],
      modules: ["node_modules"],
      alias: {
         request$: "xhr",
         fonts: path.resolve(__dirname, "../src/fonts"),
         components: path.resolve(__dirname, "../src/components"),
         modules: path.resolve(__dirname, "../src/modules"),
         Styles: path.resolve(__dirname, "../src/styles"),
         Scripts: path.resolve(__dirname, "../src/js"), // <= use alias to define JS in the template
         images: path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets/images") // <= use alias to define source image files
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
            test: /\.(css|sass|scss)$/,
            use: [
               // MiniCssExtractPlugin.loader, // <= DELETE it
               {
                  loader: "css-loader",
                  options: {
                     sourceMap: true,
                     importLoaders: 2,
                     esModule: false
                  }
               },
               {
                  loader: "postcss-loader",
                  options: {
                     sourceMap: true
                  }
               },
               {
                  loader: "resolve-url-loader"
               },
               {
                  loader: "sass-loader",
                  options: {
                     sourceMap: true
                  }
               }
            ]
         },
         {
            // Loads fonts
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: "url-loader",
            options: {
               limit: true,
               esModule: false
            }
         },
         {
            // Load images
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/resource",
            generator: {
               filename: "assets/[name][ext]"
            }
         }
      ]
   },
   stats: {
      children: true
   },
   plugins: [

      new ESLintPlugin(),

      new CurrentTimePlugin(),

      new HtmlBundlerPlugin({
         entry: {
            article: "./src/views/article.html"
         },
         js: {
            filename: "js/[name].js"
         },
         css: {
            filename: "styles/[name].css",
            chunkFilename: "styles/[name].chunk.css"
         }
      }),

      // NOTE: you can define source image files directly in template using the webpack alias to the image directory,
      // then you don't need to copy source images into dist
      new FileManagerPlugin({
         events: {
            onEnd: [
               {delete: ["./dist/images"]},
               {
                  delete: [path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets/*")]
               },
               {
                  copy: [
                     {
                        source: path.join(__dirname, "../src/images"),
                        destination: path.join(__dirname, "../dist/images")
                     }
                  ]
               },
               {
                  copy: [
                     {
                        source: path.join(__dirname, "../dist/images"),
                        destination: path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets/images")
                     }
                  ]
               },
               {
                  copy: [
                     {
                        source: path.join(__dirname, "../dist/js"),
                        destination: path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets/js")
                     }
                  ]
               },
               {
                  copy: [
                     {
                        source: path.join(__dirname, "../dist/css"),
                        destination: path.join(__dirname, "../wp/wp-content/themes/2019-redesign/assets/css")
                     }
                  ]
               }
            ]
         }
      }),
   ]
};
