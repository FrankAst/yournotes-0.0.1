const allRoutes = require('./allRoutes');
module.exports = function(app, NoteModel) {
  allRoutes(app, NoteModel);
  // Тут, позже, будут и другие обработчики маршрутов 
};