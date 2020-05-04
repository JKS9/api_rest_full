const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const users = require('../models/users');
const UserModel = mongoose.model('users', users);

const posts = require('../models/posts');
const PostsModel = mongoose.model('posts', posts);

const usersController = {
  getAllPosts: (req, res) => {
    console.log(req.headers['x-access-token'])
    if (req.headers['x-access-token'] != null) {
      jwt.verify(req.headers['x-access-token'], '1234', function(err, decoded) {
        if(err) {
          res.status(400).json('token invalid' || {})
          return
        }
        decodeid = decoded.userId;
      });

      PostsModel.find({}, (err, posts) => {
        if (posts.length != 0) { 
          return res.status(200).json({posts});
        } else {
          return res.status(400).json('aucun poste');
        }
      });
    } else {
      return res.status(400).json('token invalide');
    }
  },
  getOne: (req, res) => {
    if (req.headers['x-access-token'] != null) {
      jwt.verify(req.headers['x-access-token'], '1234', function(err, decoded) {
        if(err) {
          res.status(400).json('token invalid' || {})
          return
        }
        decodeid = decoded.userId;
      });

      PostsModel.findById(req.params.id, (err, posts) => {
        if (err) {
          return res.status(500).json('poste erreur');
        }
        if (posts.length != 0) { 
          return res.status(200).json({posts});
        } else {
          return res.status(400).json('poste introubable');
        }
      });
    } else {
      return res.status(400).json('token invalide');
    }
  },
  deletePost: (req, res) => {
    if (req.headers['x-access-token'] != null) {
      jwt.verify(req.headers['x-access-token'], '1234', function(err, decoded) {
        if(err) {
          res.status(400).json('token invalid' || {})
          return
        }
        decodeid = decoded.userId;
      });
      PostsModel.findById(req.params.id, (err, posts) => {
        if (!posts) {
          res.status(400).json('poste introuvable' || {})
          return
        } else {
          if (posts.creator.id === decodeid) {
            PostsModel.deleteOne({_id: req.params.id}, (err, posts) => {
              return res.status(200).json({posts});
            }).catch(err => {
              return res.status(402).json({err});
            })
          } else {
            res.status(400).json('you dont have permission')
          return
          }
        }
      })
    } else {
      res.status(400).json('token invalid')
    }
  },
  addposts: (req, res) => {
    const postsModel = new PostsModel(req.body)
    postsModel.save().then(post => {
      return res.status(200).json({posts});
    }).catch(err => {
      return res.status(402).json({err});
    })
  },
  editPosts: (req, res) => {
    PostsModel.findOneAndUpdate({_id: req.params.id}, req.body).then(user => {
      res.status(200).json(user || {})
    }).catch(err => {
      res.status(500).json({
        code: 500,
        message: err
      })
    })
  }
};

module.exports = usersController;