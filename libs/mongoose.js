
// this is the local server and mongoose

var mongoose = require('mongoose');
// var log         = require('./log')(module);

mongoose.connect("mongodb://localhost/test1");

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});

db.once('open', function callback () {
    console.log("Connected to DB!");
});


    var noteSchema = new mongoose.Schema({
    		// id: {type: var}
    		title: {type: String},
    		date: {type: String},
    	    content: { type: String}
});


var NoteModel = mongoose.model('note', noteSchema);
module.exports.NoteModel = NoteModel;
