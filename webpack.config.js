const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const libsJs = Object.assign({}, { module: {} }, {
    entry: {
        vendor: [
            'script-loader!uglify-loader!./node_modules/vue/dist/vue.min.js',
            'script-loader!uglify-loader!./node_modules/vue-router/dist/vue-router.min.js',
            'script-loader!uglify-loader!./node_modules/vuex/dist/vuex.min.js'
        ]
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle-libs.js"
    },
});


const styleCss = Object.assign({}, { module: {} }, {
    entry: [
        './node_modules/bootstrap/scss/bootstrap.scss',
        './style/scss/app.scss'
    ],
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './dist/',
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ]
});

const localJs = {
    entry: [
        'script-loader!./src/App.js'
    ],
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ]
};

module.exports = [libsJs, styleCss, localJs];