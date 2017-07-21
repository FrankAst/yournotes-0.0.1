var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var NoteModel = require('./libs/mongoose').NoteModel;

var index = require('./routes/index');
var users = require('./routes/users');
var notes = require('./routes/notes');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', notes);
app.use('/home', index);
app.use('/users', users);

// POST /login gets urlencoded bodies 
// app.post('/newForm', function (req, res) {
// res.render('notes')
// });

// app.get();
// app.put();
// app.delete();

app.get('/notes', function(req, res) {
    return NoteModel.find(function (err, notes) {
        if (!err) {

            return res.send(notes);

        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });
});

app.post('/newForm', function(req, res) {
    var note = new NoteModel({
        text: req.body.note
    });

   note.save(function (err) {
        if (!err) {
            console.info("note created");
             res.statusCode = 200;
             res.send({'createdNote': note.text});
            // return
        } 
        else 
        {
            console.log(err);
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({ error: 'Validation error' });
            } else {
                res.statusCode = 500;
                res.send({ error: 'Server error' });
            }
            console.error('Internal error(%d): %s',res.statusCode,err.message);
        }
    });

});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
