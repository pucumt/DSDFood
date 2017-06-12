var login = require('./login.js'),
    logout = require('./logout.js'),
    user = require('./user.js'),
    article = require('./article.js'),
    auth = require("./auth"),
    checkLogin = auth.checkLogin;;

module.exports = function(app) {
    // app.get('/', checkLogin)
    app.get('/', function(req, res) {
        res.render('Client/articleList.html', {
            title: '主页',
            user: req.session.user
        });
    });

    login(app);
    logout(app);
    user(app);
    article(app);
};