const webpack = require("webpack")
const path = require("path")
const fileSystem = require("fs")
const env = require("./utils/env")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WriteFilePlugin = require("write-file-webpack-plugin")
const ZipPlugin = require("zip-webpack-plugin")

// load the secrets
const alias = {}

const secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js")

const fileExtensions = [
	"jpg",
	"jpeg",
	"png",
	"gif",
	"eot",
	"otf",
	"svg",
	"ttf",
	"woff",
	"woff2",
]

if (fileSystem.existsSync(secretsPath)) {
	alias["secrets"] = secretsPath
}

var options = {
	mode: "production",
	entry: {
		popup: path.join(__dirname, "src", "js", "popup.js"),
		options: path.join(__dirname, "src", "js", "options.js"),
		background: path.join(__dirname, "src", "js", "background.js"),
		"content-script": path.join(__dirname, "src", "js", "content-script.js"),
	},
	output: {
		path: path.join(__dirname, "build"),
		filename: "[name].bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: "style-loader!css-loader",
				exclude: /node_modules/,
			},
			{
				test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
				loader: "file-loader?name=[name].[ext]",
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: "html-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: "svelte-loader",
					options: {
						emitCss: false,
						hotReload: false,
					},
				},
			},
		],
	},
	resolve: {
		alias: alias,
	},
	plugins: [
		// clean the build folder
		new CleanWebpackPlugin(["build"]),
		// expose and write the allowed env vars on the compiled bundle
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
		}),
		new CopyWebpackPlugin([
			{
				from: "src/manifest.json",
				transform: function(content, path) {
					// generates the manifest file using the package.json informations
					return Buffer.from(
						JSON.stringify({
							description: process.env.npm_package_description,
							version: process.env.npm_package_version,
							...JSON.parse(content.toString()),
						})
					)
				},
			},
			{
				from: "src/css/tailwind.min.css",
			},
		]),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src", "popup.html"),
			filename: "popup.html",
			chunks: ["popup"],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src", "options.html"),
			filename: "options.html",
			chunks: ["options"],
		}),
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src", "background.html"),
			filename: "background.html",
			chunks: ["background"],
		}),
		new WriteFilePlugin(),
		new ZipPlugin({
			// OPTIONAL: defaults to the Webpack output path (above)
			// can be relative (to Webpack output path) or absolute
			path: "../zip",

			// OPTIONAL: defaults to the Webpack output filename (above) or,
			// if not present, the basename of the path
			filename: "SpacedLeet.zip",
		}),
	],
}

if (env.NODE_ENV === "development") {
	options.devtool = "cheap-module-eval-source-map"
}

module.exports = options
