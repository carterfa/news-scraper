$(document).ready(function () {

    let articleId = "";

    //Get articles from database
    function getArticleData() {
        $.get("/articles", function (data) {
            displayArticles(data);
        });
    }

    //Display articles
    function displayArticles(data) {
        $("#content").empty();
        for (let i = 0; i < data.length; i++) {
            const headlineCard = `<div class="headlineCard">
            <a href="${data[i].link}">
            <h2>${data[i].headline}</h2></a>
            <p>${data[i].summary}</p>
            <button value="${data[i]._id}" class="viewPosts" >VIEW COMMENTS (${data[i].posts.length})</button>
            <button value="${data[i]._id}" class="newPost">POST COMMENT</button>
            <button value="${data[i]._id}" class="faveArticle">FAVORITE</button>
            </div>`
            $("#content").append(headlineCard);
        }
    };

    //Grabs article id and displays submission form
    $(document).on("click", ".newPost", function (event) {
        event.preventDefault();
        articleId = $(this).val();

        $("#postForm").show();

    });

    //Displays posts from specific article
    $(document).on("click", ".viewPosts", function (event) {
        event.preventDefault();
        articleId = $(this).val();
        $("#postContent").empty();
        $("#postView").show();

        //Runs get route
        $.get("/articles/" + articleId, function (data) {
            if (!data[0].posts.length) {
                const postCard = `<div class="postCard"><h2>No comments have been posted.</h2>`
                $("#postContent").append(postCard);
            } else {
                for (let i = 0; i < data[0].posts.length; i++) {
                    const postCard =
                        `<div class="postCard"><h2>${data[0].posts[i].title}</h2>
                    <p>${data[0].posts[i].body}</p></div>`
                    $("#postContent").append(postCard);
                }

            };
        });

    });

    //Adds post to article
    $("#submitPost").on("click", function (event) {
        event.preventDefault();
        $.post("/articles/" + articleId, { title: $("#postTitle").val(), body: $("#postBody").val() });
        $("#postForm").hide();
        getArticleData();
    })

    //Grabs new articles
    $("#scrape").on("click", function (event) {
        event.preventDefault();
        $.get("/scrape", function (data) {

        }).then(function (err) {
            if (err) throw err;
            getArticleData();
        });

    })

    //Deletes all articles and posts
    $("#deleteAll").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: '/articles',
            type: 'DELETE',
        }).then(function (err) {
            if (err) throw err;
            $("#content").empty();
        });

    })

    //Closes post view
    $("#closePostView").on("click", function (event) {
        event.preventDefault();
        $("#postView").hide();

    })

    //Closes post form
    $("#closePostForm").on("click", function (event) {
        event.preventDefault();
        $("#postForm").hide();

    })

    getArticleData();
    $("#postForm").hide();
    $("#postView").hide();

});