var gulp           = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
var nunjucks = require('nunjucks');
var plumber        = require('gulp-plumber');
var gulpif         = require('gulp-if');
var changed        = require('gulp-changed');
var prettify       = require('gulp-prettify');
var frontMatter    = require('gulp-front-matter');
var config         = require('../config');
var data           = require('gulp-data');
var markdown       = require('nunjucks-markdown');
var marked         = require('marked');

var { getContent } = require('../../content');

var templates = 'src/templates'; //Set this as the folder that contains your nunjuck files

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templates));

// The second argument can be any function that renders markdown
markdown.register(env, marked);

function renderHtml(onlyChanged) {
    nunjucksRender.nunjucks.configure({
        watch: false,
        trimBlocks: true,
        lstripBlocks: false
    });

    return gulp
        .src([config.src.templates + '/**/[^_]*.html'])
        .pipe(plumber({
            errorHandler: config.errorHandler
        }))
        .pipe(gulpif(onlyChanged, changed(config.dest.html)))
        .pipe(frontMatter({ property: 'data' }))
        .pipe(data(() => getContent()))
        .pipe(nunjucksRender({
            PRODUCTION: config.production,
            path: [config.src.templates]
        }))
        .pipe(prettify({
            indent_size: 2,
            wrap_attributes: 'auto', // 'force'
            preserve_newlines: false,
            // unformatted: [],
            end_with_newline: true
        }))
        .pipe(gulp.dest(config.dest.html));
}

gulp.task('nunjucks', function() {
    return renderHtml();
});

gulp.task('nunjucks:changed', function() {
    return renderHtml(true);
});

gulp.task('nunjucks:watch', function() {
    gulp.watch([
        config.src.templates + '/**/[^_]*.html'
    ], ['nunjucks:changed']);

    gulp.watch([
        config.src.templates + '/**/_*.html'
    ], ['nunjucks']);
});
