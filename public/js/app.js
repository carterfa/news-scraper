$(document).ready(function () {

    $.get("/articles", function (data) {
        displayArticles(data);
    });

    function displayArticles(data) {
        for (let i = 0; i < 5; i++) {
            const headlineCard = `<div class="headlineCard">
            <a href="${data[i].link}">
            <h2>${data[i].headline}</h2></a>
            <p>${data[i].summary}</p>
            <button id="viewPosts">VIEW COMMENTS (${data[i].posts.length})</button><button value="${data[i]._id}" id="newPost">NEW COMMENT</button></div>`
            $("#content").append(headlineCard);
        }
    };

    $(document).on("click", "#newPost", function (event) {
        event.preventDefault();
        var articleId = $(this).val();

        $.post("/articles/" + articleId, { title: "What", body: "I'm confused." });
    });

});