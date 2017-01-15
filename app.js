var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*session*/
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var list = require('./routes/list');
var detail = require('./routes/detail');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//使用session中间件 req.session.user;
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'zouqilai',
    //session中间件非常灵活，可以把session数据放在指定的位置，默认是放在服务器端内存里，但也可以放在mongodb数据库里
    store:new MongoStore({
        url:'mongodb://127.0.0.1/wcfn'
    })
}));
// res.locals 是真正渲染模板的对象，在render里的那个渲染的时候也会先把属性和值都拷贝到此对象上，再用这个对象来进行渲染模板
app.use(function(req,res,next){
    res.locals.error =  req.session.error;
    //清空原来的req.session中的值
    req.session.error = null;
    res.locals.success =  req.session.success;
    //清空原来的req.session中的值
    req.session.success = null;
    //把会话对象中的user取出来赋给了locals.user属性
    res.locals.user = req.session.user;
    next();
});


app.use('/', index);
app.use(/^\/(CSS3|mobile|JavaScript)(\?page=\d+)?$/, list);//列表
app.use('/users', users);//用户登录
app.use(/^(\/[a-zA-Z0-9-]+)*\/[a-zA-Z0-9-]+(.(htm|html))?$/, detail);//文章详细页

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
