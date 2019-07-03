const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
    sass.compiler = require("node-sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

const PATHS = {
    src: __dirname+"/src",
    dist: __dirname+"/dist",
    templates: {
        views: "./src/views",
        pages: "./src/views/index.pug"
    }
}

gulp.task("copy", ()=> {
    return gulp.src("./src/index.html")
        .pipe(gulp.dest("./dist"));
});

gulp.task("pug", ()=> {
    return gulp.src(PATHS.templates.pages)
    .pipe(pug())
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task("styles", ()=> {
    return gulp.src(["./src/styles/main.scss", "node_modules/normalize.css/normalize.css"])
        .pipe(concat("main.scss"))
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dist/styles"));
});

gulp.task("server", ()=> {
    browserSync.init({
        server: {
            baseDir: PATHS.dist
        },
        open: false
    });
});

gulp.task("reload", (callback)=> {
    browserSync.reload();
    callback();
});

gulp.watch(PATHS.templates.pages, gulp.series("pug"));
gulp.watch(PATHS.dist, gulp.series("reload"));

gulp.task("default", gulp.series("pug", "server"));