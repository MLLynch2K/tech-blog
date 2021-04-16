

//we'll import the elements that we'll need to build the Post model. This will include the connection to MySQL we stored in the connection.js file as well as Model and Datatypes we'll use from the sequelize package.
const {Model, DataTypes} = require('sequelize');

// we need to connect to the database through our config/connection file 
const sequelize = require('../config/connection');


// create our Post Model 

// create our Post model
class Post extends Model {}


// Now we will define the columns in the Post, configure the naming conventions, and pass the current connection instance to initialize the Post model. To do this, add the following code:

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blog_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        //this column determines who posted the news article. Using the references property, we establish the relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key. The user_id is conversely defined as the foreign key (in the index folder where we made our associations and relationships) and will be the matching link between the user and the post
        user_id: {
            type: DataTypes.INTEGER,
            // here we are saying the the user_id should reference the 'id' of the 'user' aka primary key
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    { 
        // In the second parameter of the init method, we configure the metadata, including the naming conventions
        //// sequelize will give us timestamps if we don't turn them to false... we want timestamps for posts so we won't turn them off
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName:'post'
    }
);


//Lastly, we must include the export expression to make the Post model accessible to other parts of the application
module.exports = Post;

//Before we can use the Post model, we need to require it in models/index.js (where is will get the properties for associations and relationships) and export it there