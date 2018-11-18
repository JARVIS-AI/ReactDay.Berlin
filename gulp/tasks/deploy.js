var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var minimist = require('minimist');
var gutil = require('gulp-util');
var args = minimist(process.argv.slice(2));

gulp.task('deploy', function() {
  var remotePath = '/';
  var conn = ftp.create({
    host: 'buff.elastictech.org',
    user: args.user,
    password: args.password,
    log: gutil.log
  });

  gulp.src([
    './build/**/*.*'
  ])
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));

  gulp.src([
    './2017/**/*.*'
  ])
    .pipe(conn.newer(`${remotePath}/2017`))
    .pipe(conn.dest(`${remotePath}/2017`));
});
