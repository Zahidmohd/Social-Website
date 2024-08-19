import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import rev from 'gulp-rev';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import { deleteAsync } from 'del';

const sass = gulpSass(dartSass);

// Define tasks using ES module syntax
export const css = (done) => {
    console.log('minifying css...');
    gulp.src('./assets/scss/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css'));

    gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
};

export const js = (done) => {
    console.log('minifying js...');
    gulp.src('./assets/**/*.js')
        .pipe(terser())  // Changed to terser
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
};

export const images = (done) => {
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            cwd: 'public',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
};

export const cleanAssets = (done) => {
    deleteAsync(['./public/assets']);
    done();
};

export const build = gulp.series(cleanAssets, css, js, images, (done) => {
    console.log('Building assets');
    done();
});
