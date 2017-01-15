var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/wcfn');

var WcfnSchema = new mongoose.Schema({
    title:String,
    href:String,
    typenav:{type:String,default:''},
    des:{type:String,default:''},
    content:{type:String,default:''},
    date:{type:Date,default:Date.now()},
    click:{type:Number,default:1}
},{collection:'wcfn'});
exports.Wcfn = mongoose.model('Wcfn',WcfnSchema);


var UserSchema = new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    email:String,//邮箱
    avatar:String//头像
},{collection:'user'});

exports.User = mongoose.model('User',UserSchema);


