var express = require('express');
var path = require('path');
var User = require(path.resolve('./bin/db/index.js')).User;
var auth = require('../public/javascripts/author/index.js');
var router = express.Router();

/*checkNotLogin 如果用户登录不在显示此页面*/
router.get('/signup', auth.checkNotLogin, function(req, res) {
	res.render('admin/signup',{title:'注册'});
});

router.post('/signup', auth.checkNotLogin, function(req,res){
	var user = req.body;
	if(user.username && user.password){
		User.findOne({username:user.username},function(err,oldUser){
			if(err){
				//把错误原因放在session对象中
                req.session.error = err;
                //back表示让客户端 重新向上一个页发请求，其实就是 /user/signup
                res.redirect('back');
			}else{
				if(oldUser){
                    req.session.error = '用户名已经被占用，大侠请改个别的名字吧,比如'+user.username+'200';
                    res.redirect('back');
                }else{
                    User.create(user,function(err,doc){
                        if(err){
                            //把错误原因放在session对象中
                            req.session.error = err;
                            //back表示让客户端 重新向上一个页发请求，其实就是 /user/signup
                            res.redirect('back');
                        }else{
                            //把保存后的对象作为req.session属性,session对象是在服务器端内存里放置
                            req.session.user = doc;
                            res.redirect('/signin');
                        }
                    })
                }
			}
		});
	}else{
		req.session.error = '用户和密码不能为空!';
        res.redirect('back');
	}
});

router.get('/signin', auth.checkNotLogin, function(req, res){
	res.render('admin/signin',{title:'登录'});
});

module.exports = router;
