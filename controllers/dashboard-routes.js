const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models/Index.js');


const withAuth = require('../utils/auth')
// making routes that render dashboard content
// homeroutes were to render homepage content 

// GET /dashbord 
router.get('/', (req, res) => {
    //We'll hardcode the loggedIn property as true on this route, because a user won't even be able to get to the dashboard page unless they're logged in
    // on the dashboard page I only want to render blog posts that the user created so I can say findAll where id: req.session.user_id
    //Because the dashboard should only display posts created by the logged in user, you can add a where object to the findAll() query that uses the id saved on the session. You'll also need to serialize the Sequelize data before sending it to the template
    Post.findAll({
        where: {
          // use the ID from the session
          user_id: req.session.user_id
        },
        attributes: [
          'id',
          'blog_text',
          'title',
          'created_at'
        ],
        include: [
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
        .then(dbPostData => {
          // serialize data before passing to template
          const posts = dbPostData.map(post => post.get({ plain: true }));
          res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});

//GET /dashboard/edit/:id
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
    
      where: {
        id: req.params.id
      },  
      attributes: [
        'id',
        'blog_text',
        'title',
        'created_at'
      ],
      include: [
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
      .then(dbPostData => {
        if (dbPostData) {
        // serialize the data then pass it to render as an object  
          const post = dbPostData.get({ plain: true });
          
          res.render('edit-post', {
            post,
            loggedIn: true
          });
        } else {
          res.status(404).end();
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
});



module.exports = router;