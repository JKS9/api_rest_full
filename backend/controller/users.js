const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const users = require('../models/users');
const UserModel = mongoose.model('users', users);

const usersController = {
  loginAuth: (req, res) => {
    UserModel.findOne({email: req.body.email, password: req.body.password}, '_id name', (err, user) => {
      if(!user) {
        return res.status(401).json({error: 'authentication failed'});
      }

      const payload = {
        userId: user.id
      }

      const option = {
        expiresIn: '7d'
      }
      jwt.sign(payload,'1234', option,(err, token) => {
        return res.status(200).json({
          token: token,
          userId: user._id,
          name: user.name
        });
      })
    });
  },
  registerUser: (req, res) => {
    UserModel.findOne({ email: req.body.email }).then(user => {
      if (user.lenght < 0) {
        const userModel = new UserModel(req.body)
        userModel.save().then(event => {
          res.status(200).json(event || {})
        }).catch(err => {
          res.status(500).json({
            code: 500,
            message: err
          })
        })
      } else {
        res.status(402).json({
          code: 402
        })
      }
    })
  },
  updateStatus: (req, res) => {
    console.log(req.body.token)
    const bodyUpdate = {
      "status": req.body.status
    }
    let decodeid = "";
    jwt.verify(req.body.token, '1234', function(err, decoded) {
      if(err) {
        res.status(400).json('token invalid' || {})
        return
      }
      decodeid = decoded.userId
    });
    if (decodeid === req.params.id) {
      UserModel.findOneAndUpdate({_id: req.params.id}, bodyUpdate).then(user => {
        res.status(200).json(user || {})
        return
      }).catch(err => {
        res.status(500).json({
          code: 500,
          message: err
        })
        return
      })
    } else {
      res.status(200).json('vous n avez pas la permission' || {})
      return
    }

    
  },
  getStatus: (req, res) => {
    if (req.headers['x-access-token'] != null) {
      jwt.verify(req.headers['x-access-token'], '1234', function(err, decoded) {
        if(err) {
          res.status(400).json('token invalid' || {})
          return
        }
        decodeid = decoded.userId;
      });
      UserModel.findById(req.params.id, 'status', (err, user) => {
        if (err) {
          return res.status(200).json('status introuvable')
        }
        if (!user) {
          return res.status(200).json('status introuvable')
        }
        
        res.status(200).json(user || {})
      }).catch(err => {
        res.status(500).json({
          code: 500,
          message: err
        })
      })
    } else {
      res.status(400).json('token invalid')
    }
  }
};

module.exports = usersController;