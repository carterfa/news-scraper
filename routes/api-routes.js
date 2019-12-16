var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");


module.exports = function (app) {

    //Grabs all articles from the database
    app.get("/api/articles", function (req, res) {

        db.Article.find({}).sort({ date: -1 })
            .then(function (dbArticle) {

                res.json(dbArticle);
            })
            .catch(function (err) {

                res.json(err);
            });

    });

    //Grabs all favorites from the database
    app.get("/api/articles/saved", function (req, res) {

        db.Article.find({ favorite: true }).sort({ date: -1 })
            .then(function (dbArticle) {

                res.json(dbArticle);
            })
            .catch(function (err) {

                res.json(err);
            });

    });

    //Displays single article with posts
    app.get("/api/articles/:id", function (req, res) {
        db.Article.find({ _id: req.params.id })
            .populate("posts")
            .then(function (dbArticle) {

                res.json(dbArticle);
            })
            .catch(function (err) {

                res.json(err);
            });
    });

    // Adds new post to article
    app.post("/api/articles/:id", function (req, res) {
        console.log(req.body)
        db.Post.create(req.body)
            .then(function (dbPost) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { posts: dbPost._id } }, { new: true });
            })
            .then(function (dbArticle) {

                res.json(dbArticle);
            })
            .catch(function (err) {

                res.json(err);
            });
    });


    // Toggles favorite state
    app.put("/api/articles/:id", function (req, res) {

        //console.log(req.body);
        db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
            .then(function (dbArticle) {

                res.json(dbArticle);

            })
            .catch(function (err) {

                res.json(err);
            });
    });

    //Grabs headlines from AP News
    app.get("/api/scrape", function (req, res) {
        axios.get("https://apnews.com/apf-topnews").then(function (response) {

            var $ = cheerio.load(response.data);

            //Goes to each card; grabs headline, summary, and link
            $("div.FeedCard").each(function (i, element) {
                let headline = $(element).find("h1").text();
                let summary = $(element).find("div.content").text();
                let link = $(element).find("a").attr("href");
                let date = new Date($(element).find("span.Timestamp").data("source"));

                if (link === undefined) {
                    link = "https://apnews.com";
                } else {
                    link = "https://apnews.com" + $(element).find("a").attr("href");
                }

                let result = {
                    "headline": headline,
                    "summary": summary,
                    "link": link,
                    "date": date
                };

                //console.log(result);

                //Creates new article
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // Display article
                        //console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // Error
                        console.log(err);
                    });
            });

            res.end();

        }).catch(function (err) {
            res.send(err);
        });

    });

    //Delete specific post
    app.put("/api/posts", function (req, res) {

        //console.log(req.body.postId);
        //console.log(req.body.articleId);

        db.Article.findOneAndUpdate({ _id: req.body.articleId }, { $pull: { posts: req.body.postId } }, { new: true })
            .then(function () {

                db.Post.deleteOne({ _id: req.body.postId })
                    .then(function () {

                        res.end();
                    })
                    .catch(function (err) {

                        res.json(err);
                    });

            })
            .catch(function (err) {

                res.json(err);
            });


    })


    //Deletes all articles and posts from the database
    app.delete("/api/articles", function (req, res) {

        db.Article.deleteMany({})
            .then(function () {

                db.Post.deleteMany({})
                    .then(function () {

                        res.end();
                    })
                    .catch(function (err) {

                        res.json(err);
                    });
            })
            .catch(function (err) {

                res.json(err);
            });

    });



};