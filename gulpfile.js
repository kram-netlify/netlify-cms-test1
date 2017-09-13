// require modules
// ---------------
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const fs = require("fs");
const sassGlob = require('gulp-sass-glob');
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const cssimport = require("gulp-cssimport");
const Jimp = require("jimp");
const path = require('path');

// NW Modules
const Paths = require('./lib/paths.js').Paths;

// nw build config
// ---------------
const NWDEVMODE = true;

// paths
// -----
const paths = new Paths({
    srcBase: 'src',
    destBase: 'public-static-site/static'
});
const compiledPugPath = paths.getDestSubfolder('html');
const compiledSCSSPath = paths.getDestSubfolder('css');
const compiledJSPath = paths.getDestSubfolder('js');
const watchSCSSPath = paths.getWatchCss();
const watchJsPath = paths.getWatchJs();
const watchPugPath =  paths.getWatchHtml();
const mainSCSSFilePath = paths.getSrcCssMainFile();
const mainJsFilePath =  paths.getSrcJsMainFile();
const mainDataFilePath =  paths.getSrcDataMainFile();
const mainHtmlViewsSrcPath =  paths.getSrcSubfolder('html') + '/views/**/*.pug';

// DATA
// ----

// CMS DATA
const CmsDataContainer = require('./lib/cms-data-container').CmsDataContainer;
const cmsData = new CmsDataContainer();
console.log(cmsData);

// VIEW DATA
const viewData = {
    devMode: NWDEVMODE,
    currentFileName: null,
    data: {
        posts: cmsData.posts
    },
};

// tool options
// ------------
const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    //includePaths: [ 'src' ]
};
const autoPrefixerOptions = {
    browsers: [
        'ie >= 10',
        'Firefox >= 22',
        'Safari >= 6',
        'Chrome >= 29'
    ]
};

// tasks
// -----//tmp image test

gulp.task('thumbnails', function () {
    const thumbs = [
        {
            title: 'square',
            trans: {
                cover: [200, 200]
            }
        },
        {
            title: 'fullWidth',
            trans: {
                scaleToFit: [1920, 9999]
            }
        }
    ];

    let folderPath = paths.getSrcSubfolder('img');
    fs.readdir(folderPath, (err, files) => {
        files.forEach(file => {
            let src = paths.getSrcSubfolder('img') + '/' + file;
            let srcExtName = path.extname(src);
            let srcNameWithoutExt = path.basename(src , srcExtName);
            let dest = paths.getDestSubfolder('img') + '/' + file;
            Jimp.read(src, function (err, image) {
                let innerImage = image;
                if (err) throw err;
                thumbs.forEach(function(item){
                    if(item.trans.cover){
                        innerImage.cover(item.trans.cover[0], item.trans.cover[1]);
                        dest = paths.getDestSubfolder('img') + '/' +  'cover__' + item.trans.cover[0] + '-' + item.trans.cover[1] + '__' + srcNameWithoutExt + srcExtName;
                        innerImage.write(dest);
                    }
                    //innerImage.write(dest); // save
                });
            });
        });
    });
});


gulp.task('sass', function () {
    let sassCompiledStream =  gulp.src(mainSCSSFilePath)
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass(sassOptions))
        .on('error', swallowError)
        .pipe(autoprefixer(autoPrefixerOptions));
    if(!NWDEVMODE){
        sassCompiledStream = sassCompiledStream.pipe(cssimport());
    }
    return sassCompiledStream.pipe(rename('main-dist.css'))
        .pipe(gulp.dest(compiledSCSSPath))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(mainJsFilePath)
    .pipe(babel({
        presets: ['env'] // maybe should be defined (browser versions..)
    }))
    .pipe(rename('main-dist.js'))
    .pipe(gulp.dest(compiledJSPath))
    .pipe(browserSync.stream());
});

gulp.task('jslibs', function () {
    return browserify({
            entries: paths.getSrcJsLibFile(),
            debug: false
        })
        .bundle()
        .pipe(source('libs-dist.js'))
        .pipe(gulp.dest(paths.getDestSubfolder('js')));
});

gulp.task('pug', function () {
    // external file data
	// let templateData = fs.readFileSync(mainDataFilePath);
	// viewData.data = JSON.parse(templateData);
	// return
    return gulp.src(mainHtmlViewsSrcPath)
        .pipe(pug({
            data: viewData
        }))
        .pipe(gulp.dest(compiledPugPath))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass', 'pug', 'js', 'jslibs'], function() {

    browserSync.init({
        server: 'public-static-site',
        startPath: '/html'
    });

    gulp.watch(watchSCSSPath, ['sass']);
    gulp.watch(watchPugPath, ['pug']);
    gulp.watch(watchJsPath, ['js']);
});


// file watchers
gulp.task('default', ['serve']);

// functions
// ---------
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}
