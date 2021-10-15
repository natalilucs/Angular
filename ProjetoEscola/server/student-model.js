var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const studentsSchema = new Schema({
    name: String,
    matriculation: String,
    g1: Number,
    g2: Number,
    g3: Number,
    average: Number,
    status: String
});

module.exports = mongoose.model('students', studentsSchema);