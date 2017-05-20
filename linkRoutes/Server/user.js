var User = require('../../models/user.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
    checkLogin = auth.checkLogin,
    checkJSONLogin = auth.checkJSONLogin;

module.exports = function(app) {
    app.get('/admin/userList', checkLogin);
    app.get('/admin/userList', function(req, res) {
        res.render('Server/userList.html', {
            title: '>管理员设置',
            user: req.session.admin
        });
    });

    app.post('/admin/user/add', checkJSONLogin);
    app.post('/admin/user/add', function(req, res) {
        var user = new User({
            name: req.body.username,
            password: req.body.password
        });
        user.save().then(function(result) {
            res.json(result);
        })
    });

    app.post('/admin/user/edit', checkJSONLogin);
    app.post('/admin/user/edit', function(req, res) {
        var user = new User({
            name: req.body.username,
            password: req.body.password
        });

        user.update(req.body.id).then(function(result) {
            if (result && result.ok && result.nModified == 1) {
                res.json({ sucess: true });
            } else {
                res.json({ error: "修改失败" });
            }
        });
    });

    app.post('/admin/user/delete', checkJSONLogin);
    app.post('/admin/user/delete', function(req, res) {
        User.delete(req.body.id).then(function(result) {
            if (result && result.ok && result.nModified == 1) {
                res.json({ sucess: true });
            } else {
                res.json({ error: "删除失败" });
            }
        });
    });

    app.post('/admin/user/find', checkJSONLogin);
    app.post('/admin/user/find', function(req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 1;
        var filter = {};
        if (req.body.name) {
            var reg = new RegExp(req.body.name, 'i')
            filter.name = {
                $regex: reg
            };
        }
        User.getAll(page, filter).then(function(result) {
            res.json({
                users: result.users,
                total: result.count,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * settings.gridlineCount + result.users.length) == result.count
            });
        });
    });
}