var Article = require('../../models/article.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
    checkJSONLogin = auth.checkJSONLogin,
    checkLogin = auth.checkLogin,
    multer = require('multer'),
    upload = multer({ dest: 'public/uploads/' });

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

    var cpUpload = upload.fields([{ name: 'desImg', maxCount: 1 }, { name: 'stepImgs', maxCount: 15 }]);
    app.post('/admin/articleList/add', checkJSONLogin);
    app.post('/admin/articleList/add', cpUpload, function(req, res) {
        var option = {
            name: req.body.name,
            description: req.body.description,
            desImg: req.files.desImg[0].filename,
            food: JSON.parse(req.body.food),
            content: JSON.parse(req.body.content),
            createdBy: req.session.admin._id
        };
        option.content.forEach(function(singleStep) {
            var imgs = singleStep.stepImages;
            if (imgs != "") {
                singleStep.stepImages = imgs.split(",").map(function(img) {
                    return req.files.stepImgs.filter(function(filter) {
                        return filter.originalname == img;
                    })[0].filename;
                }).join(",");
            }
        });

        var article = new Article(option);

        article.save().then(function(article) {
            if (article) {
                res.json({ sucess: true, id: article._id });
            }
        }).catch(function(err) {
            console.log(err);
        });
    });

    app.post('/admin/articleList/edit', checkJSONLogin);
    app.post('/admin/articleList/edit', cpUpload, function(req, res) {
        Article.get(req.body.id)
            .then(function(article) {
                var option = {
                    name: req.body.name,
                    description: req.body.description,
                    food: JSON.parse(req.body.food),
                    content: JSON.parse(req.body.content),
                    createdBy: req.session.admin._id
                };

                if (req.files.desImg && req.files.desImg.length > 0) {
                    option.desImg = req.files.desImg[0].filename;
                }

                option.content.forEach(function(singleStep) {
                    var imgs = singleStep.stepImages;
                    if (imgs != "") {
                        singleStep.stepImages = imgs.split(",").map(function(img) {
                            if (req.files.stepImgs) {
                                var imgArray = req.files.stepImgs.filter(function(filter) {
                                    return filter.originalname == img;
                                });
                                if (imgArray.length > 0) {
                                    return imgArray[0].filename;
                                }
                            }
                            return img;
                        }).join(",");
                    }
                });

                var article = new Article(option);

                article.update(req.body.id).then(function(result) {
                    if (result && result.ok && result.nModified == 1) {
                        res.json({ sucess: true, id: req.body.id });
                    }
                }).catch(function(err) {
                    console.log(err);
                });
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

    app.post('/admin/articleList/deleteAll', checkJSONLogin);
    app.post('/admin/articleList/deleteAll', function(req, res) {
        Article.deleteAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能删除！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/articleList/publishAll', checkJSONLogin);
    app.post('/admin/articleList/publishAll', function(req, res) {
        Article.publishAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能发布！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
    });

    app.post('/admin/articleList/unPublishAll', checkJSONLogin);
    app.post('/admin/articleList/unPublishAll', function(req, res) {
        Article.unPublishAll(req.body.ids.split(",")).then(function(result) {
            if (result && result.ok && result.nModified > 0) {
                res.jsonp({ sucess: true });
                return;
            }
            res.jsonp({ error: "没能停用！" });
        }).catch(function(err) {
            res.jsonp({ error: err });
        });
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
                total: result.count,
                page: page,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * settings.gridlineCount + result.articles.length) == result.count
            });
        });
    });

    // app.post('/cool-profile', cpUpload, function(req, res, next) {
    //     // req.files 是一个对象 (String -> Array) 键是文件名, 值是文件数组
    //     //
    //     // 例如：
    //     //  req.files['avatar'][0] -> File
    //     //  req.files['gallery'] -> Array
    //     //
    //     // req.body 将具有文本域数据, 如果存在的话
    // })
}