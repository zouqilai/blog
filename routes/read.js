let express = require('express');
let request = require('request');
let fs = require('fs');
let path = require('path');
let iconv = require('iconv-lite');
let cheerio = require('cheerio');
let async = require('async');
let router = express.Router();
let db = require(path.resolve('./bin/db/index.js'));

//let url = 'http://www.w3cplus.com/';
//let oldPage =131,endPage=-1;
function readContent(url,callback){
	//request('http://www.w3cplus.com/',);
}
function read (url,callback) {
	request(url,function(err,response,body){
		if(err){
			console.log(err);
		}
		//body = iconv.decode(body,'utf8');
		let $ = cheerio.load(body),
			items = [];

		/*if($('.pager-last') && $('.pager-last a') && $('.pager-last a').attr('href')){
			if(endPage ==-1)
			    endPage = $('.pager-last a').attr('href').split('=')[1];
		
		}*/
		//items.page = endPage;

		$('.node-teaser').each(function(){
			let $me = $(this);
			
			items.push({
				title: $me.find('h1 a').text(),
				href: $me.find('a').attr('href'),
				des: $me.find('.field-item p').text()
			});
		});
		async.forEach(items,function(item,cb){
				readContent(item.href,function(err,desc){
                      item.des = desc;
                      cb();
				});
		},function(){
			callback(err,items);
		})


		//fs.writeFile('./1.html',body);
		
	});
}

function write (messages,callback) {
	//endPage = messages.page;
	async.forEach(messages,function(item,cb){
		db.remove(item,function(err,doc){

		});
		db.create(item,function(err,doc){
			//let newDate = new Date();
			//doc.date = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+newDate.getDate();
			cb(err,doc);
		});
	},callback);
}

function readAsync(url,params,oldPage,pageEnd,callback){
	var urls = url + '/?'+ params +'=' + oldPage;
	//console.log(url);
	async.waterfall([
		/*function(cb){
			db.remove({},cb);
		},*/
		function(cb){
			read(urls,function(err,messages){
				cb(err,messages);
			});
		},
		function(messages,cb){

			write(messages,cb);
		}
	],function(err,result){
		if(!err){
			var tip = '第' + oldPage + '页抓取成功';
			endPage = pageEnd;
			oldPage++;
			if(oldPage <= endPage){
				readAsync(url,params,oldPage,pageEnd,callback);
				//console.log(oldPage);
			}else{
				callback('页面抓取成功');
			}
			//console.log('ok');
		}
	})
}

module.exports = function(url, params, pageStart, pageEnd,fn){
	//let url = url + '/?' + params + '=' + pageStart;
	//let oldPage =131,endPage=-1;
	readAsync(url,params,pageStart,pageEnd,fn);
};






