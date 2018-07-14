/**
 * 
 */
var gulp = require('gulp');
// var browserSync = require('browser-sync').create();
var config = require('./gulp.config.js')();
var run = require('run-sequence');
var del = require('del');
var $ = require('gulp-load-plugins')({ lazy: true });

/*
 * 生产环境打包
 * */

//删除dist文件夹，rev文件夹
gulp.task('clean', function() {
    log('---------- Delete dist Start ----------');
    del([
        config.path.dist,
        config.path.rev
    ]);
});

//拷贝资源, 在config.copyfile里配置需要自动拷贝的文件
gulp.task('copy', function() {
    log('---------- Copy File Start ----------');
    return gulp.src(config.copyfile, { base: config.path.src })
        .pipe(gulp.dest(config.path.dist));
});

//替换html文件中，<build:css|js path>相应文件
gulp.task('htmlreplace', function() {
    log('---------- Htmlreplace Start ----------');
    return gulp.src([
            config.path.src + '/**/*.html',
            '!' + config.path.src + config.path.libs + '/**/*.html'
        ])
        .pipe($.useref({ searchPath: config.path.src }))
        .pipe(gulp.dest(config.path.dist));
});

//html文件里，引入public公共html文件
gulp.task('includefile', function() {
    log('---------- Include File Start ----------');
    return gulp.src(config.path.dist + "/**/*.html")
        .pipe($.fileInclude({
            prefix: '@@'
        }))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(config.path.dist));
});

//清除dist里css文件夹，防止冲突
gulp.task('delcss', function() {
    log('---------- del Start ----------');
    del([
        config.path.dist + config.path.css
    ]);
});

//css样式文件压缩
gulp.task('cssmin', function() {
    log('---------- Css Optimizer Start ----------');
    return gulp.src(config.src.css)
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.concat('app.css'))
        .pipe($.cssnano())
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.rev())
        .pipe(gulp.dest(config.path.dist + config.path.css))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.path.rev + config.path.css));
});

//js文件压缩
gulp.task('scriptmin', function() {
    log('---------- Script Optimizer Start ----------');
    return gulp.src(config.src.script, { base: config.path.src })
        .pipe($.uglify({
            mangle: true,
            compress: true
        }))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.rev())
        .pipe(gulp.dest(config.path.dist))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.path.rev + config.path.script));
});

//图片压缩
gulp.task('imagemin', function() {
    log('---------- Picture Optimizer Start ----------');
    return gulp.src(config.src.img)
        .pipe($.imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: true }]
        }))
        .pipe($.rev())
        .pipe(gulp.dest(config.path.dist + config.path.images))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(config.path.rev + config.path.images));
});

