var isNew = true,
    fullExams;

$(document).ready(function() {
    $("#left_btnMaterialAdd").addClass("active");
    $("#confirmModal").find(".modal-content").draggable(); //为模态对话框添加拖拽
    $("#confirmModal").css("overflow", "hidden"); //禁止模态对话框的半透明背景滚动
    $("#confirmModal").find(".modal-body").css("overflow-y", "auto"); //竖滚动条自动出现
    // var editor = new WPEditor($("#foodMaterialContent"));

    $(".toolbar #btnSave").on("click", function(e) {
        // var validator = $('.mainModal').data('formValidation').validate();
        // if (validator.isValid()) {
        var postURI = "/admin/foodMaterialList/add",
            postObj = {
                name: $.trim($('.mainModal #name').val()),
                mainName: $.trim($(this).find(".mainName").val()),
                content: $.trim($(this).find(".wpeditor").html())
            };
        if ($("#id").val() != "") {
            postURI = "/admin/foodMaterialList/edit";
            postObj.id = $('#id').val();
        }
        $.post(postURI, postObj, function(data) {
            if (data && data.sucess) {
                showAlert("保存成功！");
                $("#id").val(data.id);
            } else {
                showAlert("保存出错！");
            }
        });
        // }
    });

    function loadFoodMaterial() {
        $.post("/admin/foodMaterialList/id/" + $("#id").val(), function(data) {
            if (data) {
                $('.mainModal #name').val(data.name);
                $('.mainModal #mainName').val(data.mainName);
                $('.mainModal #wpeditor').html(data.content);
            } else {
                showAlert("获取食材出错！");
            }
        });
    };

    if ($("#id").val() != "") {
        loadFoodMaterial()
    }
});