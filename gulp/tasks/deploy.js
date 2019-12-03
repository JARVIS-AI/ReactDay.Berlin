var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var minimist = require('minimist');
var gutil = require('gulp-util');
var args = minimist(process.argv.slice(2));

gulp.task('deploy', function() {
  var remotePath = '/';
  var conn = ftp.create({
    host: 'gold.elastictech.org',
    user: args.user,
    password: args.password,
    log: gutil.log,
    parallel: 10,
  });

  // Always deploy HTML/CSS/JS
  gulp.src([
    './build/*.*',
    './build/css/**/*.*',
    './build/js/**/*.*'
  ])
    .pipe(conn.dest(remotePath));

  // Compare size of other files before deploy
  gulp.src([
    './build/**/*.*',
    '!./build/*.*',
    '!./build/css/**/*.*',
    '!./build/js/**/*.*'
  ])
    .pipe(conn.differentSize(remotePath))
    .pipe(conn.dest(remotePath));

  // Always deploy HTML
  gulp.src([
    './sponsors/*.*',
    '!./sponsors/node_modules/**/*.*',
  ])
    .pipe(conn.dest(`${remotePath}/sponsors`));

  // Compare size of other files before deploy
  gulp.src([
    './sponsors/**/*.*',
    '!./sponsors/*.*',
    '!./sponsors/node_modules/**/*.*',
  ])
    .pipe(conn.differentSize(`${remotePath}/sponsors`))
    .pipe(conn.dest(`${remotePath}/sponsors`));

  // uncomment to deploy last year versions
  // gulp.src([
  //   './2017/**/*.*'
  // ])
  //   .pipe(conn.newer(`${remotePath}/2017`))
  //   .pipe(conn.dest(`${remotePath}/2017`));
  //
  //
  // gulp.src([
  //   './2018/build/**/*.*'
  // ])
  //   .pipe(conn.newer(`${remotePath}/2018`))
  //   .pipe(conn.dest(`${remotePath}/2018`));
});