//替换html文件里.js后缀变成.min.js后缀，用于替换版本，把require data-main属性去掉，防止二次加载
gulp.task('replace-html', function() {
    log('---------- replace-html Start ----------');
    return gulp.src(config.path.dist + '/**/*.html', { base: config.path.dist })
        .pipe($.replace(/\.js[\"\']/g, '.min.js"'))
        .pipe($.replace(/jweixin-1.2.0.min.js/g, 'jweixin-1.2.0.js"'))
        .pipe($.replace('" data-main="/script/entry"', '"'))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(config.path.dist));
});

//替换entry.js里paths配置里.js后缀变成.min.js后缀, 用于替换版本，替换BaseUrl
gulp.task('replace-entry', function() {
    log('---------- replace-entry Start ----------');
    return gulp.src(config.path.dist + config.path.script + '/entry*.js', { base: config.path.dist })
        .pipe($.replace(/\.js[\"\']/g, '.min.js"'))
        .pipe($.replace('#BaseUrl#', config.BaseUrlDist))
        .pipe($.replace('#BaseApiUrl#', config.BaseApiUrlDist))
        .pipe($.replace('#BaseAppId#', config.BaseAppIdDist))
        .pipe($.replace('#BaseImg#', config.BaseImgDist))
        .pipe($.replace('#BaseBookImg#', config.BaseBookImgDist))
        .pipe($.replace('#BaseLoginUrl#', config.BaseLoginUrlDist))
        .pipe(gulp.dest(config.path.dist));
});

//替换js文件里require引用entry文件为绝对路径，防止打包后路径错误
gulp.task('replace-script', function() {
    log('---------- replace-script Start ----------');
    return gulp.src(config.path.dist + config.path.script + '/**/*.js', { base: config.path.dist })
        .pipe($.replace('"entry"', '"../script/entry.min.js"'))
        .pipe(gulp.dest(config.path.dist));
});

//替换entry.js里paths配置里.js后缀去掉，防止require找不到路径，替换BaseUrl
gulp.task('replace-entryjs', function() {
    log('---------- replace-entry Start ----------');
    return gulp.src(config.path.dist + config.path.script + '/entry*.js', { base: config.path.dist })
        .pipe($.replace(/\.js[\"\']/g, '"'))
        .pipe(gulp.dest(config.path.dist));
});

//css，js，img等文件替换成版本号
gulp.task('revcollector', function() {
    log('---------- htmlrevcollector Start ----------');
    return gulp.src([
            config.path.rev + '/**/*.json',
            config.path.dist + '/**/*.*',
            '!' + config.path.dist + config.path.images + '/**/*.*'
        ])
        .pipe($.revCollector())
        .pipe($.if('/**/*.html', $.htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(config.path.dist));
});

//清除dist里template/public文件夹
gulp.task('delpublic', function() {
    log('---------- del Start ----------');
    del([
        config.path.dist + '/template/public'
    ]);
});

//启动生产环境打包
gulp.task('build-dist', function(callback) {
    run(
        'clean',
        callback
    );
    setTimeout(function() {
        run(
            'copy',
            'htmlreplace',
            'includefile',
            'delcss',
            'cssmin',
            'scriptmin',
            'replace-html',
            'replace-entry',
            'replace-script',
            'imagemin',
            'revcollector',
            'replace-entryjs',
            'delpublic'
        );
    }, 1500);
});

/*
 * 测试环境打包
 * */

//清除test文件夹，rev文件夹
gulp.task('clean-test', function() {
    log('---------- Delete test Start ----------');

    del([
        config.path.test,
        config.path.rev
    ]);
});

//替换entry.js里paths配置里.js后缀去掉，防止require找不到路径，替换BaseUrl
gulp.task('replace-entry-test', function() {
    log('---------- replace-entry Start ----------');
    return gulp.src(config.path.dist + config.path.script + '/entry*.js', { base: config.path.dist })
        .pipe($.replace(/\.js[\"\']/g, '.min.js"'))
        .pipe($.replace('#BaseUrl#', config.BaseUrlTest))
        .pipe($.replace('#BaseApiUrl#', config.BaseApiUrlTest))
        .pipe($.replace('#BaseAppId#', config.BaseAppIdTest))
        .pipe($.replace('#BaseImg#', config.BaseImgTest))
        .pipe($.replace('#BaseBookImg#', config.BaseBookImgTest))
        .pipe($.replace('#BaseLoginUrl#', config.BaseLoginUrlTest))
        .pipe(gulp.dest(config.path.dist));
});

//把dist文件夹命名为test
gulp.task('retest', function() {
    return gulp.src(config.path.dist + '/**/*')
        .pipe(gulp.dest(config.path.test));
});

//启动测试环境打包
gulp.task('build-test', function(callback) {
    run(
        'clean',
        'clean-test',
        callback
    );
    setTimeout(function() {
        run(
            'copy',
            'htmlreplace',
            'includefile',
            'delcss',
            'cssmin',
            'scriptmin',
            'replace-html',
            'replace-entry-test',
            'replace-script',
            'imagemin',
            'revcollector',
            'replace-entryjs',
            'delpublic',
            'test-re'
        );
    }, 3000);
});

gulp.task('test-re', function() {
    setTimeout(function() {
        run(
            'retest',
            'del-dist',
            'zip-test'
        );
    }, 3000);
});

gulp.task('del-dist', function() {
    del([
        config.path.dist,
        config.path.rev
    ]);
});

/*
 * 本地开发
 * */

//清除dev文件夹
gulp.task('clean-dev', function() {
    del([
        config.path.dev
    ]);
});

//拷贝src文件夹资源到dev文件夹
gulp.task('copy-dev', function() {
    return gulp.src(config.path.src + '/**/*.*')
        .pipe(gulp.dest(config.path.dev));
});

//html文件里，引入public公共html文件
gulp.task('includefile-dev', function() {
    return gulp.src(config.path.src + "/**/*.html")
        .pipe($.fileInclude({
            prefix: '@@'
        }))
        .pipe(gulp.dest(config.path.dev));
});

//替换entry.js里paths配置里.js后缀去掉，防止require找不到路径，替换BaseUrl
gulp.task('replace-entry-dev', function() {
    return gulp.src(config.path.dev + '/script/entry.js', { base: config.path.dev })
        .pipe($.replace(/\.js[\"\']/g, '"'))
        .pipe($.replace('#BaseUrl#', config.BaseUrlDev))
        .pipe($.replace('#BaseApiUrl#', config.BaseApiUrlDev))
        .pipe($.replace('#BaseAppId#', config.BaseAppIdDev))
        .pipe($.replace('#BaseImg#', config.BaseImgDev))
        .pipe($.replace('#BaseBookImg#', config.BaseBookImgDev))
        .pipe($.replace('#BaseLoginUrl#', config.BaseLoginUrlDev))
        .pipe(gulp.dest(config.path.dev));
});

//启动监听，src文件夹修改文件自动拷贝到dev文件夹
gulp.task('watch-dev', ['server-dev'], function() {
    return gulp.src(config.path.src + '/**/*.*')
        .pipe($.watch(config.path.src + '/**/*.*'))
        .pipe($.if('*.html', $.fileInclude({ prefix: '@@' })))
        .pipe($.changed('dev'))
        .pipe(gulp.dest(config.path.dev));
});

//启动public文件夹监听，public文件夹里的文件修改，重新编译src下的html文件到dev
gulp.task('watch-dev-public', function() {
    gulp.watch(config.path.src + '/template/public/*.html', ['includefile-dev']);
});

//启动本地开发环境
gulp.task('build-dev', function(callback) {
    run(
        'clean-dev',
        callback
    );
    setTimeout(function() {
        run(
            'copy-dev',
            'includefile-dev',
            'replace-entry-dev',
            'watch-dev'
        );
    }, 3000);
});

/*
 * server
 * */

//生产环境server
gulp.task('server-dist', function() {
    server(config.path.dist);
});

//测试环境server
gulp.task('server-test', function() {
    server(config.path.test);
});

//本地环境server
gulp.task('server-dev', function() {
    server(config.path.dev);
});

//server
// function server(dir) {
//     browserSync.init({
//         server: {
//             baseDir: dir
//         },
//         port: 8001
//     });
// }

function server(dir) {
    $.connect.server({
        root : dir,
        port:'8002',
        host:'192.168.2.168',
        livereload : false
    });
}

/*
 * 文件压缩包
 * */

gulp.task('zip-src', function() {
    log('---------- Zip Src Start ----------');
    return gulp.src(config.path.src + '/**/*')
        .pipe($.zip('bookshop.zip'))
        .pipe(gulp.dest('./zip/src/'));
});

gulp.task('zip-test', function() {
    log('---------- Zip Src Start ----------');
    return gulp.src(config.path.src + '/**/*')
        .pipe($.zip('bookshop.zip'))
        .pipe(gulp.dest('./zip/test/'));
});

gulp.task('zip-dist', function() {
    log('---------- Zip Dist Start ----------');

    return gulp.src(config.path.dist + '/**/*')
        .pipe($.zip('bookshop.zip'))
        .pipe(gulp.dest('./zip/dist/'));
});

//print info
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.green(msg));
    }
}

gulp.task('less-main', function() {
    return gulp.src(['./src/less/main.less'])
        .pipe($.less())
        .pipe(gulp.dest('./src/css'));
});

gulp.task('watch-main', function(){
    gulp.watch('./src/less/main.less', ['less-main']);
});
 