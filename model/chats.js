
const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

 const chats = new Schema({
  userName: String,
  userId: String,
  message: String,
  room: String,
  createdOn: Date
});

module.exports = mongoose.model('chats',chats)
