/* подключенные плагины*/
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	cssnano = require('gulp-cssnano'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache');
	autoprefixer = require('gulp-autoprefixer');
	sourcemaps = require('gulp-sourcemaps');

/* основные пути*/
var path = {
	sassDev: 'app/sass/**/*.scss',
	htmlDev: 'app/*.html',
	jsDev: 'app/js/**/*.js',
	imgDev: 'app/img/**/*',
	cssPath: 'app/css',
	dist: 'dist'

};

/* таск преобразования scss в css*/
gulp.task('sass', function(){
	gulp.src('app/sass/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(path.cssPath))
	.pipe(sourcemaps.write())
	.pipe(browserSync.reload({stream: true}));
});


/* такс синхронизации изменения кода из окном браузера */
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

/* минификация стилей */
// gulp.task('css-min', ['sass'], function(){
// 	return gulp.src('app/css/main.css')
// 	.pipe(cssnano())
// 	.pipe(rename({suffix: '.min'}))
// 	.pipe(gulp.dest(path.cssPath));
// });

gulp.task('cssmin', ['sass'], function(){
	gulp.src('app/css/main.css')
	.pipe(cssmin())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css/'));
});

/* сжатие изображений */
gulp.task('img', function(){
	return gulp.src(path.imgDev)
			.pipe(cache(imagemin({
				interlaced: true,
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			})))
			.pipe(gulp.dest('dist/img'));
});

/* слежение за изменениями */
gulp.task('watch', ['browser-sync', 'cssmin'], function(){
	gulp.watch(path.sassDev, ['sass']);
	gulp.watch(path.htmlDev, browserSync.reload);
	gulp.watch(path.jsDev, browserSync.reload);
});

/* удаление ресурсов */
gulp.task('del', function(){
	return del.sync(path.dist);
});

/* очистка кеша gulp */
gulp.task('clear', function(){
	return cache.clearAll();
});

/* реализация продакшена проекта */
gulp.task('build', ['del', 'img', 'cssmin'], function(){
	var buildCss = gulp.src('app/css/*.css')
					.pipe(gulp.dest('dist/css'));
	var buildFonts = gulp.src('app/fonts/**/*')
					.pipe(gulp.dest('dist/fonts'));
	var bildJs = gulp.src('app/js/**/*')
					.pipe(gulp.dest('dist/js'));
	var buildHtml = gulp.src('app/*.html')
					.pipe(gulp.dest('dist'));														
});

gulp.task('default', ['watch']);