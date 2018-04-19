'use strict';

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const ErrorHelper = require('../helpers/error-helper');
const authMiddleware = require('../middlewares/auth.middleware');

const login = async function(req, res) {
  try {
    let info = req.body;
    let user = await UserModel.findOne().where('socialConnects').elemMatch({ provider: info.provider, id: info.id });

    if(user == null) {
      user = new UserModel({
        name: info.name,
        alias: info.email.substring(0, info.email.lastIndexOf("@")),
        email: info.email,
        photo: info.photoUrl,
        location: info.location,
        socialConnects: [info]
      });
      await user.save();
    }
    else {
    }

    req.session.login_user_id = user._id;
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const logout = async function(req, res) {
  try {
    req.user = null;
    req.session.login_user_id = null;
    res.send(true);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

// routes
router.post('/login', login);
router.get('/logout', authMiddleware.authorization, logout);

module.exports = router;
