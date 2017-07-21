var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');

//定义目录路径
var app = {
	srcPath: 'src/',  //源代码放置的位置
	devPath: 'build/',  //整合之后的文件，开发环境要用到
	prdPath: 'dist/',  //用于生产部署
};

//把js文件拷贝到开发环境和生产的文件夹中
gulp.task('lib', function() {
	// 读取文件， "/**"表示对bower_components这个文件夹下的所有子文件进行深度遍历，"/*"表示同时读取所有的文件，如果只要读js文件就加.js,"/*.js"
	gulp.src('lib/**/*.js')
	//把js文件拷贝到build,dist文件夹的vendor文件中
	.pipe(gulp.dest(app.devPath + 'vendor'))
	.pipe(gulp.dest(app.prdPath + 'vendor'))
	.pipe($.connect.reload());
});

//把html文件拷贝到开发环境和生产的文件夹中
gulp.task('html', function() {
	gulp.src(app.srcPath + '**/*.html')
	.pipe(gulp.dest(app.devPath))
	.pipe(gulp.dest(app.prdPath))
	.pipe($.connect.reload());
});

gulp.task('json', function() {
	gulp.src(app.srcPath + 'data/**/*.json')
	.pipe(gulp.dest(app.devPath + 'data'))
	.pipe(gulp.dest(app.prdPath + 'data'))
	.pipe($.connect.reload());
});

gulp.task('less', function() {
	gulp.src(app.srcPath + 'style/index.less')
	.pipe($.less())		//进行less编译
	.pipe(gulp.dest(app.devPath + 'css'))
	.pipe($.cssmin())		//css压缩
	.pipe(gulp.dest(app.prdPath + 'css'))
	.pipe($.connect.reload());
});

gulp.task('js', function() {
	gulp.src(app.srcPath + 'script/**/*.js')
	.pipe($.concat('index.js'))
	.pipe(gulp.dest(app.devPath + 'js'))
	.pipe($.uglify())
	.pipe(gulp.dest(app.prdPath + 'js'))
	.pipe($.connect.reload());
});

gulp.task('image', function() {
	gulp.src(app.srcPath + 'image/**/*')
	.pipe(gulp.dest(app.devPath + 'image'))
	.pipe($.imagemin())
	.pipe(gulp.dest(app.prdPath + 'image'))
	.pipe($.connect.reload());
});

gulp.task('build', ['lib', 'html', 'json', 'less', 'js', 'image']);

gulp.task('clean', function() {
	gulp.src([app.devPath, app.prdPath])
	.pipe($.clean())
});

gulp.task('serve', ['build'], function() {
	$.connect.server({
		root: [app.devPath],		//服务器从开发目录读取
		livereload: true,				//自动刷新浏览器，只支持高级浏览器
		port: 8088
	});
	open('http://localhost:8088');

	gulp.watch('lib/**/*.js', ['lib']);
	gulp.watch(app.srcPath + '**/*.html', ['html']);
	gulp.watch(app.srcPath + 'data/**/*.json', ['json']);
	gulp.watch(app.srcPath + 'style/**/*.less', ['less']);
	gulp.watch(app.srcPath + 'script/**/*.js', ['js']);
	gulp.watch(app.srcPath + 'image/**/*', ['image']);
});

gulp.task('default', ['serve']);