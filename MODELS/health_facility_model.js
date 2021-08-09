require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hfSchema = new Schema({  
    code:{
        type:String,
        required: [true, 'Vui lòng mã cơ sở y tế']
    }  ,
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên cơ sở y tế']
    }  
});


module.exports = mongoose.model('health_facility',hfSchema);
