var crypto = require('crypto'),
    mongoose = require('./db'),
    db = mongoose.connection,
    gridlineCount = mongoose.gridlineCount;

var userSchema = new mongoose.Schema({
    name: String, //email
    password: String,
    mobile: String,
    role: { type: String, default: "admin" },
    isDeleted: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now }
}, {
    collection: 'users'
});

var userModel = mongoose.model('User', userSchema);

function User(option) {
    this.option = option;
};

module.exports = User;

//存储用户信息
User.prototype.save = function() {
    //打开数据库
    var newUser = new userModel(this.option);
    return newUser.save();
};

User.prototype.update = function(id) {
    return userModel.update({
        _id: id
    }, this.option).exec();
};

//读取用户信息
User.get = function(id) {
    //打开数据库
    return userModel.findOne({ _id: id });
};

//读取用户信息
User.getbyName = function(name) {
    //打开数据库
    return userModel.findOne({ name: name, isDeleted: false });
};

User.getFilter = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return userModel.findOne(filter);
};

User.getFilters = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return userModel.find(filter);
};

//删除一个用户
User.delete = function(id) {
    return userModel.update({
        _id: id
    }, {
        isDeleted: true
    }).exec();
};

User.getAll = function(page, filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    var query = userModel.count(filter);
    return query.exec().then(function(count) {
        return query.find()
            .skip((page - 1) * gridlineCount)
            .limit(gridlineCount)
            .exec().then(function(users) {
                return { users: users, count: count };
            });
    });
};