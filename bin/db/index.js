var mongoose = require('mongoose');
//2. 连接mongodb数据库 数据库一定要先启动
mongoose.connect('mongodb://127.0.0.1/wcfn');
//3. 定义schema
var MovieSchema = new mongoose.Schema({
    title:String,
    href:String,
    des:String,
    date:{type:Date,default:Date.now()},
    click:{type:Number,default:1}
    //指定保存到数据库里的集合名称，如果不指定则叫movies
},{collection:'wcfn'});
//4.定义模型
var Wcfn = mongoose.model('Wcfn',MovieSchema);
module.exports = Wcfn;
