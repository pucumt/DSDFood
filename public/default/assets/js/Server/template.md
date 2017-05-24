var isNew = true,
    fullExams;

$(document).ready(function() {
    $("#left_btn#Name#List").addClass("active");
    $("#confirmModal").find(".modal-content").draggable(); //为模态对话框添加拖拽
    $("#confirmModal").css("overflow", "hidden"); //禁止模态对话框的半透明背景滚动
    $("#confirmModal").find(".modal-body").css("overflow-y", "auto"); //竖滚动条自动出现

    search#Name#();
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

function search#Name#(p) {
    var filter = {
            name: $.trim($(".mainModal #InfoSearch #name").val())
        },
        pStr = p ? "p=" + p : "";
    $mainSelectBody.empty();
    $.post("/admin/#name#List/search?" + pStr, filter, function(data) {
        $mainSelectBody.empty();
        if (data && data.#name#s.length > 0) {
            var d = $(document.createDocumentFragment());
            data.#name#s.forEach(function(#name#) {
                var trObject = $('<tr id=' + #name#._id + '><td><span><input type="checkbox" name="#name#Id" value=' + #name#._id + ' /></span>' + #name#.name + '</td><td>' +
                    getClassStatus(#name#.isPublish) + '</td><td>' + moment(#name#.createdDate).format("YYYY-MM-DD HH:mm:ss") + '</td><td><div class="btn-group"><a class="btn btn-default btnEdit">编辑</a></div></td></tr>');
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
    search#Name#();
});

$("#mainModal .paging .prepage").on("click", function(e) {
    var page = parseInt($("#mainModal #page").val()) - 1;
    search#Name#(page);
});

$("#mainModal .paging .nextpage").on("click", function(e) {
    var page = parseInt($("#mainModal #page").val()) + 1;
    search#Name#(page);
});
//------------end

//------------main form events
$("#btnAdd").on("click", function(e) {
    //go to new page
    location.href = "/admin/#name#List/add";
});

$(".content.mainModal #gridBody").on("click", "td .btnEdit", function(e) {
    //go to edit page
    location.href = "/admin/#name#List/id/" + $(e.currentTarget).parents("tr").attr("id");
});
//------------end

function getAllCheckedRecords() {
    var trainIds = [];
    $(".mainModal #gridBody [name='#name#Id']")
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
            $.post("/admin/#name#List/publishAll", {
                ids: trainIds
            }, function(data) {
                if (data.sucess) {
                    showAlert("发布成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        search#Name#(page);
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
            $.post("/admin/#name#List/unPublishAll", {
                ids: trainIds
            }, function(data) {
                if (data.sucess) {
                    showAlert("停用成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        search#Name#(page);
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
            $.post("/admin/#name#List/deleteAll", {
                ids: trainIds
            }, function(data) {
                if (data.sucess) {
                    showAlert("删除成功！");
                    $("#confirmModal .modal-footer .btn-default").on("click", function(e) {
                        var page = parseInt($("#mainModal #page").val());
                        search#Name#(page);
                    });
                }
            });
        });
    }
});