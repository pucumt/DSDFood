var crypto = require('crypto'),
    User = require('../../models/user.js'),
    auth = require("./auth"),
    checkNotLogin = auth.checkNotLogin;

module.exports = function (app) {
    app.get('/admin/login', checkNotLogin);
    app.get('/admin/login', function (req, res) {
        res.render('Server/login.html', {
            title: '登录',
            user: req.session.admin
        });
    });

    app.post('/admin/login', checkNotLogin);
    app.post('/admin/login', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.getbyName(req.body.name).then(function (user) {
            if (!user) {
                return res.redirect('/admin/login'); //用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                return res.redirect('/admin/login'); //密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.admin = user;
            res.redirect('/admin/articleList'); //登陆成功后跳转到主页
        });
    });

    app.post('/admin/loginJSON', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.getbyName(req.body.name).then(function (user) {
            if (!user) {
                res.jsonp({
                    error: "not found"
                });
                return;
            }
            //检查密码是否一致
            if (user.password != password) {
                res.jsonp({
                    error: "password not correct"
                });
                return;
            }
            //用户名密码都匹配后，将用户信息存入 session
            req.session.admin = user;
            res.jsonp(user);
        });
    });

    app.post('/admin/resetpwd', checkNotLogin);
    app.post('/admin/resetpwd', function (req, res) {
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update("111111").digest('hex');
        //检查用户是否存在
        User.update({
            name: "dsdAdmin"
        }, {
            password: password
        }).then(function (user) {
            res.jsonp({
                sucess: true
            });
        });
    });
}