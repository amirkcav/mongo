const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
// create a schema
const myGroupSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String }
}, { collection : 'myGroup' });
 
const MyGroup = mongoose.model('MyGroup', myGroupSchema);
 
module.exports = MyGroup;