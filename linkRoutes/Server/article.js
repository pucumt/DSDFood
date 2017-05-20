var Article = require('../../models/article.js'),
    auth = require("./auth"),
    settings = require('../../settings.js'),
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
            title: '>文章列表',
            user: req.session.admin
        });
    });

    app.post('/admin/articleList/add', checkLogin);
    app.post('/admin/articleList/add', function(req, res) {
        // var article = new Article({
        //     name: req.body.name,
        //     yearId: req.body.yearId,
        //     yearName: req.body.yearName,
        //     gradeId: req.body.gradeId,
        //     gradeName: req.body.gradeName,
        //     subjectId: req.body.subjectId,
        //     subjectName: req.body.subjectName,
        //     categoryId: req.body.categoryId,
        //     categoryName: req.body.categoryName,
        //     totalStudentCount: req.body.totalStudentCount, //招生人数
        //     totalClassCount: req.body.totalClassCount, //共多少课时
        //     trainPrice: req.body.trainPrice,
        //     materialPrice: req.body.materialPrice,
        //     teacherId: req.body.teacherId,
        //     teacherName: req.body.teacherName,
        //     attributeId: req.body.attributeId,
        //     attributeName: req.body.attributeName,
        //     courseStartDate: req.body.courseStartDate,
        //     courseEndDate: req.body.courseEndDate,
        //     courseTime: req.body.courseTime,
        //     courseContent: req.body.courseContent,
        //     classRoomId: req.body.classRoomId,
        //     classRoomName: req.body.classRoomName,
        //     schoolId: req.body.schoolId,
        //     schoolArea: req.body.schoolArea,
        //     isWeixin: 0,
        //     enrollCount: 0,
        //     exams: JSON.parse(req.body.exams)
        // });

        // Article.save().then(function(tclass) {
        //     res.jsonp(tclass);
        // });
    });

    app.post('/admin/articleList/edit', checkLogin);
    app.post('/admin/articleList/edit', function(req, res) {
        // var trainClass = new TrainClass({
        //     name: req.body.name,
        //     yearId: req.body.yearId,
        //     yearName: req.body.yearName,
        //     gradeId: req.body.gradeId,
        //     gradeName: req.body.gradeName,
        //     subjectId: req.body.subjectId,
        //     subjectName: req.body.subjectName,
        //     categoryId: req.body.categoryId,
        //     categoryName: req.body.categoryName,
        //     totalStudentCount: req.body.totalStudentCount, //招生人数
        //     totalClassCount: req.body.totalClassCount, //共多少课时
        //     trainPrice: req.body.trainPrice,
        //     materialPrice: req.body.materialPrice,
        //     teacherId: req.body.teacherId,
        //     teacherName: req.body.teacherName,
        //     attributeId: req.body.attributeId,
        //     attributeName: req.body.attributeName,
        //     courseStartDate: req.body.courseStartDate,
        //     courseEndDate: req.body.courseEndDate,
        //     courseTime: req.body.courseTime,
        //     courseContent: req.body.courseContent,
        //     classRoomId: req.body.classRoomId,
        //     classRoomName: req.body.classRoomName,
        //     schoolId: req.body.schoolId,
        //     schoolArea: req.body.schoolArea,
        //     exams: JSON.parse(req.body.exams)
        // });

        // trainClass.update(req.body.id)
        //     .then(function() {
        //         res.jsonp(trainClass);
        //     });
    });

    app.post('/admin/articleList/delete', checkLogin);
    app.post('/admin/articleList/delete', function(req, res) {
        // TrainClass.delete(req.body.id, function(err, trainClass) {
        //     if (err) {
        //         res.jsonp({ error: err });
        //         return;
        //     }
        //     res.jsonp({ sucess: true });
        // });
    });

    app.post('/admin/articleList/publishAll', checkLogin);
    app.post('/admin/articleList/publishAll', function(req, res) {
        // TrainClass.publishAll(JSON.parse(req.body.ids), function(err, trainClass) {
        //     if (err) {
        //         res.jsonp({ error: err });
        //         return;
        //     }
        //     res.jsonp({ sucess: true });
        // });
    });

    app.post('/admin/articleList/deleteAll', checkLogin);
    app.post('/admin/articleList/deleteAll', function(req, res) {
        // TrainClass.deleteAll(JSON.parse(req.body.ids))
        //     .then(function() {
        //         res.jsonp({ sucess: true });
        //     });
    });

    app.post('/admin/articleList/search', checkLogin);
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