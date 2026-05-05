const users = require('./users');
const academic = require('./academic');
const questions = require('./questions');
const exams = require('./exams');
const attempts = require('./attempts');
const notifications = require('./notifications');
const audit = require('./audit');

module.exports = {
  ...users,
  ...academic,
  ...questions,
  ...exams,
  ...attempts,
  ...notifications,
  ...audit
};
