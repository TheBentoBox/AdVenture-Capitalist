var gulp = require("gulp");
var clean = require("gulp-clean");
var shell = require("gulp-shell");

/**
 * Cleans out the ./dist/ subfolder for the frest build.
 */
gulp.task("clean", () => {
    return gulp
        .src("dist/*", { read: false })
        .pipe(clean());
});


/**
 * Copies the "website" files needed to make the game run.
 */
gulp.task("copy-www", function () {
    return gulp
        .src(["./www/**/*"])
        .pipe(gulp.dest("./dist/"));
});


/**
 * Cleans out the ./dist/ subfolder for the frest build.
 */
gulp.task("copy-game-assets", () => {
    return gulp
        .src(["assets/**/*"])
        .pipe(gulp.dest("dist/assets/"));
});


/**
 * Compiles the source code into JS into the ./dist/ folder.
 */
gulp.task("compile",
    shell.task("webpack --config webpack.config.js")
);


/**
 * The default gulp task when run without a task argument.
 * Builds the game into the output ./dist/ directory.
 */
gulp.task("default", gulp.series(
    gulp.task("clean"),
    gulp.parallel("copy-game-assets", "copy-www", "compile")
));