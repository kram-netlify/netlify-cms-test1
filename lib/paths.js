function Paths(config={}){
    const self = this;

    // default values
    self.srcBase = 'src';
    self.destBase = 'dist';
    self.subFolders = {
        css: 'css',
        js: 'js',
        data: 'data',
        img: 'img'
    };

    // merge config-object
    for(let key in config) {
        if (config.hasOwnProperty(key)) {
            self[key] = config[key];
        }
    }

    // base getters
    self.getSrcBase = function(){
        return self.srcBase;
    };
    self.getDestBase = function(){
        return self.destBase;
    };
    // magic folder getters
    self.getSrcSubfolder = function(arg){
        let subFolder = self.subFolders[arg];
        if(!subFolder){ throw 'incorrect subfolder'; }
        return saveJoin(self.getSrcBase(), subFolder);
    };
    self.getDestSubfolder = function(arg){
        let subFolder = self.subFolders[arg];
        if(!subFolder){ throw 'incorrect subfolder'; }
        return saveJoin(self.getDestBase(), subFolder);
    };

    // file getters
    self.getSrcCssMainFile = function(){
        return self.getSrcSubfolder('css') + '/main.scss';
    };
    self.getSrcJsMainFile = function(){
        return self.getSrcSubfolder('js') + '/main.js';
    };
    self.getSrcDataMainFile = function(){
        return self.getSrcSubfolder('data') + '/main.json';
    };

    // watcher getters
    self.watchDataPathString = self.getSrcDataMainFile();

    self.watchHtmlPath =    [ self.getSrcBase() + '/**/*.pug', self.watchDataPathString];
    self.watchCssPath =     [ self.getSrcBase() + '/**/*.scss' ];
    //self.watchJsPath =      [ self.getSrcSubfolder('js')  + '/*.js'];
    self.watchJsPath = self.getSrcJsMainFile();

    self.getSrcJsLibFile = function() { return self.getSrcSubfolder('js') + '/libs.js'; };

    self.getWatchHtml = function(){ return self.watchHtmlPath; };
    self.getWatchCss = function(){ return self.watchCssPath; };
    self.getWatchJs = function(){ return self.watchJsPath; };


    // inner helper function
    function saveJoin(...args){
        let path;
        path = args.join('/');
        path = path.replace(/\/+/g, '/');
        path = path.replace(/\/$/g, '');
        return path;
    }
}

module.exports.Paths = Paths;