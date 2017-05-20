var crypto = require('crypto'),
    mongoose = require('./db'),
    db = mongoose.connection,
    gridlineCount = mongoose.gridlineCount;

var articleSchema = new mongoose.Schema({
    name: String, //email
    content: String,
    isPublish: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    createdBy: String,
    publishedBy: String
}, {
    collection: 'articles'
});

var articleModel = mongoose.model('Article', articleSchema);

function Article(option) {
    this.option = option;
};

module.exports = Article;

//存储用户信息
Article.prototype.save = function() {
    //打开数据库
    var newArticle = new articleModel(this.option);
    return newArticle.save();
};

Article.prototype.update = function(id) {
    return articleModel.update({
        _id: id
    }, this.option).exec();
};

//读取用户信息
Article.get = function(id) {
    //打开数据库
    return articleModel.findOne({ _id: id });
};

//读取用户信息
Article.getbyName = function(name) {
    //打开数据库
    return articleModel.findOne({ name: name, isDeleted: false });
};

Article.getFilter = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return articleModel.findOne(filter);
};

Article.getFilters = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return articleModel.find(filter);
};

//删除一个用户
Article.delete = function(id) {
    return articleModel.update({
        _id: id
    }, {
        isDeleted: true
    }).exec();
};

Article.getAll = function(page, filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    var query = articleModel.count(filter);
    return query.exec().then(function(count) {
        return query.find()
            .skip((page - 1) * gridlineCount)
            .limit(gridlineCount)
            .exec().then(function(articles) {
                return { articles: articles, count: count };
            });
    });
};