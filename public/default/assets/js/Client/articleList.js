var isNew = true,
    fullExams;

$(document).ready(function() {
    searchArticle();
});

//------------search funfunction
var $mainSelectBody = $('.content .articleList');

function searchArticle(p) {
    var filter = {
            name: $.trim($(".search #name").val())
        },
        pStr = p ? "p=" + p : "";
    $mainSelectBody.empty();
    $.post("/admin/articleList/search?" + pStr, filter, function(data) {
        $mainSelectBody.empty();
        if (data && data.articles.length > 0) {
            var d = $(document.createDocumentFragment());
            data.articles.forEach(function(article) {
                var trObject = $('<div class="article"><div class="title"><h1>' + article.name + '</h1></div><div class="detail">' + article.content[0].stepDescription + '</div></div>');
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