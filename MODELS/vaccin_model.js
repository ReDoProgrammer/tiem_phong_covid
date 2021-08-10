require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vaccinSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên loại vaccin']
    }
   
});


module.exports = mongoose.model('vaccin',vaccinSchema);
