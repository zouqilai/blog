//要求后续的路由只能登录后的用户才能访问,如果未登录，让他登录去
exports.checkLogin =  function(req,res,next){
    //如果user有值，则意味着此用户已经登录过
   if(req.session.user){
       next();// 可以继续往下执行
   }else{//如果没有得登录过，则跳到登录页登录
       res.redirect('/user/signin');
   }
}
//只有未登录的用户才能继续访问
exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
        req.session.error = '只有未登录的用户才能访问此资源';
        res.redirect('/');
    }else{
        next();
    }
}