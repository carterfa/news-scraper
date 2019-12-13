$(document).ready(function () {

    let articleId = "";

    //Get articles from database
    function getArticleData() {
        $.get("/articles", function (data) {
            displayArticles(data);
        });
    }

    //Get favorites from database
    function getFaveData() {
        $.get("/articles/saved", function (data) {
            displayArticles(data);
        });
    }

    //Display articles
    function displayArticles(data) {
        $("#content").empty();
        for (let i = 0; i < 10; i++) {

            let faveBtn = "";

            if (!data[i].favorite) {
                faveBtn = `<button value="${data[i]._id}" class="btn btn-warning faveArticle">SAVE</button>`;
            }
            else {
                faveBtn = `<button value="${data[i]._id}" class="btn btn-warning faveArticle">REMOVE FROM SAVED</button>`;
            }

            const headlineCard = `<div class="headlineCard">
            <a href="${data[i].link}">
            <h2>${data[i].headline}</h2></a>
            <p>${data[i].summary}</p>
            <button value="${data[i]._id}" class="btn btn-secondary viewPosts" >VIEW COMMENTS (${data[i].posts.length})</button>
            <button value="${data[i]._id}" class="btn btn-success newPost">POST COMMENT</button>
            ${faveBtn}
            </div>`
            $("#content").append(headlineCard);


        };

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
            url: '/articles/' + articleId,
            type: 'PUT',
            data: { favorite: state }
        }).then(function (data, err) {
            if (err) throw err;
            alert("End");
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
        $(this).text("SHOW SAVED ARTICLES");
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