//This file will contain all of the user-facing routes that render templates and display data (such as the homepage and login page/ sign up page)

// have to connect to the database anytime we are making queries 
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models/Index.js');


const router = require('express').Router();


//Previously, we used res.send() or res.sendFile() for the response. Because we've hooked up a template engine, we can now use res.render() and specify which template we want to use. In this case, we want to render the homepage.handlebars template (the .handlebars extension is implied). This template was light on content; it only included a single <div>. Handlebars.js will automatically feed that into the main.handlebars template, however, and respond with a complete HTML file.
// so if you navigate to http://localhost:3001 the homepage should be rendered 
//GET /
router.get('/', (req, res) => {
    console.log(req.session)
    
    Post.findAll({
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
            console.log(dbPostData)
        //The res.render() method can accept a second argument, an object, which includes all of the data you want to pass to your template.
        // dbPostData is an array of objects
        // pass a single post object into the homepage template to see if it works 
        //The data that Sequelize returns is actually a Sequelize object with a lot more information attached to it than you might have been expecting. To serialize the object down to only the properties you need, you can use Sequelize's get() method .get({ plain: true }));
        //You didn't need to serialize data before when you built API routes, because the res.json() method automatically does that for you
        // when you res.render the data it is not serialized and returns a bunch of other information you don't need 
        // we need to serialize all the post going through so it woulg be a good idea to loop through array of dbPostData and take care of that before we send the info to get rendered 
        //res.render('homepage', dbPostData.get[0]({ plain: true }));
        //// this statement will loop through each post in the array and serialize it, but o send that to get rendered we need to save the new array in a variable 
        //dbPostData.map(post => post.get({ plain: true}));
        const posts = dbPostData.map(post => post.get({ plain: true }));
        //However, even though the render() method can accept an array instead of an object, that would prevent us from adding other properties to the template later on. To avoid future headaches, we can simply add the array to an object and continue passing an object to the template.
        // esentially we passing in post:post and using object detructuring to pass post
        // so the key is posts and the value is the serialized posts array 
        // now we need to set up the handlebars homepage template to loop through the arrray because right now it is only set up to render one single post (one title, one username, one data etc.) 
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
    });
});

router.get('/posts/:id', (req, res) => {


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
      console.log(dbPostData)
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      // here we are rendering the single-post handlebar template and passing the post object and logginIn  data as an object with the key loggedIn: and the value of req.seesion.logginIn (this value is eather going to be true or false)
      res.render('single-blog', { post, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
    // when the user navigates to the homepage by clicking the nav link... we will check to see if they are already logginIn. If they are we will redirect them to the homepage instead of taking them to the login page
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    //Our login page doesn't need any variables, so we don't need to pass a second argument to the render() method.
    //What's different about this render() from last time? Our login page doesn't need any variables, so we don't need to pass a second argument to the render() method
    res.render('login')
});

router.get('/signup', (req, res) => {
    
    //What's different about this render() from last time? Our login page doesn't need any variables, so we don't need to pass a second argument to the render() method
    res.render('signup')
});

module.exports = router;