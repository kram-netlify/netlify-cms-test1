const matter = require('gray-matter');
var fs = require('fs')
var file = fs.readFileSync('_posts/blog/2017-09-12-hello.md', 'utf8');

console.log(file);

//console.log(matter('---\ntitle: Front Matter\n---\nThis is content.'));
console.log(matter(file));

