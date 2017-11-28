// @flow

export default (app, Note) => {
  app.get('/', (req, res) => {
    return Note.find((err, notes) => { //eslint-disable-line
      if (!err) {
        res.render('mainView', { title: 'Valeriy', notes });
      } else {
        res.statusCode = 500;
        console.err('Internal error(%d): %s', res.statusCode, err.message); //eslint-disable-line
        return res.send({ error: 'Server error' });
      }
    });
  });

  app.post('/notes', (req, res) => {
    const note = new Note({
      title: req.body.title,
      date: req.body.date,
      content: req.body.content,
      color: req.body.color,
    });
    note.save(err => {
      if (!err) {
        console.info('note created successfully!'); //eslint-disable-line
        res.statusCode = 200;
        res.send(note);
      } else {
        console.log(err); //eslint-disable-line
        if (err.name === 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
        }
        console.error('Internal error(%d): %s', res.statusCode, err.message); //eslint-disable-line
      }
    });
  });

  app.delete('/notes', (req, res) => {
    return Note.findByIdAndRemove({ _id: req.query.id }, err => { //eslint-disable-line
      if (!err) {
        res.statusCode = 200;
        res.statusText = 'OK';
        res.end();
        console.log('remove successfully'); //eslint-disable-line
      } else {
        res.statusCode = 500;
        console.err('Internal error(%d): %s', res.statusCode, err.message); //eslint-disable-line
        return res.send({ error: 'Server error' });
      }
    });
  });
};
