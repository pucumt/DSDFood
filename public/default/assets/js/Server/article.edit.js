var isNew = true,
    fullExams;

$(document).ready(function() {
    $("#left_btnArticleAdd").addClass("active");
    $("#confirmModal").find(".modal-content").draggable(); //为模态对话框添加拖拽
    $("#confirmModal").css("overflow", "hidden"); //禁止模态对话框的半透明背景滚动
    $("#confirmModal").find(".modal-body").css("overflow-y", "auto"); //竖滚动条自动出现
    // var editor = new WPEditor($("#articleContent"));

    $(".mainModal").on("change", ".desImgDiv .desImg", function(e) {
        var imglist = $(e.currentTarget).prev().empty();
        var fileList = this.files;
        if (fileList.length > 0) {
            for (var i = 0; i < fileList.length; i++) {
                var img = $("<img style='max-width:500px; display: block;' />");
                imglist.append(img);
                img.attr("src", window.URL.createObjectURL(fileList[i]));
            }
        };
    });

    var cloneStep = $(".step").clone(),
        cloneFood = $(".food").clone();

    $(".mainModal").on("click", ".step .btnDelete", function(e) {
        $(e.currentTarget).parents(".step").remove();
        resetStepName();
    });

    $(".mainModal").on("click", ".step .btnStep", function(e) {
        $(e.currentTarget).parents(".step").after(cloneStep.clone());
        resetStepName();
    });

    $(".mainModal").on("change", ".step .pic", function(e) {
        var imglist = $(e.currentTarget).prev().empty();
        var fileList = this.files;
        if (fileList.length > 0) {
            for (var i = 0; i < fileList.length; i++) {
                var img = $("<img style='max-width:500px; display: block;' />");
                imglist.append(img);
                img.attr("src", window.URL.createObjectURL(fileList[i]));
            }
        };
    });

    function resetStepName() {
        $(".mainModal .step .description").each(function(index) {
            this.innerHTML = "方法步驟" + (index + 1) + ":";
        });
    }

    $(".mainModal").on("click", ".food .btnDelete", function(e) {
        $(e.currentTarget).parents(".food").remove();
    });

    $(".mainModal").on("click", ".food .btnFood", function(e) {
        $(e.currentTarget).parents(".food").after(cloneFood.clone());
    });

    $(".toolbar #btnSave").on("click", function(e) {
        var postURI = "/admin/articleList/add";
        var file = $('.desImgDiv .desImg')[0].files;
        var formData = new FormData();
        if (file.length > 0) {
            formData.append("desImg", file[0]);
        }
        formData.append("name", $.trim($('.mainModal #name').val()));
        formData.append("description", $.trim($('.mainModal #description').html()));
        formData.append("food", getFoods());
        formData.append("content", getContents());

        $('.mainModal .pic').each(function(index) {
            if (this.files.length > 0) {
                for (var i = 0; i < this.files.length; i++) {
                    formData.append("stepImgs", this.files[i]);
                };
            }
        });

        if ($("#id").val() != "") {
            postURI = "/admin/articleList/edit";
            formData.append("id", $('#id').val());
        }

        $.ajax({
            type: "POST",
            data: formData,
            url: "/admin/articleList/edit",
            contentType: false,
            processData: false,
        }).then(function(data) {
            if (data && data.sucess) {
                showAlert("保存成功！");
                $("#id").val(data.id);
            } else {
                showAlert("保存出错！");
            }
        });
    });

    function getFoods() {
        var foods = [];
        $(".mainModal .food").each(function(index) {
            var foodName = $.trim($(this).find("[name='foodName']").val());
            if (foodName != "") {
                foods.push({
                    foodName: foodName,
                    foodWeight: $.trim($(this).find("[name='foodWeight']").val())
                });
            }
        });
        return JSON.stringify(foods);
    };

    function setFood(food) {
        var foodDiv = cloneFood.clone();
        foodDiv.find("[name='foodName']").val(food.foodName);
        foodDiv.find("[name='foodWeight']").val(food.foodWeight);

        $(".mainModal .foodlist").append(foodDiv);
    };

    function getContents() {
        var contents = [];
        $(".mainModal .step").each(function(index) {
            var description = $.trim($(this).find(".wpeditor").html());
            if (description != "") {
                contents.push({
                    stepDescription: description,
                    stepImages: getFileNames($(this).find(".pic").prop('files'), this)
                });
            }
        });
        return JSON.stringify(contents);
    };

    function setContents(content) {
        var stepDiv = cloneStep.clone();
        stepDiv.find(".wpeditor").html(content.stepDescription);
        setOnlineImages(content.stepImages, stepDiv.find(".imglist"));

        $(".mainModal .steplist").append(stepDiv);
    };

    function getFileNames(files, step) {
        var names = [];
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                names.push(files[i].name);
            }
            return names.join(",");
        }

        $(step).find(".imglist img").each(function(index) {
            names.push($(this).attr("src").substr(9));
        });
        return names.join(",");
    };

    function setOnlineImages(images, listDiv) {
        if (images && images != "") {
            var imgArray = images.split(",");
            for (var i = 0; i < imgArray.length; i++) {
                var img = $("<img style='max-width:500px; display: block;' />");
                listDiv.append(img);
                img.attr("src", "/uploads/" + imgArray[i]);
            }
        }
    };

    function loadArticle() {
        $.post("/admin/articleList/id/" + $("#id").val(), function(data) {
            if (data) {
                $('.mainModal #name').val(data.name);
                $('.mainModal #description').html(data.description);
                setOnlineImages(data.desImg, $(".desImgDiv .imglist"));
                if (data.food && data.food.length > 0) {
                    $(".mainModal .food [name='foodName']").val(data.food[0].foodName);
                    $(".mainModal .food [name='foodWeight']").val(data.food[0].foodWeight);
                    for (var i = 1; i < data.food.length; i++) {
                        setFood(data.food[i]);
                    }
                }

                if (data.content && data.content.length > 0) {
                    $(".mainModal .step .wpeditor").html(data.content[0].stepDescription);
                    setOnlineImages(data.content[0].stepImages, $(".mainModal .step .imglist"));
                    for (var i = 1; i < data.content.length; i++) {
                        setContents(data.content[i]);
                    }
                    resetStepName();
                }
            } else {
                showAlert("获取文章出错！");
            }
        });
    };

    if ($("#id").val() != "") {
        loadArticle()
    }
});