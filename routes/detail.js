let express = require('express');
let path = require('path');
let ejs = require('ejs');

let router = express.Router();

let db = require(path.resolve('./bin/db/index.js')).Wcfn;

//*详细页面*/
//router.get(/^(\/[a-zA-Z0-9-]+)+\/[a-zA-Z0-9-]+(.(htm|html))?$/, function(req, res, next){
router.get('/', function(req, res, next){
	db.find({href:req.baseUrl},function(err,docs){
		res.render('detail', { title: '企鹅微刊-引领web前沿，打造前端精品教程',data:JSON.stringify(docs)});
	});
	
	//read();
});

module.exports = router;








