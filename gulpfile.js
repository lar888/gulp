import { series, src, dest, watch } from 'gulp'
import gulpSass from 'gulp-sass'
import * as sass from 'sass'
import browserSync from 'browser-sync'
import postcss from 'gulp-postcss'
import csscomb from 'gulp-csscomb'
import cssnano from 'cssnano'
import rename from 'gulp-rename'
import autoprefixer from 'autoprefixer'
import sortCSSmq from 'sort-css-media-queries';
import mqpacker from 'css-mqpacker'

const sassCompiler = gulpSass(sass)

const PATH = {
	scssFolder: './src/scss/',
	scssRootFile: './src/scss/style.scss',
	scssAllFiles: './src/scss/**/*.scss',
	cssFolder: './assets/css',
	htmlAllFiles: './*.html',
	jsAllFiles: './src/**/*.js',
}

const PLUGINS = [
	mqpacker({
		sort: sortCSSmq
	}),
	autoprefixer({
		overrideBrowserslist: ['last 5 versions', '> 0.1%']
	})
]

function compileScss() {
	return src(PATH.scssRootFile)
		.pipe(sassCompiler()).on('error', sassCompiler.logError)
		.pipe(postcss(PLUGINS))
		.pipe(dest(PATH.cssFolder))
		.pipe(browserSync.stream())
}

function compileScssMin() {
	const pluginsForMinify = [...PLUGINS, cssnano({ preset: 'default' })]

	return src(PATH.scssRootFile)
		.pipe(sassCompiler().on('error', sassCompiler.logError))
		.pipe(postcss(pluginsForMinify))
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest(PATH.cssFolder))
}

function compileScssDev() {
	const pluginsForDevMode = [...PLUGINS]
	pluginsForDevMode.splice(1, 1)

	return src(PATH.scssRootFile, { sourcemaps: true })
		.pipe(sassCompiler().on('error', sassCompiler.logError))
		.pipe(postcss(pluginsForDevMode))
		.pipe(dest(PATH.cssFolder, { sourcemaps: true }))
		.pipe(browserSync.stream())
}

function comb() {
	return src(PATH.scssAllFiles).pipe(csscomb()).pipe(dest(PATH.scssFolder))
}

function serverInit() {
	browserSync({
		server: { baseDir: './' },
		notify: false
	})
}

async function sync() {
	browserSync.reload()
}

function watchFiles() {
	serverInit()
	watch(PATH.scssAllFiles, compileScss)
	watch(PATH.htmlAllFiles, sync)
	watch(PATH.jsAllFiles, sync)
}

export { compileScss, compileScssMin, compileScssDev, comb, serverInit, sync, watchFiles }

export const scss = series(compileScss, compileScssMin)
export const min = compileScssMin
export const dev = compileScssDev
export const combTask = comb
export const startWatch = watchFiles