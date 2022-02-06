const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

 const rating = new Schema({
  name: String,
  room: String,
  socketId: String,
  rating: String
});

module.exports = mongoose.model('rating',rating)
