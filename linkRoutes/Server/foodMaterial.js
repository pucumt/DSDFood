var FoodMaterial = require('../../models/foodMaterial.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
    checkJSONLogin = auth.checkJSONLogin,
    checkLogin = auth.checkLogin;

module.exports = function(app) {
    app.get('/admin/foodMaterialList', checkLogin);
    app.get('/admin/foodMaterialList', function(req, res) {
        res.render('Server/foodMaterialList.html', {
            title: '>食材列表',
            user: req.session.admin
        });
    });

    app.get('/admin/foodMaterialList/add', checkLogin);
    app.get('/admin/foodMaterialList/add', function(req, res) {
        res.render('Server/foodMaterialEdit.html', {
            title: '>食材编辑',
            user: req.session.admin
        });
    });

    app.get('/admin/foodMaterialList/id/:id', checkLogin);
    app.get('/admin/foodMaterialList/id/:id', function(req, res) {
        res.render('Server/foodMaterialEdit.html', {
            title: '>食材编辑',
            user: req.session.admin,
            id: req.params.id
        });
    });

    app.post('/admin/foodMaterialList/add', checkJSONLogin);
    app.post('/admin/foodMaterialList/add', function(req, res) {
        var option = {
                name: req.body.name,
                content: req.body.content,
                createdBy: req.session.admin._id
            },
            p = Promise.resolve();
        if (req.body.mainName) {
            p = FoodMaterial.getFilter({ name: req.body.mainName });
        }
        p.then(function(mainMaterial) {
            if (mainMaterial) {
                option.mainNameId = mainMaterial._id;
                option.mainName = mainMaterial.name;
            }
            var foodMaterial = new FoodMaterial(option);
            foodMaterial.save().then(function(foodMaterial) {
                if (foodMaterial) {
                    res.json({ sucess: true, id: foodMaterial._id });
                }
            }).catch(function(err) {
                console.log(err);
            });
        });
    });

    app.post('/admin/foodMaterialList/edit', checkJSONLogin);
    app.post('/admin/foodMaterialList/edit', function(req, res) {
        var foodMaterial = new FoodMaterial({
            name: req.body.name,
            content: req.body.content,
            createdBy: req.session.admin._id
        });

        foodMaterial.update(req.body.id).then(function(result) {
            if (result && result.ok && result.nModified == 1) {
                res.json({ sucess: true, id: req.body.id });
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.post('/admin/foodMaterialList/id/:id', checkJSONLogin);
    app.post('/admin/foodMaterialList/id/:id', function(req, res) {
        FoodMaterial.get(req.params.id).then(function(foodMaterial) {
            if (foodMaterial) {
                res.json(foodMaterial);
            } else {
                res.json(false);
            }
        })
    });

    app.post('/admin/foodMaterialList/publishAll', checkJSONLogin);
    app.post('/admin/foodMaterialList/publishAll', function(req, res) {
        FoodMaterial.publishAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能发布！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/foodMaterialList/deleteAll', checkJSONLogin);
    app.post('/admin/foodMaterialList/deleteAll', function(req, res) {
        FoodMaterial.deleteAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能删除！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/foodMaterialList/unPublishAll', checkJSONLogin);
    app.post('/admin/foodMaterialList/unPublishAll', function(req, res) {
        FoodMaterial.unPublishAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能停用！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/foodMaterialList/search', checkJSONLogin);
    app.post('/admin/foodMaterialList/search', function(req, res) {
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
        FoodMaterial.getAll(page, filter).then(function(result) {
            res.jsonp({
                foodMaterials: result.foodMaterials,
                total: result.count,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * settings.gridlineCount + result.foodMaterials.length) == result.count
            });
        });
    });
}