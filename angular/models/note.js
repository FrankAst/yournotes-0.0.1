// //создаем новую модель
// var mongoose = require('mongoose'); // ссылаемся на mongoose для создания понятной модели типа класса
// // определяем схему для пользовательской модели
// var noteSchema = new mongoose.Schema({
//     title: String,
//     text: String,
//     date: {type: Date, default: Date.now}
    
// });

// mongoose.model('Note', noteSchema);
// var Note = mongoose.model('Note');

// exports.findByTitle = function(title, callback){

// Note.findOne({ note_title: title}, function(err, title){
//         if(err){
//             return callback(err);
//         }
// return callback(null, title);
// });
// }
