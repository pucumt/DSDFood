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
    $.post("/client/articleList/search?" + pStr, filter, function(data) {
        $mainSelectBody.empty();
        if (data && data.articles.length > 0) {
            var d = $(document.createDocumentFragment());
            data.articles.forEach(function(article) {
                var trObject = $('<div class="article clearfix" id="' + article._id + '"><div class="img"><img src="/uploads/' + article.desImg +
                    '"></div><div class="info"><div class="title"><h1>' + article.name + '</h1></div><div class="desc">' +
                    article.description + '</div></div></div>');
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

$(".content .articleList").on("click", ".article", function(e) {
    var id = $(e.currentTarget).attr("id");
    window.open("/article/id/" + id);
    // location.href = "/article/id/" + id;
});
//------------end