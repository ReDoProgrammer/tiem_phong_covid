require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const districtSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên quốc tịch']
    },
    provice:{
        type:Schema.Types.ObjectId,
        ref:'provice'
    }  

});


module.exports = mongoose.model('district',districtSchema);
