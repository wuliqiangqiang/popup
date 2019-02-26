var gulp = require("gulp");
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');

gulp.task("popup", function () {
  return gulp.src("./js/popup.js")
    .pipe(babel(
      {
        "presets": ["@babel/env"]
      }
    )).pipe(uglify())
    .pipe(gulp.dest("./dist"));
});