$(document).ready(function() {
    loadArticle();
});

function loadArticle() {
    $.post("/client/article/id/" + $("#id").val(), function(data) {
        if (data) {
            $(".article-title h1").html(data.name);

            $(".article-content .description").html(data.description);
            $(".article-content .desImg img").attr("src", "/uploads/" + data.desImg);

            var dFood = $(document.createDocumentFragment());
            data.food.forEach(function(food) {
                dFood.append('<div class="col-md-6"><span> ' + food.foodName + '</span><span> ' + food.foodWeight + '</span></div>');
            });
            $(".article-content .food").append(dFood);

            var dcontent = $(document.createDocumentFragment());
            data.content.forEach(function(content) {
                var step = $('<div class="col-md-24"><div class="description">' + content.stepDescription +
                    '</div></div>');
                if (content.stepImages && content.stepImages != "") {
                    var imgDiv = $('<div class="img"></div>');
                    content.stepImages.split(",").forEach(function(image) {
                        imgDiv.append('<img src="/uploads/' + image + '" />');
                    });
                    step.append(imgDiv);
                }
                dcontent.append(step);
            });
            $(".article-content .contents").append(dcontent);
        }
    });
};