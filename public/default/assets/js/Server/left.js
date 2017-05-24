$(document).ready(function() {
    $("#left_btnArticleList").on("click", function(e) {
        location.href = "/admin/articleList";
    });

    $("#left_btnArticleAdd").on("click", function(e) {
        location.href = "/admin/articleList/Add";
    });

    $("#left_btnMaterialList").on("click", function(e) {
        location.href = "/admin/foodMaterialList";
    });

    $("#left_btnMaterialAdd").on("click", function(e) {
        location.href = "/admin/foodMaterialList/Add";
    });
});