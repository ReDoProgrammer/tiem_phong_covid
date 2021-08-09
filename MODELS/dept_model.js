require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const deptSchema = new Schema({
    name:{
        type:String,
        required: [true, 'Vui lòng nhập tên đơn vị']
    },
    unit:{
        type:Schema.Types.ObjectId,
        ref:'unit'
    }
   
});


module.exports = mongoose.model('dept',deptSchema);
