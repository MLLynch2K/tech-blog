//include packages and models that we'll need to create the Express.js API endpoints


const router = require('express').Router();
const sequelize = require('../../config/connection');

// authguard middleware to all non GET routes
// with this function we are chekcing to see if the user exists in our database (meaning that they logginIn and have a user_id)
const withAuth = require('../../utils/auth');

// this will grab the /models.index.js by default 
// we need to require Post and User models 
//In a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model
const {Post, User, Comment} = require('../../models/Index.js');

// get all posts
// GET /api/posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
      // Query configuration
      // attributes specifies which coloumns in the Post modale we want to select (created_at is given to us by sequelize)
      // next we'll include the JOIN to the User table. We do this by adding the property include, as shown in the following code... this property takes in an array so that if we needed to we could join information from multiple tables aka make mulitple JOIN statements
      attributes: ['id', 'blog_text','title', 'created_at'],
      // order by post recent posts
      order: [['created_at', 'DESC']],
      include: [
           // include the Comment model here:
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
              model: User,
              attributes: ['username']
          }
      ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
  
});

//GET /api/posts/:id
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'blog_text', 'title', 'created_at'],
      include: [
        // include the Comment model here:
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// POST /api/posts
// when we use withAuth router.post('/', withAuth,(req, res) => {
router.post('/', withAuth,(req, res) => {
    // expects {title: 'some blog title', blog_text:' fjds fjdksla fdjska ', user_id: from request body}
    Post.create({
      title: req.body.title,
      blog_text: req.body.blog_text,
      // originally we passed in the user Id from insomnia to test his routes... now this request is being made from a front-end form.
      //user_id: req.body.user_id
      //The user wiil not know their id, but we can get the id from the session
      user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
 });

//UPDATE /api/posts/:id
// when we authenticat ...router.put('/:id', withAuth, (req, res) => {
router.put('/:id',withAuth,(req, res) => {
    Post.update(
      {
        title: req.body.title,
        blog_text: req.body.blog_text
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


//DELETE /api/posts/:id
// when we authenticat ...router.delete('/:id', withAuth, (req, res) => {
router.delete('/:id',withAuth,(req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


module.exports = router;