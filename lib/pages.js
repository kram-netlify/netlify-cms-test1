function renderPages(){
    const matter = require('gray-matter');
    const fs = require('fs');
    const path = require('path');

    const srcBase = 'cms-data/pages';


    fs.readdirSync(srcBase).forEach(file => {
        if(!path.extname(file)){ return; }
        let content = fs.readFileSync(srcBase + '/' + file, 'utf8');
        console.log(content);
        console.log('\n');
    });
}

module.exports.renderPages = renderPages;