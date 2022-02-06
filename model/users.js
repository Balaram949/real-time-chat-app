const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

 const user = new Schema({
  name: String,
  room: String,
  socketId: String,
  isActive: Boolean
});

module.exports = mongoose.model('users',user)
