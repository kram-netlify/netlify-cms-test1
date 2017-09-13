const matter = require('gray-matter');
var fs = require('fs')
var file = fs.readFileSync('_posts/blog/2017-09-12-hello.md', 'utf8');

let data = matter(file);
console.log(data);

fs.writeFileSync('./output.html', data);