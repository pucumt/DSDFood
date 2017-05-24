var crypto = require('crypto'),
    mongoose = require('./db'),
    db = mongoose.connection,
    gridlineCount = mongoose.gridlineCount,
    ObjectId = mongoose.Schema.Types.ObjectId;

var #name#Schema = new mongoose.Schema({
    name: String, //email
    food: [{
        foodName: String,
        foodWeight: String
    }],
    content: [{
        stepDescription: String,
        stepImages: String
    }],
    isPublish: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    createdBy: ObjectId,
    publishedBy: String
}, {
    collection: '#name#s'
});

var #name#Model = mongoose.model('#Name#', #name#Schema);

function #Name#(option) {
    this.option = option;
};

module.exports = #Name#;

//存储用户信息
#Name#.prototype.save = function() {
    //打开数据库
    var new#Name# = new #name#Model(this.option);
    return new#Name#.save();
};

#Name#.prototype.update = function(id) {
    return #name#Model.update({
        _id: id
    }, this.option).exec();
};

//读取用户信息
#Name#.get = function(id) {
    //打开数据库
    return #name#Model.findOne({ _id: id });
};

//读取用户信息
#Name#.getbyName = function(name) {
    //打开数据库
    return #name#Model.findOne({ name: name, isDeleted: false });
};

#Name#.getFilter = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return #name#Model.findOne(filter);
};

#Name#.getFilters = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return #name#Model.find(filter);
};

//删除一个用户
#Name#.delete = function(id) {
    return #name#Model.update({
        _id: id
    }, {
        isDeleted: true
    }).exec();
};

#Name#.getAll = function(page, filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    var query = #name#Model.count(filter);
    return query.exec().then(function(count) {
        return query.find()
            .skip((page - 1) * gridlineCount)
            .limit(gridlineCount)
            .exec().then(function(#name#s) {
                return { #name#s: #name#s, count: count };
            });
    });
};

#Name#.deleteAll = function(ids) {
    return #name#Model.update({
        _id: { $in: ids }
    }, {
        isDeleted: true
    }, { multi: true }).exec();
};

#Name#.publishAll = function(ids) {
    return #name#Model.update({
        _id: { $in: ids }
    }, {
        isPublish: true
    }, { multi: true }).exec();
};

#Name#.unPublishAll = function(ids) {
    return #name#Model.update({
        _id: { $in: ids }
    }, {
        isPublish: false
    }, { multi: true }).exec();
};