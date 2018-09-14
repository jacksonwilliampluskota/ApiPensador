var mongoose = require('mongoose');

var Schema = mongoose.Schema({
  frase: String,
});

module.exports = mongoose.model('Pensador', Schema);
