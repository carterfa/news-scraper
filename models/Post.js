//Post model

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostSchema = new Schema({

    title: String,

    body: String,

    date: {
        type: Date,
        default: Date.now
    }

});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
