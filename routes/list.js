let express = require('express');
let path = require('path');
let ejs = require('ejs');

let router = express.Router();

let db = require(path.resolve('./bin/db/index.js')).Wcfn;

/*CSS3列表*/
//router.get(/^\/(CSS3|mobile|JavaScript)(\?page=\d+)?$/, function(req, res, next) {
router.get('/', function(req, res, next) {
	//JavaScript mobile CSS3
	let pageCount = 10,
		pageNum = req.query.page*1 || 0,
		datas=[];

	db.find({typenav:{"$in":['css','css3','animate']}},function(err,doc){
		if(pageNum*10+pageCount>doc.length){
			datas = doc.splice(pageNum*10);
		}else{
			datas = doc.splice(pageNum*10,pageCount);
		}
		res.render('list', { 
			title: '企鹅微刊-引领web前沿，打造前端精品教程' , 
			data:{
				pageNum: pageNum,
				pageCount: pageCount,
				total: Math.ceil(doc.length/pageCount),
				datas:datas
			},list: doc});
	});
});

module.exports = router;








