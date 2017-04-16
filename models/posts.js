const Mongo = require('mongodb');
const Assert = require('Assert');
const AutoIncrement = require('mongodb-autoincrement');

const mongoUrl = 'mongodb://localhost:27017/test';

module.exports = {
    /**
     * Get all posts from the blog
     * @param callback
     */
    getAllPosts: function (callback) {
        var postsData = [];
        Mongo.connect(mongoUrl, function (err, db) {
            Assert.equal(null, err);
            let cursor = db.collection('posts').find({});
            cursor.forEach(function (doc, err) {
                Assert.equal(null, err);
                postsData.push(doc);
            }, function () {
                db.close();
                callback(postsData);
            });
        });
    },

    /**
     * Get data about one, specific post
     * @param {number} postId
     */
    getSinglePost: function (postId) {
        var postData = [];
        Mongo.connect(mongoUrl, function (err, db) {
            Assert.equal(null, err);
            let cursor = db.collection('posts').find({postId: postId});
            cursor.forEach(function (doc, err) {
                Assert.equal(null, err);
                postData.push(doc);
            }, function () {
                db.close();
                return postData;
            });
        });
    },

    /**
     *Add new post
     * @param {string} date
     * @param {string} author
     * @param {string} title
     * @param {string} content
     * @param {string} tags
     * @param {callback} callback
     */

    addPost: function (date, author, title, content, tags, callback) {
        Mongo.connect(mongoUrl, function (err, db) {
            Assert.equal(null, err);
            AutoIncrement.getNextSequence(db, 'posts', function(err, autoIndex){
                Assert.equal(err);
                let postData = {
                    postID: autoIndex,
                    date: date,
                    author: author,
                    title: title,
                    content: content,
                    tags: tags
                };
                db.collection('posts').insertOne(postData, function (err, result) {
                    Assert.equal(null, err);
                    console.log('Post inserted!');
                });
                db.close();
                callback();
            });
        });
    },

    /**
     * Replace specific post with new data
     * @param {number} postID
     * @param {string} date
     * @param {string} author
     * @param {string} title
     * @param {string} content
     * @param {string} tags
     */
    editPost: function (postID, date, author, title, content, tags) {
        var postData = {
            postID: postID,
            date: date,
            author: author,
            title: title,
            content: content,
            tags: tags
        };

        Mongo.connect(mongoUrl, function (err, db) {
            Assert.equal(null, err);
            db.collection('posts').updateOne({'postID': postID}, postData, function (err, result) {
                Assert.equal(null, err);
                console.log('Post updated!');
            });
            db.close();
        });
    },

    removePost: function () {
        
    }
};