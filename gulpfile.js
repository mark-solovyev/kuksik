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
    },
    styles: {
        root: "./src/styles",
        entry: "./src/styles/main.scss",
        normalize: "node_modules/normalize.css/normalize.css"
    },
    images: {
        srcFiles: "./src/views/img/**/*.*",
        destFolder: "./dist/img"
    }
}

gulp.task("copy", ()=> {
    return gulp.src("./src/index.html")
        .pipe(gulp.dest("./dist"));
});
gulp.task("copy:img", ()=> {
    return gulp.src(PATHS.images.srcFiles)
        .pipe(gulp.dest(PATHS.images.destFolder));
});
gulp.task("copy:fonts", ()=> {
    return gulp.src("./src/fonts/**/*.*")
        .pipe(gulp.dest("./dist/fonts"));
});

gulp.task("pug", ()=> {
    return gulp.src(PATHS.templates.pages)
    .pipe(pug())
    .pipe(gulp.dest(PATHS.dist));
});

gulp.task("styles", ()=> {
    return gulp.src([PATHS.styles.entry, PATHS.styles.normalize])
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
gulp.watch(PATHS.images.srcFiles, gulp.series("copy:img"));
gulp.watch(PATHS.styles.root, gulp.series("styles", "reload"));
gulp.watch(PATHS.dist, gulp.series("reload"));
gulp.task("default", gulp.series("pug", "copy:img", "copy:fonts", "styles", "server"));