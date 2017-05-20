var isNew = true,
    fullExams;

$(document).ready(function() {
    $("#left_btnArticleList").addClass("active");
    $("#confirmModal").find(".modal-content").draggable(); //为模态对话框添加拖拽
    $("#confirmModal").css("overflow", "hidden"); //禁止模态对话框的半透明背景滚动
    $("#confirmModal").find(".modal-body").css("overflow-y", "auto"); //竖滚动条自动出现

    searchArticle();
});

//------------search funfunction
var $mainSelectBody = $('.content.mainModal table tbody');
var getButtons = function(isWeixin) {
    var buttons = '<a class="btn btn-default btnEdit">编辑</a><a class="btn btn-default btnDelete">删除</a><a class="btn btn-default btnUpgrade">升班链接</a>';
    if (isPublish == 1) {
        buttons += '<a class="btn btn-default btnUnPublish">停用</a>';
    } else {
        buttons += '<a class="btn btn-default btnPublish">发布</a>';
    }
    return buttons;
};
var getClassStatus = function(isWeixin) {
    if (isPublish == 1) {
        return "发布";
    } else if (isWeixin == 9) {
        return "停用";
    } else {
        return "新建";
    }

};

function searchArticle(p) {
    var filter = {
            name: $.trim($(".mainModal #InfoSearch #name").val())
        },
        pStr = p ? "p=" + p : "";
    $mainSelectBody.empty();
    $.post("/admin/articleList/search?" + pStr, filter, function(data) {
        $mainSelectBody.empty();
        if (data && data.trainClasss.length > 0) {
            var d = $(document.createDocumentFragment());
            data.trainClasss.forEach(function(trainClass) {
                var trObject = $('<tr id=' + trainClass._id + '><td><span><input type="checkbox" name="trainId" value=' + trainClass._id + ' /></span>' + trainClass.name + '</td><td>' +
                    getClassStatus(trainClass.isWeixin) + '</td><td>' + trainClass.trainPrice + '</td><td>' + trainClass.materialPrice +
                    '</td><td>' + trainClass.gradeName + '</td><td>' + trainClass.subjectName + '</td><td>' +
                    trainClass.categoryName + '</td><td>' + trainClass.enrollCount + '/' + trainClass.totalStudentCount + '</td><td><div class="btn-group">' + getButtons(trainClass.isWeixin) + '</div></td></tr>');
                trObject.find(".btn-group").data("obj", trainClass);
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
    searchArticle();
});

$("#mainModal .paging .prepage").on("click", function(e) {
    var page = parseInt($("#mainModal #page").val()) - 1;
    searchArticle(page);
});

$("#mainModal .paging .nextpage").on("click", function(e) {
    var page = parseInt($("#mainModal #page").val()) + 1;
    searchArticle(page);
});
//------------end

//------------main form events
$("#btnAdd").on("click", function(e) {
    //go to new page
    location.href = "/admin/articleList/add";
});

$(".content.mainModal #gridBody").on("click", "td .btnEdit", function(e) {
    //go to edit page
    location.href = "/admin/articleList/id/" + "111";
});
//------------end

function getAllCheckedRecords() {
    var trainIds = [];
    $(".mainModal #gridBody [name='trainId']")
        .each(function(index) {
            if (this.checked) {
                trainIds.push($(this).val());
            }
        });
    return trainIds;
};

$(".toolbar #btnPublishAll").on("click", function(e) {
    var trainIds = getAllCheckedRecords();
    if (trainIds.length > 0) {
        showComfirm("确定要发布吗?");
        $("#btnConfirmSave").off("click").on("click", function(e) {
            $.post("/admin/trainClass/publishAll", {
                ids: JSON.stringify(trainIds)
            }, function(data) {
                if (data.sucess) {
                    showAlert("发布成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        searchArticle(page);
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
            $.post("/admin/trainClass/unPublishAll", {
                ids: JSON.stringify(trainIds)
            }, function(data) {
                if (data.sucess) {
                    showAlert("停用成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        searchArticle(page);
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
            $.post("/admin/trainClass/deleteAll", {
                ids: JSON.stringify(trainIds)
            }, function(data) {
                if (data.sucess) {
                    showAlert("删除成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        searchArticle(page);
                    });
                }
            });
        });
    }
});