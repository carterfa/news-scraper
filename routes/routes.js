var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");


module.exports = function (app) {

    //Home Page
    app.get("/", function (req, res) {
        res.send("Hello");
    });

    //Grabs all articles from the database
    app.get("/all", function (req, res) {

        db.Article.find({})
            .then(function (dbArticle) {

                res.json(dbArticle);
            })
            .catch(function (err) {

                res.json(err);
            });

    });

    //Grabs headlines from AP News
    app.get("/scrape", function (req, res) {
        axios.get("https://apnews.com/apf-topnews").then(function (response) {

            var $ = cheerio.load(response.data);

            //Goes to each card; grabs headline and link
            $("div.CardHeadline").each(function (i, element) {
                let headline = $(element).find("h1").text();
                let link = $(element).find("a").attr("href");
                let date = new Date($(element).find("span.Timestamp").data("source"));

                if (link === undefined) {
                    link = "https://apnews.com";
                } else {
                    link = "https://apnews.com" + $(element).find("a").attr("href");
                }

                let result = {
                    "headline": headline,
                    "link": link,
                    "date": date
                };

                //Creates new article
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // Display article
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        // Error
                        console.log(err);
                    });
            });

            res.send("Scrape complete.")

        }).catch(function (err) {
            res.send(err);
        });

    });

};