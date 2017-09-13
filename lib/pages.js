function renderPages(globalViewData){
    const matter = require('gray-matter');
    const fs = require('fs');
    const path = require('path');
    const gulp = require('gulp');
    const rename = require('gulp-rename');
    const pug = require('gulp-pug');

    const srcBase = 'cms-data/pages';
    const destBase = 'public-static-site';


    fs.readdirSync(srcBase).forEach(file => {
        let fullFilePath = srcBase + '/' + file;
        if(!path.extname(file)){ return; }
        let pageViewData = globalViewData;
        let content = fs.readFileSync(fullFilePath, 'utf8');
        let matterObject = matter(content);
        pageViewData.page = matterObject.data;
        pageViewData.page.mainText = matterObject.content;
        console.log(pageViewData);
        return;
        let templateFilePath = 'src/html/views/standard.pug';
        if(pageViewData.page.template){
            templateFilePath = 'src/html/views/' . pageViewData.page.template;
        }
        return gulp.src(templateFilePath)
            .pipe(pug({
                data: pageViewData
            }))
            .pipe(rename(function (vinylPath) {
                vinylPath.dirname += "/" + path.basename(fullFilePath, '.md');
                vinylPath.basename = "index";
            }))
            .pipe(gulp.dest(destBase));
    });
}

module.exports.renderPages = renderPages;