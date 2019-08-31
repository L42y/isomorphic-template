import {lstatSync, readdirSync} from 'fs';
import {join, basename} from 'path';
import {Configuration} from 'webpack';
import safeRequire from 'safe-require';
import autoprefixer from 'autoprefixer';
import JsxstylePlugin from 'jsxstyle-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import postCSSDiscardDuplicates from 'postcss-discard-duplicates';

const isDev = process.env.NODE_ENV === 'development';

const isDir = (source: string) => lstatSync(source).isDirectory();
const directory = join(__dirname, 'packages');
const packages = readdirSync(directory)
  .map(name => join(directory, name))
  .filter(isDir)
  .filter(dir => {
    const pkg = safeRequire(join(dir, 'package.json'));

    return pkg && pkg.scripts && pkg.scripts['dev:server'];
  });

const outputPath = isDev ? 'tmp' : 'dist';

const configs: Configuration[] = packages.map(
  (path): Configuration => {
    const name = basename(path);

    return {
      name: `client:${name}`,
      mode: isDev ? 'development' : 'production',
      cache: isDev,
      entry: {
        [name]: `./packages/${name}`
      },
      watch: isDev,
      output: {
        path: join(path, outputPath),
        filename: isDev ? `[name].bundle.js` : `[name].[contenthash].bundle.js`,
        publicPath: '/_/'
      },
      module: {
        rules: [
          {
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/env',
                      {
                        corejs: '3',
                        modules: false,
                        targets: 'last 1 version or > 1%',
                        useBuiltIns: 'entry'
                      }
                    ],
                    '@babel/react',
                    '@babel/typescript'
                  ]
                }
              },
              {
                loader: JsxstylePlugin.loader,
                options: {
                  classNameFormat: 'hash'
                }
              }
            ]
          },
          {
            use: [
              MiniCSSExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: [postCSSDiscardDuplicates(), autoprefixer()],
                  sourceMap: true
                }
              }
            ],
            test: /\.css$/
          }
        ]
      },
      plugins: [
        new JsxstylePlugin(),
        new ManifestPlugin(),
        new MiniCSSExtractPlugin({
          filename: isDev
            ? '[name].bundle.css'
            : '[name].[contenthash].bundle.css'
        })
      ],
      resolve: {
        extensions: ['.mjs', '.js', '.ts', '.tsx']
      },
      devtool: isDev ? 'eval-source-map' : 'source-map'
    };
  }
);

export default configs;
