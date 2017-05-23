var crypto = require('crypto'),
    mongoose = require('./db'),
    db = mongoose.connection,
    gridlineCount = mongoose.gridlineCount,
    ObjectId = mongoose.Schema.Types.ObjectId;

var foodMaterialSchema = new mongoose.Schema({
    name: String,
    mainNameId: ObjectId, //学名，本身为学名则空
    content: String,
    createdDate: { type: Date, default: Date.now },
    createdBy: ObjectId
}, {
    collection: 'foodMaterials'
});

var foodMaterialModel = mongoose.model('FoodMaterial', foodMaterialSchema);

function FoodMaterial(option) {
    this.option = option;
};

module.exports = FoodMaterial;

//存储用户信息
FoodMaterial.prototype.save = function() {
    //打开数据库
    var newFoodMaterial = new foodMaterialModel(this.option);
    return newFoodMaterial.save();
};

FoodMaterial.prototype.update = function(id) {
    return foodMaterialModel.update({
        _id: id
    }, this.option).exec();
};

//读取用户信息
FoodMaterial.get = function(id) {
    //打开数据库
    return foodMaterialModel.findOne({ _id: id });
};

//读取用户信息
FoodMaterial.getbyName = function(name) {
    //打开数据库
    return foodMaterialModel.findOne({ name: name, isDeleted: false });
};

FoodMaterial.getFilter = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return foodMaterialModel.findOne(filter);
};

FoodMaterial.getFilters = function(filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    //打开数据库
    return foodMaterialModel.find(filter);
};

//删除一个用户
FoodMaterial.delete = function(id) {
    return foodMaterialModel.update({
        _id: id
    }, {
        isDeleted: true
    }).exec();
};

FoodMaterial.getAll = function(page, filter) {
    if (!filter) {
        filter = {};
    }
    filter.isDeleted = false;
    var query = foodMaterialModel.count(filter);
    return query.exec().then(function(count) {
        return query.find()
            .skip((page - 1) * gridlineCount)
            .limit(gridlineCount)
            .exec().then(function(foodMaterials) {
                return { foodMaterials: foodMaterials, count: count };
            });
    });
};