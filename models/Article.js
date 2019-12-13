//Article model

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

    headline: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },

    summary: {
        type: String,
        trim: true,
    },

    link: {
        type: String,
        trim: true,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now
    },

    favorite: {
        type: Boolean,
        default: false
    },

    //Creates relationship with posts
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;