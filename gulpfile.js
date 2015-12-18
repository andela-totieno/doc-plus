var gulp = require('gulp'),
  gutil = require('gulp-util'),
  less = require('gulp-less'),
  jade = require('gulp-jade'),
  path = require('path'),
  imagemin = require('gulp-imagemin'),
  nodemon = require('gulp-nodemon'),
  bower = require('bower'),
  jasmine = require('gulp-jasmine'),
  browserify = require('browserify'),
  paths = {
    public: 'public/**',
    jade: ['!app/shared/**', 'app/**/*.jade'],
    scripts: 'app/**/*.js',
    images: 'app/images/**/*',
    staticFiles: [
      '!app/**/*.+(less|css|js|jade)',
      '!app/images/**/*',
      'app/**/*.*'
    ],
    styles: 'app/styles/*.+(less|css)'
  };



gulp.task('default', function() {
  console.log('Everything is working out okay');
});


gulp.task('jade', function() {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'));
});

gulp.task('less', function() {
  gulp.src(paths.styles)
    .pipe(less({
      paths: [path.join(__dirname, './app/styles')]
    }))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('public/lib/'));
});

gulp.task('nodemon', function() {
  nodemon({
      script: 'index.js',
      ext: 'js',
      ignore: ['public/', 'node_modules/']
    })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('>> node restart');
    });
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('static-files', function() {
  return gulp.src(paths.staticFiles)
    .pipe(gulp.dest('public/'));
});

// gulp.task('test:fend', function() {
//   // Be sure to return the stream
//   return gulp.src(paths.unitTests)
//     .pipe(karma({
//       configFile: __dirname + '/karma.conf.js',
//       // autoWatch: false,
//       // singleRun: true
//       action: 'run'
//     }))
//     .on('error', function(err) {
//       // Make sure failed tests cause gulp to exit non-zero
//       throw err;
//     });
// });

// gulp.task('default', function () {
//   return gulp.src('spec/src/document_spec.js')
//     // gulp-jasmine works on filepaths so you can't have any plugins before it
//     .pipe(jasmine());
// });

// gulp.task('browserify', function() {
//   return browserify('./app/scripts/application.js').bundle()
//     .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
//     .on('error', gutil.log.bind(gutil, 'Browserify ' +
//       'Error: in browserify gulp task'))
//     // vinyl-source-stream makes the bundle compatible with gulp
//     .pipe(source('application.js')) // Desired filename
//     // Output the file
//     .pipe(gulp.dest('./public/js/'));
// });

gulp.task('watch', function() {
  // livereload.listen({ port: 35729 });
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.scripts, ['browserify']);
  // gulp.watch(paths.public).on('change', livereload.changed);
});

gulp.task('build', ['jade', 'less', 'static-files',
  'images', 'browserify', 'bower'
]);
gulp.task('heroku:production', ['build']);
gulp.task('heroku:staging', ['build']);
gulp.task('production', ['nodemon', 'build']);
gulp.task('test', ['test:fend', 'test:bend']);
gulp.task('default', ['nodemon', 'watch', 'build']);