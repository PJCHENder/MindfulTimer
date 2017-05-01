const gulp = require('gulp')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')

// Static Server + watching scss/html files
gulp.task('serve', function () {
  browserSync.init({
    server: './'
  })

  gulp.watch('src/sass/*.scss', ['sass']).on('change', browserSync.reload)
  gulp.watch('src/js/*.js', ['concat-js']).on('change', browserSync.reload)
  gulp.watch('*.html').on('change', browserSync.reload)
})

//  將不同的 js 檔案合併在同一支當中
gulp.task('concat-js', function () {
  return gulp.src([
          'vendor/jquery-3.1.1.js',
          'vendor/tether.min.js',
          'vendor/bootstrap.min.js',
          'vendor/sweetalert2.min.js',
          'vendor/lodash.min.js',
          'src/js/*.js'
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist'))
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/sass/'))
        .pipe(browserSync.stream())
})

// Create CSS AutoPrefix
gulp.task('auto_prefix', ['sass'], function () {
  return gulp.src('src/sass/*.css')
        .pipe(autoprefixer({
          browsers: ['> 5%'],
          cascade: false
        }))
        .pipe(gulp.dest('src/sass/'))
})

//  clean-css
gulp.task('clean-css', ['sass', 'auto_prefix'], function () {
  return gulp.src(['vendor/*.css', 'src/sass/*.css'])
        .pipe(cleanCSS())
        .pipe(concat('main.css'), {newLine: ''})
        .pipe(gulp.dest('./dist'))
})



gulp.task('default', ['clean-css', 'concat-js', 'serve'])
gulp.task('build', ['clean-css', 'concat-js'])
