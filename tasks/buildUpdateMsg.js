const gulpzip = require('gulp-zip');
const { src, dest } = require('gulp');
const moduleConfig = require('../config/module.config.json');
const { options } = require('../config/process.env');
const gulpJSONEdit = require('gulp-json-editor');
const gulpRename = require('gulp-rename');

const packageName = `${options.is_transplant ? 'transplant' : options.use_platform}${options.use_ext ? `-ext` : ''}${options.use_mode === 'magicWindow' ? '-magicWindow' : ''}${options.use_ratio === '3:2' ? '-ratioOf3To2' : ''}${options.use_compatibility ? `${'-' + options.use_compatibility}` : ''}`

module.exports = function buildUpdateMsg(cb) {
  const unNeedUpdate = () => {
    if (options.is_uninstall_package) {
      return true
    }
    if (options.netdisk_desc === 'sothx') {
      return false;
    }
    if (options.use_ext) {
      return true
    }
    return false
  }
  return unNeedUpdate() ? cb() : src('module_src/template/release.json')
    .pipe(gulpJSONEdit(function (json) {
      json.version = moduleConfig.version
      json.versionCode = Number(moduleConfig.versionCode)
      json.zipUrl = `https://github.com/sothx/mipad-magic-window/releases/download/${moduleConfig.version}/${packageName}-${moduleConfig.version}.zip`
      json.changelog = 'https://hyper-magic-window-module-update.sothx.com/changelog.md'
      return json;
    }))
    .pipe(gulpRename(`${packageName}.json`))
    .pipe(dest(`docs/release/`))
  // return src('dist/**')
  //   .pipe(gulpzip(`${options.is_uninstall_package  ? 'uninstall-' : ''}${options.is_transplant ? 'transplant' : options.use_platform}${options.use_ext ? `-ext` : ''}${options.use_mode === 'magicWindow' ? '-magicWindow' : ''}${options.use_ratio === '3:2' ? '-ratioOf3To2' : ''}${options.use_compatibility ? `${'-' + options.use_compatibility}` : ''}-${options.is_uninstall_package ? '0.00.00' : moduleConfig.version}.zip`))
  //   .pipe(dest(`release/${moduleConfig.version}${options.use_ext ? '/ext' : ''}`))
}