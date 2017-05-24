var login = require('./login.js'),
    logout = require('./logout.js'),
    user = require('./user.js'),
    article = require('./article.js'),
    foodMaterial = require('./foodMaterial.js'),
    auth = require("./auth"),
    checkLogin = auth.checkLogin;;

module.exports = function(app) {
    app.get('/admin', checkLogin)
    app.get('/admin', function(req, res) {
        res.render('Server/articleList.html', {
            title: '主页',
            user: req.session.admin
        });
    });

    login(app);
    logout(app);
    user(app);
    article(app);
    foodMaterial(app);
};