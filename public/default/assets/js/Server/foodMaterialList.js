var isNew = true,
    fullExams;

$(document).ready(function() {
    $("#left_btnMaterialList").addClass("active");
    $("#confirmModal").find(".modal-content").draggable(); //为模态对话框添加拖拽
    $("#confirmModal").css("overflow", "hidden"); //禁止模态对话框的半透明背景滚动
    $("#confirmModal").find(".modal-body").css("overflow-y", "auto"); //竖滚动条自动出现

    searchFoodMaterial();
});

//------------search funfunction
var $mainSelectBody = $('.content.mainModal table tbody');
var getClassStatus = function(isPublish) {
    if (isPublish == 1) {
        return "发布";
    } else {
        return "停用";
    }
};

function searchFoodMaterial(p) {
    var filter = {
            name: $.trim($(".mainModal #InfoSearch #name").val())
        },
        pStr = p ? "p=" + p : "";
    $mainSelectBody.empty();
    $.post("/admin/foodMaterialList/search?" + pStr, filter, function(data) {
        $mainSelectBody.empty();
        if (data && data.foodMaterials.length > 0) {
            var d = $(document.createDocumentFragment());
            data.foodMaterials.forEach(function(foodMaterial) {
                var trObject = $('<tr id=' + foodMaterial._id + '><td><span><input type="checkbox" name="foodMaterialId" value=' + foodMaterial._id + ' /></span>' + foodMaterial.name + '</td><td>' + (foodMaterial.mainName || '') + '</td><td>' +
                    getClassStatus(foodMaterial.isPublish) + '</td><td>' + moment(foodMaterial.createdDate).format("YYYY-MM-DD HH:mm:ss") + '</td><td><div class="btn-group"><a class="btn btn-default btnEdit">编辑</a></div></td></tr>');
                d.append(trObject);
            });
            $mainSelectBody.append(d);
        }
        $("#mainModal #total").val(data.total);
        $("#mainModal #page").val(data.page);
        setPaging("#mainModal", data);
    });
};

$(".mainModal #InfoSearch #btnSearch").on("click", function(e) {
    searchFoodMaterial();
});

$("#mainModal .paging .prepage").on("click", function(e) {
    var page = parseInt($("#mainModal #page").val()) - 1;
    searchFoodMaterial(page);
});

$("#mainModal .paging .nextpage").on("click", function(e) {
    var page = parseInt($("#mainModal #page").val()) + 1;
    searchFoodMaterial(page);
});
//------------end

//------------main form events
$("#btnAdd").on("click", function(e) {
    //go to new page
    location.href = "/admin/foodMaterialList/add";
});

$(".content.mainModal #gridBody").on("click", "td .btnEdit", function(e) {
    //go to edit page
    location.href = "/admin/foodMaterialList/id/" + $(e.currentTarget).parents("tr").attr("id");
});
//------------end

function getAllCheckedRecords() {
    var trainIds = [];
    $(".mainModal #gridBody [name='foodMaterialId']")
        .each(function(index) {
            if (this.checked) {
                trainIds.push($(this).val());
            }
        });
    return trainIds.join(",");
};

$(".toolbar #btnPublishAll").on("click", function(e) {
    var trainIds = getAllCheckedRecords();
    if (trainIds.length > 0) {
        showComfirm("确定要发布吗?");
        $("#btnConfirmSave").off("click").on("click", function(e) {
            $.post("/admin/foodMaterialList/publishAll", {
                ids: trainIds
            }, function(data) {
                if (data.sucess) {
                    showAlert("发布成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        searchFoodMaterial(page);
                    });
                }
            });
        });
    }
});

$(".toolbar #btnStopAll").on("click", function(e) {
    var trainIds = getAllCheckedRecords();
    if (trainIds.length > 0) {
        showComfirm("确定要停用吗?");
        $("#btnConfirmSave").off("click").on("click", function(e) {
            $.post("/admin/foodMaterialList/unPublishAll", {
                ids: trainIds
            }, function(data) {
                if (data.sucess) {
                    showAlert("停用成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        searchFoodMaterial(page);
                    });
                }
            });
        });
    }
});

$(".toolbar #btnDeleteAll").on("click", function(e) {
    var trainIds = getAllCheckedRecords();
    if (trainIds.length > 0) {
        showComfirm("确定要删除吗?");
        $("#btnConfirmSave").off("click").on("click", function(e) {
            $.post("/admin/foodMaterialList/deleteAll", {
                ids: trainIds
            }, function(data) {
                if (data.sucess) {
                    showAlert("删除成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        searchFoodMaterial(page);
                    });
                }
            });
        });
    }
});