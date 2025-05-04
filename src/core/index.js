// Barrel file for form-grader core logic

const formatting = require('./formatting');
const detection = require('./detection');
const diff = require('./diff');
const utils = require('./utils');

module.exports = {
  ...formatting,
  ...detection,
  ...diff,
  ...utils,
};
