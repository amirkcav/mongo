const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
// create a schema
const itemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  groupId: { type: String }
}, { collection : 'item' });
 
const Item = mongoose.model('Item', itemSchema);
 
module.exports = Item;