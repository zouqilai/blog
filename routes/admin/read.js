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
	request('http://www.w3cplus.com'+url,function(err,response,body){
		let content = '';
		if(!err && response.statusCode == 200){
			let $ =cheerio.load(body,{decodeEntities: false});
				content = $('.body-content .field-item.even').html();
				/*if(content===null){
					console.log(body);
				}*/
		}
		callback(err,content || null);
	});
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
			//console.log($me.find('a').attr('href').match(/\/([a-z0-9]+)/)[1]);
			items.push({
				title: $me.find('h1 a').text(),
				href: $me.find('a').attr('href'),
				des: $me.find('.field-item p').text(),
				typenav: $me.find('a').attr('href').match(/\/([a-z0-9]+)/)[1]
			});
		});

		async.forEach(items,function(item,cb){
			readContent(item.href,function(err,content){
				//console.log(3,content.length);			
				if(content){
					item.content = content;
				}else{
					item.content = item.des;
                }
                cb();
			});
		},function(err){
			//console.log(3,items);
			callback(err,items);
		})


		//fs.writeFile('./1.html',body);
		
	});
}

function write (messages,callback) {
	//console.log(messages.length);
	//endPage = messages.page;
	async.forEach(messages,function(item,cb){
		/*db.remove(item,function(err,doc){
			//console.log(1);
		});*/

		db.create(item,function(err,doc){
			//let newDate = new Date();
			//doc.date = newDate.getFullYear()+"-"+newDate.getMonth()+"-"+newDate.getDate();
			cb(err,doc);
		});
	},callback);
}

function readAsync(url,params,oldPage,pageEnd,callback){
	var urls = url + '?'+ params +'=' + oldPage;
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
		function(messages,callback){
			//console.log(1,messages);
			async.filter(messages,function(item,cb){
				let title = '';
				db.find({title:item.title},function(err,docs){
					if(!err){
						title = docs.title;
					}
				});
				//console.log('rt',title);
				cb(null,item.title!=title);

			},function(err,results){
				//console.log('r',results.length);
				callback(err,results);
			});
		},
		function(messages,cb){

			//console.log('w',messages.length);
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






