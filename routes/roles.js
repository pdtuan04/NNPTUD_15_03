var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

router.get('/', async function(req, res, next) {
  try {
    let result = await roleModel.find({
      isDeleted: false
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id/users', async function(req, res, next) {
  try {
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Role id khong hop le" });
    }

    let role = await roleModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (!role) {
      return res.status(404).send({ message: "Role not found" });
    }

    let users = await userModel.find({
      role: id,
      isDeleted: false
    }).populate('role');

    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await roleModel.findOne({
      _id: id,
      isDeleted: false
    });

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "Role not found" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newRole = new roleModel({
      name: req.body.name,
      description: req.body.description
    });
    await newRole.save();
    res.send(newRole);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findOneAndUpdate({
      _id: id,
      isDeleted: false
    }, req.body, {
      new: true
    });

    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "Role not found" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let deletedItem = await roleModel.findOneAndUpdate({
      _id: id,
      isDeleted: false
    }, {
      isDeleted: true
    }, {
      new: true
    });

    if (deletedItem) {
      res.send(deletedItem);
    } else {
      res.status(404).send({ message: "Role not found" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;