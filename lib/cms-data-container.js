function CmsDataContainer(){
    const matter = require('gray-matter');
    const fs = require('fs');
    const path = require('path');

    const postsBase = 'cms-data/posts';

    let postClasses = [];
    fs.readdirSync(postsBase).forEach(folder => {
        if(path.extname(folder)){
            return;
        }
        postClasses.push(folder);
    });

    let ClassFolders = [];
    for(let clName of postClasses){
        ClassFolders.push(postsBase + '/' + clName);
    }

    let dataObject = {
        posts: {}
    };

    for(let tName of ClassFolders){
        let baseName = path.basename(tName);
        let  arr = [];
        fs.readdirSync(tName).forEach(file => {
            if(path.extname(file)){
                let content = fs.readFileSync(postsBase + '/' + baseName + '/' + file, 'utf8');
                arr.push(matter(content));
            }
        });
        dataObject.posts[baseName] = arr;
    }

    // reveal posts for object
    this.posts = dataObject.posts;
}

module.exports.CmsDataContainer = CmsDataContainer;