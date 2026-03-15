var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

router.get('/', async function(req, res, next) {
  try {
    let result = await userModel.find({
      isDeleted: false
    }).populate('role');
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post('/enable', async function(req, res, next) {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).send({ message: "email va username la bat buoc" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: true },
      { new: true }
    ).populate('role');

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(404).send({ message: "Thong tin khong dung hoac user da bi xoa mem" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post('/disable', async function(req, res, next) {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).send({ message: "email va username la bat buoc" });
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email, username: username, isDeleted: false },
      { status: false },
      { new: true }
    ).populate('role');

    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(404).send({ message: "Thong tin khong dung hoac user da bi xoa mem" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({
      _id: id,
      isDeleted: false
    }).populate('role');

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      status: req.body.status !== undefined ? req.body.status : false,
      role: req.body.role,
      loginCount: req.body.loginCount
    });

    await newUser.save();

    let result = await userModel.findById(newUser._id).populate('role');
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await userModel.findOneAndUpdate({
      _id: id,
      isDeleted: false
    }, req.body, {
      new: true
    }).populate('role');

    if (updatedItem) {
      res.send(updatedItem);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let deletedItem = await userModel.findOneAndUpdate({
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
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;