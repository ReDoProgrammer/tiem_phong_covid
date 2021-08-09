require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const nationalitySchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên quốc tịch']
    }  

});


module.exports = mongoose.model('nationality',nationalitySchema);
