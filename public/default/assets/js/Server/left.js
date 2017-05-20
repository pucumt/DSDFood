$(document).ready(function() {
    $("#left_btnArticleList").on("click", function(e) {
        location.href = "/admin/articleList";
    });

    $("#left_btnArticleAdd").on("click", function(e) {
        location.href = "/admin/articleList/Add";
    });
});