var #Name# = require('../../models/#name#.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
    checkJSONLogin = auth.checkJSONLogin,
    checkLogin = auth.checkLogin;

module.exports = function(app) {
    app.get('/admin/#name#List', checkLogin);
    app.get('/admin/#name#List', function(req, res) {
        res.render('Server/#name#List.html', {
            title: '>文章列表',
            user: req.session.admin
        });
    });

    app.get('/admin/#name#List/add', checkLogin);
    app.get('/admin/#name#List/add', function(req, res) {
        res.render('Server/#name#Edit.html', {
            title: '>文章编辑',
            user: req.session.admin
        });
    });

    app.get('/admin/#name#List/id/:id', checkLogin);
    app.get('/admin/#name#List/id/:id', function(req, res) {
        res.render('Server/#name#Edit.html', {
            title: '>文章编辑',
            user: req.session.admin,
            id: req.params.id
        });
    });

    app.post('/admin/#name#List/add', checkJSONLogin);
    app.post('/admin/#name#List/add', function(req, res) {
        var #name# = new #Name#({
            name: req.body.name,
            food: JSON.parse(req.body.food),
            content: JSON.parse(req.body.content),
            createdBy: req.session.admin._id
        });

        #name#.save().then(function(#name#) {
            if (#name#) {
                res.json({ sucess: true, id: #name#._id });
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.post('/admin/#name#List/edit', checkJSONLogin);
    app.post('/admin/#name#List/edit', function(req, res) {
        var #name# = new #Name#({
            name: req.body.name,
            food: JSON.parse(req.body.food),
            content: JSON.parse(req.body.content),
            createdBy: req.session.admin._id
        });

        #name#.update(req.body.id).then(function(result) {
            if (result && result.ok && result.nModified == 1) {
                res.json({ sucess: true, id: req.body.id });
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.post('/admin/#name#List/id/:id', checkJSONLogin);
    app.post('/admin/#name#List/id/:id', function(req, res) {
        #Name#.get(req.params.id).then(function(#name#) {
            if (#name#) {
                res.json(#name#);
            } else {
                res.json(false);
            }
        })
    });

    app.post('/admin/#name#List/deleteAll', checkJSONLogin);
    app.post('/admin/#name#List/deleteAll', function(req, res) {
        #Name#.deleteAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能删除！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/#name#List/publishAll', checkJSONLogin);
    app.post('/admin/#name#List/publishAll', function(req, res) {
        #Name#.publishAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能发布！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/#name#List/unPublishAll', checkJSONLogin);
    app.post('/admin/#name#List/unPublishAll', function(req, res) {
        #Name#.unPublishAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能停用！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/#name#List/search', checkJSONLogin);
    app.post('/admin/#name#List/search', function(req, res) {
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
        #Name#.getAll(page, filter).then(function(result) {
            res.jsonp({
                #name#s: result.#name#s,
                total: result.count,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * settings.gridlineCount + result.#name#s.length) == result.count
            });
        });
    });
}