let express = require('express');
let request = require('request');
let fs = require('fs');
let path = require('path');
let iconv = require('iconv-lite');
let cheerio = require('cheerio');
let async = require('async');
let router = express.Router();
let db = require(path.resolve('./bin/db/index.js'));

let url = 'http://www.w3cplus.com/';
let oldPage =131,endPage=-1;
function read (url,callback) {
	request(url,function(err,response,body){
		if(err){
			console.log(err);
		}
		//body = iconv.decode(body,'utf8');
		let $ = cheerio.load(body),
			items = [];

		if($('.pager-last') && $('.pager-last a') && $('.pager-last a').attr('href')){
			if(endPage ==-1)
			    endPage = $('.pager-last a').attr('href').split('=')[1];
		
		}
		//items.page = endPage;

		$('.node-teaser').each(function(){
			let $me = $(this);
			
			items.push({
				title: $me.find('h1 a').text(),
				href: $me.find('a').attr('href'),
				des: $me.find('.field-item p').text()
			});
		});
		//fs.writeFile('./1.html',body);
		callback(err,items);
	});
}

function write (messages,callback) {
	//endPage = messages.page;
	async.forEach(messages,function(item,cb){
		db.create(item,function(err,doc){
			//let newDate = new Date();
			//doc.date = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+newDate.getDate();
			cb(err,doc);
		});
	},callback);
}

function readAsync(oldPage){
	url = url + '?page=' + oldPage;
	async.waterfall([
		function(cb){
			db.remove({},cb);
		},	
		function(data,cb){
			read(url,function(err,messages){
				cb(err,messages);
			});
		},
		function(messages,cb){
			write(messages,cb);
		}
	],function(err,cb){
		//console.log(err);
		//console.log('ok',cb);
		endPage = endPage;
		oldPage++;
		if(oldPage <= endPage){
			readAsync(oldPage);
			console.log(oldPage);
		}
	})
}

module.exports = function(){
	readAsync(oldPage);	
};






