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

var Schema = mongoose.Schema;

// Schemas
// var Images = new Schema({
//     kind: {
//         type: String,
//         enum: ['thumbnail', 'detail'],
//         required: true
//     },
//     url: { type: String, required: true }
// });

var Article = new Schema({

    text: { type: String, required: true },
});


var ArticleModel = mongoose.model('Article', Article);

module.exports.ArticleModel = ArticleModel;
