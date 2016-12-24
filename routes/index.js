let express = require('express');
let path = require('path');
let mime = require('mime');//解析文件后缀名


require('moment/locale/zh-cn.js');
let moment = require('moment');//解析时间

let router = express.Router();
let read = require('./read');

let db = require(path.resolve('./bin/db/index.js'));

/* GET home page. */
router.get('/', function(req, res, next) {
	db.find({},function(err,doc){
		res.render('index', { title: '企鹅微刊-引领web前沿，打造前端精品教程' , list: doc});
	});
});
/*渲染抓取数据页面*/
router.get('/read', function(req, res, next){
	//渲染抓取页面
	//console.log(req.body);
	res.render('admin/pachong', { title: '企鹅微刊-引领web前沿，打造前端精品教程'});
	//read();
});
/*ajax开始抓取数据*/
router.post('/read', function(req, res, next){
	//渲染抓取页面
	console.log(req.body);
});

module.exports = router;
