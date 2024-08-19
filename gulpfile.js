import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass';
import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';

const sassCompiler = gulpSass(sass);

gulp.task('css', function() {
    console.log('minifying css...');

    gulp.src('./assets/sass/**/*.scss')
        .pipe(sassCompiler())
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css'));

    return gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
});
