let express = require('express');
let path = require('path');
let ejs = require('ejs');
let mime = require('mime');//解析文件后缀名


require('moment/locale/zh-cn.js');
let moment = require('moment');//解析时间

let router = express.Router();
let read = require('./admin/read');

let db = require(path.resolve('./bin/db/index.js')).Wcfn;

/*ejs.filters.parseDom = function(arg) {
　　 var objE = document.createElement("div");
    　　 objE.innerHTML = arg;
    　　 return objE.childNodes;
};*/
/* GET home page. */
router.get(/^\/(\?page=\d+)?$/, function(req, res, next) {
	let pageCount = 10,
		pageNum = req.query.page*1 || 0,
		datas=[];

	db.find({},function(err,doc){
		if(pageNum*10+pageCount>doc.length){
			datas = doc.splice(pageNum*10);
		}else{
			datas = doc.splice(pageNum*10,pageCount);
		}
		res.render('index', { 
			title: '企鹅微刊-引领web前沿，打造前端精品教程' , 
			data:{
				pageNum: pageNum,
				pageCount: pageCount,
				total: Math.ceil(doc.length/pageCount),
				datas:datas
			},
			list: doc});
	});
});

/*CSS3列表*/

/*渲染抓取数据页面*/
router.get('/admin/read', function(req, res, next){
	//渲染抓取页面
	res.render('admin/pachong', { title: '企鹅微刊-引领web前沿，打造前端精品教程'});
	//read();
});
/*ajax开始抓取数据*/
router.post('/admin/read', function(req, res, next){
	//渲染抓取页面
	let url = req.body.url,
		params = req.body.params,
		pageStart = req.body.pageStart,
		pageEnd = req.body.pageEnd;
	read(url, params, pageStart, pageEnd,function(tip){
		res.send(tip);
	});
});

module.exports = router;
