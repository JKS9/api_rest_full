const usersController = require('../controller/users');
const postsController = require('../controller/posts');

module.exports = (app) => {
  app.route('/').get(postsController.getAllPosts);
  app.route('/').post(postsController.addposts);
  app.route('/:id').get(postsController.getOne);
  app.route('/delete/:id').delete(postsController.deletePost);
  app.route('/edit/:id').put(postsController.editPosts);

  app.route('/user/:id').get(usersController.getStatus);
  app.route('/login').post(usersController.loginAuth);
  app.route('/signup').post(usersController.registerUser);
  app.route('/status/:id').post(usersController.updateStatus);

  app.use((req, res) => {
    res.status(404).json({url: req.originalUrl, error: 'not found'});
  });
};