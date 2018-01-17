var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  ref: String,
  name: String,
  fullname: String,
  fonction: String,
  tjm: String,
  dispo: String,
  exps: [{ entreprise: String, projet: String, datedeb: String, datefin: String, mission: [{ mission: String }]}],
  stages: [{ entreprise: String, projet: String, datedeb: String, datefin: String, mission: [{ mission: String }]}],
  cursus: [{ univer: String, diplom: String, datedeb: String, datefin: String}],
  comp: [{ titre: String, detail: String}],
  interet: [{ interet: String}],
  langues: [{ langue: String, pourcentage: String}],
});

module.exports = mongoose.model('Book', BookSchema);