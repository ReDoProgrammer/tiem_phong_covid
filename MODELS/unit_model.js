require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const unitSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên đơn vị']
    }
   
});


module.exports = mongoose.model('unit',unitSchema);
