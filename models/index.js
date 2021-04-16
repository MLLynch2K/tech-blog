//This file is responsible for importing the models and exporting objects with the new properties/ relationships that we define with dot notation

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// CREATE ASSOCIATIONS/ define relationships between the models/tables...


//This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

//We also need to make the reverse association by adding the following statement
//In this statement, we are defining the relationship of the Post model to the User. The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model

Post.belongsTo(User, {
    foreignKey: 'user_id',
});


// Comment associations ...
// all of these are one-to-many relationships (defining both sides)
//Note that we don't have to specify Comment as a through table like we would for a Vote or a like... This is because we don't need to access Post through Comment as we would need to access post through a like or a vote; we just want to see the user's comment and which post it was for

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Comment, {
    // so here we are saying that the comments should have a foreign key 'user_id' that references the user 'id'
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    // here we are saying that the comments should also have a foreign key 'post_id' that references the post 'id' so we know which post the comment is attached to
    foreignKey: 'post_id',
    // trying to set it up so that when partent is deleted comments are deleted but not working?
    onDelete: 'CASCADE'
});


// now we exports these objects that know have new properties attached to them (aka the relationship and association we made)
module.exports = { User, Post, Comment };