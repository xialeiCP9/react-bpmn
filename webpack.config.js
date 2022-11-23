const { resolve, join } = require("path");
const fs = require("fs");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => resolve(appDirectory, relativePath);

module.exports = {
    mode: "development",
    // 组件库的起点入口
    entry: [
        "webpack/hot/dev-server",
        "webpack-dev-server/client?http://localhost:8080",
        resolve(__dirname, "./src/index.tsx")
    ],
    output: {
        filename: "[name].umd.js", // 打包后的文件名
        path: resolve(__dirname, "dist"), // 打包后的文件目录：根目录/dist/
        library: "rui", // 导出的UMD js会在window挂rui，即可访问 window.rui
        libraryTarget: "umd" // 导出库为UMD形式
    },
    devServer: {
        hot: true,
        port: 8080,
    },
    resolve: {
        // webpack默认只处理js、jsx等js代码
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            "@": resolveApp("src")
        }
    },
    // externals: {
    //     // 打包过程遇到以下依赖导入，不会打包对应库代码，而是调用window上的React和ReactDOM
    //     /**
    //      * import React from "react"
    //      * import ReactDOM from "react-dom"
    //      */
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // },
    // 模块
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ],
                exclude: [resolve(__dirname, "./node_modules"), resolve(__dirname, "src/assets/fonts")]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader"
                ],
                include: [resolve(__dirname, "./node_modules"), resolve(__dirname, "src/assets/fonts")]
            },
            {
                test: /\.less$/,
                // webpack中的顺序是【从后向前】链式调用的
                // 所以对于less先交给less-loader处理，转为css
                // 再交给css-loader
                // 最后导出css（MiniCssExtractPlugin.loader）
                // 所以注意loader的配置顺序
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[path][name]-[local]--[hash:base64:5]"
                            },
                            sourceMap: true
                        }
                    },
                    "less-loader"
                ]
            },
            {
                test: /\.(xml|bpmn)$/,
                use: "raw-loader"
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "svg-sprite-loader",
                        options: {
                            symbolId: "icon-[name]"
                        }
                    },
                    {
                        loader: "svgo-loader"
                    }
                ],
                include: [resolve("src/icons")]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: "asset/resource",
                exclude: /node_modules/
            }
        ]
    },
    // 2.2以上版本，plugins要写在module.exports下，以下，需要写在 rules同级
    plugins: [
        // 插件用于最终的导出独立的css的工作
        new MiniCssExtractPlugin({
            filename: "bundle.umd.css"
        }),
        new HtmlWebPackPlugin({
            title: "react-bpmn项目",
            template: resolveApp('public/index.html')

        })
    ]
}