module.exports = function(app, NoteModel) {


app.get('/', function(req, res){

	return NoteModel.find(function (err, notes) {
        if (!err) {


            res.render('mainView', {title: 'Valeriy', notes: notes});

        } 

        else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
    });

});




app.post('/notes', function(req, res) {

    var note = new NoteModel({
        title: req.body.title,
        date: req.body.date,
        content: req.body.content
    });

   note.save(function (err) {
        if (!err) {
            console.info("note created successfully!");
             res.statusCode = 200;
             res.send(note);
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


	app.put('/notes', function(req, res){



	});

	app.delete('/notes', function(req, res){

	return NoteModel.findByIdAndRemove({_id: req.query.id }, function (err) {
        if (!err) {

            res.statusCode=200;
            res.statusText='OK';
            res.end();
            console.log('remove successfully');

        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode, err.message);
            return res.send({ error: 'Server error' });
        }
         });

    });

};