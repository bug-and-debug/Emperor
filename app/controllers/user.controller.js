'use strict';

const express = require('express');
const router = express.Router();
const UserModel = require('../models/user.model');
const ErrorHelper = require('../helpers/error-helper');
const config = require('../config');
const utils = require('../helpers/common.helper')
const _ = require('lodash')
const randomize = require('randomatic');

const index = async function(req, res) {
  try {
    let users = await UserModel.find().exec();
    res.send(users);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const get = async function(req, res) {
  try {
    let user = await UserModel.findById(req.params.id).exec();
    if (user == null) throw new Error('USER_ID_NOT_FOUND');
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const create = async function(req, res) {
  let params = req.body
  let email = params['email']
  let password = params['password']
  if (email === undefined)
    res.status(400).send({msg: 'email is required'})
  if (password === undefined)
    res.status(400).send({msg: 'password is required'})
  if (!utils.validateEmail(email))
    res.status(400).send({msg: 'invalid email'})
  if (!utils.validatePassword(password))
    res.status(400).send({msg: 'invalid password'})
  try {
    let verifyLink = randomize('Aa0', 20)
    let user = new UserModel({
                              email: email,
                              password: password,
                              referralCode: randomize('0', 6),
                              verifyLink: verifyLink
                            });
    await user.save();
    await utils.sendEmail({
                            recipe: email,
                            subject: 'Email Verification',
                            content: '<h2>Welcome to EMPEROR</h2>\
                                      Please click the below link to verify your email.<br>' +
                                      config.serverUrl + 'verify/email/' + verifyLink
                          })
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const update = async function(req, res) {
  try {
    await UserModel.update({_id: req.params.id}, req.body).exec();
    let user = await UserModel.findById(req.params.id).exec();
    if (user == null) throw new Error('USER_ID_NOT_FOUND');
    user.update(req.body)
    await user.save();
    user = await UserModel.findById(req.params.id).exec();
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

const destroy = async function(req, res) {
  try {
    await UserModel.deleteOne({_id: req.params.id});
    res.send(true);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
}

const verifyEmail = async function(req, res) {
  let verifyLink = req.params.link;
  let user = await UserModel.findOne({verifyLink: verifyLink}).exec()
  if (user == null) throw new Error('USER_ID_NOT_FOUND')
  user.verifyEmail();
  await user.save();
  res.send('ok');
}

const resendEmail = async function(req, res) {
  let userId = req.params.id
  let newVerifyLink = randomize('Aa0', 20)
  try {
    let user = await UserModel.findById(userId).exec()
    if (user == null) throw new Error('USER_DOES_NOT_EXIST')
    user.update({verifyLink: newVerifyLink})
    await user.save()
    await utils.sendEmail({
                            recipe: user.email,
                            subject: 'Email Verification',
                            content: '<h2>Welcome to EMPEROR</h2>\
                                      Please click the below link to verify your email.<br>' +
                                     'http://localhost:4000/verify/email/' + newVerifyLink
                          })
    res.send(user);
  } catch (err) {
    ErrorHelper.handleError(res, err, 400)
  }
}

const login = async function(req, res) {
  try {
    console.log(process.env.NODE_ENV)
    let email = req.body.email;
    let password = req.body.password;
    let user = await UserModel.findOne({ email: email, password: password }).exec();

    if(user == null) {
      res.status(400).send({msg: 'Invalid Information'})
    }
    res.send(user);
  }
  catch(err) {
    ErrorHelper.handleError(res, err, 400);
  }
};

// routes
router.get('/', index);
router.get('/:id', get);
router.get('/email/:link', verifyEmail);
router.get('/resendEmail/:id', resendEmail);
router.post('/', create);
router.post('/login', login);
router.put('/:id',  update);
router.delete('/:id', destroy);

module.exports = router;
