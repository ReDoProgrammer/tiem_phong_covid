require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const nationSchema = new Schema({  
    code:{
        type:String,
        required: [true, 'Vui lòng mã dân tộc']
    }  ,
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên dân tộc']
    }  
});


module.exports = mongoose.model('nation',nationSchema);
