require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const priorityObjectSchema = new Schema({
    code:{
        type:String,
        required: [true, 'Vui lòng nhập mã đối tượng ưu tiên']
    },
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên đối tượng ưu tiên']
    }  

});


module.exports = mongoose.model('priority_object',priorityObjectSchema);
