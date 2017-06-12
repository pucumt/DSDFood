var Article = require('../../models/article.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
    checkJSONLogin = auth.checkJSONLogin,
    checkLogin = auth.checkLogin;

module.exports = function(app) {
    // app.get('/', checkLogin)
    app.get('/article/id/:id', function(req, res) {
        Article.get(req.params.id).then(function(article) {
            res.render('Client/articleDetail.html', {
                title: '主页',
                user: req.session.user,
                id: req.params.id
            });
        });
    });

    app.post('/client/article/id/:id', function(req, res) {
        Article.get(req.params.id).then(function(article) {
            res.json(article);
        });
    });

    app.post('/client/articleList/search', function(req, res) {
        //判断是否是第一页，并把请求的页数转换成 number 类型
        var page = req.query.p ? parseInt(req.query.p) : 1;
        //查询并返回第 page 页的 20 篇文章
        var filter = {};
        if (req.body.name) {
            var reg = new RegExp(req.body.name, 'i')
            filter.name = {
                $regex: reg
            };
        }
        Article.getAll(page, filter).then(function(result) {
            res.json({
                articles: result.articles,
                total: result.count,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * settings.gridlineCount + result.articles.length) == result.count
            });
        });
    });
}