const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

User.init(
{
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true

    },
    // define a username column 
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data throuhg validators before creating the tabel data
        validate: {
            isEmail: true
        }
    },
    // define a password column 
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // this means the password must be at least four characters long
            len: [4]
        }
    }
},

{ // SECOND OBJECT // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))
    
    //we can use special Sequelize functions called hooks in the model. Also known as lifecycle events, hooks are functions that are called before or after calls in Sequelize.
    // In our case, we need a hook that will fire just before a new instance of User is created
    hooks: {
        // set up beofreCreate lifecycle "hook" funtionality
        //We use the beforeCreate() hook to execute the bcrypt hash function on the plaintext password
       // set up beforeCreate lifecycle "hook" functionality
       //The async keyword is used as a prefix to the function that contains the asynchronous function. await can be used to prefix the async function, which will then gracefully assign the value(aka encrypted password) from the response to the newUserData's password property. The newUserData is then returned to the application with the hashed password.
       // in summary... . We used a new package, bcrypt, to hash the password and used a hook to hash the password just before it was saved to the database
       // the 10 refers to the number of times we want to hash the password 
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        }, 
        // set up beforeUpdate lifecycle "hook" functionality
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }

       
    },
    

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
}
);

module.exports = User;