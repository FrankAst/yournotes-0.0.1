var mongoose = require('mongoose');
//var log         = require('./log')(module);

mongoose.connect('mongodb://localhost/test1');
var db = mongoose.connection;

// db.on('error', function (err) {
//     log.error('connection error:', err.message);
// });
db.once('open', function callback () {
    console.log("Connected to DB!");
});


// Schemas
// var Images = new Schema({
//     kind: {
//         type: String,
//         enum: ['thumbnail', 'detail'],
//         required: true
//     },
//     url: { type: String, required: true }
// });


    // text: { type: String, required: true }
    var noteSchema = new mongoose.Schema({
    	    text: { type: String}
    	    // text: String
    // title: String,
    // date: {type: Date, default: Date.now}

});


var NoteModel = mongoose.model('Note', noteSchema);
module.exports.NoteModel = NoteModel;
