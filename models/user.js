const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const borrowSchema = new Schema({
//     bookTitle : {type : String, required : true, max : 100},
//     bookNumber : {type : Number, required : true},
//     image : { type : String, required : false}
// });

const userSchema = new Schema({
    username : {type : String, required : true, max : 100},
    password : {type : String, required : true, },
    email : { type : String, format : 'email' }
})

// module.exports = mongoose.model ('MemberBorrow', borrowSchema);
module.exports = mongoose.model('User', userSchema);