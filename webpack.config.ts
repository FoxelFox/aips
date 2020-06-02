import * as webpack from 'webpack'
import * as path from "path";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import CopyWebpackPlugin = require('copy-webpack-plugin');

const config: webpack.Configuration & {devServer} = {
	entry: path.join(__dirname, '/src/main.ts'),
	output: {
		filename: 'main.js',
		path: __dirname + '/dist'
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			loader: 'ts-loader',
			exclude: /node_modules/,
			options: {
				transpileOnly: true
			}
		}]
	},
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 1234
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'AI Physics Sandbox'
		}),
		new CopyWebpackPlugin({
			patterns: [{
				from: 'node_modules/@enable3d/ammo-physics/ammo', to: 'lib'
			}]
		})
	]
}

export default config;