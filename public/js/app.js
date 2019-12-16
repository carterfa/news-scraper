$(document).ready(function () {

    let articleId = "";

    //Get articles from database
    function getArticleData() {
        $.get("/api/articles", function (data) {
            displayArticles(data);
        });
    }

    //Get favorites from database
    function getFaveData() {
        $.get("/api/articles/saved", function (data) {
            displayArticles(data);
        });
    }

    //Display articles
    function displayArticles(data) {
        $("#content").empty();
        for (let i = 0; i < data.length; i++) {

            let faveBtn = "";

            if (!data[i].favorite) {
                faveBtn = `<button value="${data[i]._id}" class="btn btn-warning faveArticle">SAVE</button>`;
            }
            else {
                faveBtn = `<button value="${data[i]._id}" class="btn btn-warning faveArticle">REMOVE FROM SAVED</button>`;
            }

            const headlineCard = `<div class="row headlineCard">
            <a href="${data[i].link}">
            <h3 id="head-${data[i]._id}">${data[i].headline}</h3></a>
            <p>${data[i].summary}</p>
            <div class="btnrow"><button value="${data[i]._id}" class="btn btn-secondary viewPosts" >VIEW COMMENTS (${data[i].posts.length})</button>
            <button value="${data[i]._id}" class="btn btn-success newPost">POST COMMENT</button>
            ${faveBtn}</div>
            </div>`
            $("#content").append(headlineCard);


        };

    };

    //Displays all posts associated with article
    function displayPosts(articleId) {

        $("#postContent").empty();
        $("#postView").show();
        $("#postViewTitle").text($("#head-" + articleId).text());

        //Runs get route
        $.get("/api/articles/" + articleId, function (data) {

            let xPost = data[0].posts;
            if (!xPost.length) {
                const postCard = `<div class="postCard"><h6>No comments have been posted.</h6>`
                $("#postContent").append(postCard);
            } else {
                for (let i = 0; i < xPost.length; i++) {
                    const postCard =
                        `<div class="postCard" id="post-${xPost[i]._id}"><h6>${xPost[i].title}</h6>
                    <p>${xPost[i].body}</p><button value="${xPost[i]._id}" class="btn btn-danger deletePost">DELETE POST</button></div>`
                    $("#postContent").append(postCard);
                }

            };
        });

    }

    //Grabs article id and displays submission form
    $(document).on("click", ".newPost", function (event) {
        event.preventDefault();
        articleId = $(this).val();
        $("#postFormTitle").text($("#head-" + articleId).text());
        $("#postForm").show();

    });

    //Displays posts from specific article
    $(document).on("click", ".viewPosts", function (event) {
        event.preventDefault();
        articleId = $(this).val();
        displayPosts(articleId);

    });

    //Deletes single post
    $(document).on("click", ".deletePost", function (event) {
        event.preventDefault();
        let postId = $(this).val();
        console.log(postId);

        $.ajax({
            url: '/api/posts',
            type: 'PUT',
            data: {
                articleId: articleId,
                postId: postId
            }
        }).then(function (data, err) {
            if (err) throw err;
        });

        $("#post-" + postId).remove();
        getArticleData();

    })

    //Favorites article
    $(document).on("click", ".faveArticle", function (event) {
        event.preventDefault();
        articleId = $(this).val();
        let state = true;

        if ($(this).text() === "REMOVE FROM SAVED") {
            state = false;
            $(this).text("SAVE")
        } else {
            $(this).text("REMOVE FROM SAVED")
        }

        $.ajax({
            url: '/api/articles/' + articleId,
            type: 'PUT',
            data: { favorite: state }
        }).then(function (data, err) {
            if (err) throw err;
        });



    });

    //Adds post to article
    $("#submitPost").on("click", function (event) {
        event.preventDefault();
        if ($("#postTitle").val() && $("#postBody").val()) {
            $.post("/api/articles/" + articleId, { title: $("#postTitle").val(), body: $("#postBody").val() });
            $("#postForm").hide();
            getArticleData();
        }
    })

    //Grabs new articles
    $("#scrape").on("click", function (event) {
        event.preventDefault();

        $.get("/api/scrape", function (data) {

        }).then(function (err) {
            if (err) throw err;
            getArticleData();
        });

    })

    //Deletes all articles and posts
    $("#deleteAll").on("click", function (event) {
        event.preventDefault();
        $.ajax({
            url: '/api/articles',
            type: 'DELETE',
        }).then(function (err) {
            if (err) throw err;
            $("#content").empty();
        });

    })

    //Filters favorite articles
    $("#faveAll").on("click", function (event) {
        event.preventDefault();

        if ($(this).text() === "SHOW SAVED ARTICLES") {
            getFaveData();
            $(this).text("SHOW ALL ARTICLES")
        } else {
            $(this).text("SHOW SAVED ARTICLES")
            getArticleData();
        }


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