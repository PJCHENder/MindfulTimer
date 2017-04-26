const gulp = require('gulp')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: './'
  })

  gulp.watch('src/sass/*.sass', ['sass']).on('change', browserSync.reload)
  gulp.watch('src/js/*.js', ['concat-js']).on('change', browserSync.reload)
  gulp.watch('*.html').on('change', browserSync.reload)
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  return gulp.src('src/sass/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('src/sass/'))
        .pipe(browserSync.stream())
})

// Create CSS AutoPrefix
gulp.task('auto_prefix', function () {
  gulp.src('src/sass/*.css')
        .pipe(autoprefixer({
          browsers: ['> 5%'],
          cascade: false
        }))
        .pipe(gulp.dest('src/sass/'))
})

//  minify-css
gulp.task('minify-css', function () {
  gulp.src(['src/sass/*.css', 'vendor/*.css'])
    .pipe(cleanCSS())
    .pipe(concat('main.css'), {newLine: ''})
    .pipe(gulp.dest('./dist'))
})

//  將不同的 js 檔案合併在同一支當中
gulp.task('concat-js', function () {
  return gulp.src(['vendor/jquery-3.1.1.js', 'vendor/tether.min.js', 'vendor/bootstrap.min.js', 'vendor/sweetalert2.min.js', 'vendor/lodash.min.js', 'src/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['sass', 'concat-js', 'serve'])
gulp.task('build', ['sass', 'auto_prefix', 'minify-css', 'concat-js'])
