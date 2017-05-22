var Article = require('../../models/article.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
    checkJSONLogin = auth.checkJSONLogin,
    checkLogin = auth.checkLogin;

module.exports = function(app) {
    app.get('/admin/articleList', checkLogin);
    app.get('/admin/articleList', function(req, res) {
        res.render('Server/articleList.html', {
            title: '>文章列表',
            user: req.session.admin
        });
    });

    app.get('/admin/articleList/add', checkLogin);
    app.get('/admin/articleList/add', function(req, res) {
        res.render('Server/articleEdit.html', {
            title: '>文章编辑',
            user: req.session.admin
        });
    });

    app.get('/admin/articleList/id/:id', checkLogin);
    app.get('/admin/articleList/id/:id', function(req, res) {
        res.render('Server/articleEdit.html', {
            title: '>文章编辑',
            user: req.session.admin,
            id: req.params.id
        });
    });

    app.post('/admin/articleList/add', checkJSONLogin);
    app.post('/admin/articleList/add', function(req, res) {
        var article = new Article({
            name: req.body.name,
            food: JSON.parse(req.body.food),
            content: JSON.parse(req.body.content),
            createdBy: req.session.admin._id
        });

        article.save().then(function(article) {
            if (article) {
                res.json({ sucess: true, id: article._id });
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.post('/admin/articleList/edit', checkJSONLogin);
    app.post('/admin/articleList/edit', function(req, res) {
        var article = new Article({
            name: req.body.name,
            food: JSON.parse(req.body.food),
            content: JSON.parse(req.body.content),
            createdBy: req.session.admin._id
        });

        article.update(req.body.id).then(function(result) {
            if (result && result.ok && result.nModified == 1) {
                res.json({ sucess: true, id: req.body.id });
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.post('/admin/articleList/id/:id', checkJSONLogin);
    app.post('/admin/articleList/id/:id', function(req, res) {
        Article.get(req.params.id).then(function(article) {
            if (article) {
                res.json(article);
            } else {
                res.json(false);
            }
        })
    });

    app.post('/admin/articleList/delete', checkJSONLogin);
    app.post('/admin/articleList/delete', function(req, res) {
        // TrainClass.delete(req.body.id, function(err, trainClass) {
        //     if (err) {
        //         res.jsonp({ error: err });
        //         return;
        //     }
        //     res.jsonp({ sucess: true });
        // });
    });

    app.post('/admin/articleList/publishAll', checkJSONLogin);
    app.post('/admin/articleList/publishAll', function(req, res) {
        // TrainClass.publishAll(JSON.parse(req.body.ids), function(err, trainClass) {
        //     if (err) {
        //         res.jsonp({ error: err });
        //         return;
        //     }
        //     res.jsonp({ sucess: true });
        // });
    });

    app.post('/admin/articleList/deleteAll', checkJSONLogin);
    app.post('/admin/articleList/deleteAll', function(req, res) {
        // TrainClass.deleteAll(JSON.parse(req.body.ids))
        //     .then(function() {
        //         res.jsonp({ sucess: true });
        //     });
    });

    app.post('/admin/articleList/search', checkJSONLogin);
    app.post('/admin/articleList/search', function(req, res) {
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
            res.jsonp({
                articles: result.articles,
                count: result.count,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * settings.gridlineCount + result.articles.length) == result.count
            });
        });
    });
}