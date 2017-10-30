var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://root:567234@ds121965.mlab.com:21965/it651';

module.exports.getUsers = function (req, res) {
  mongoClient
    .connect(url, function (err, db) {
      db
        .collection('users')
        .find()
        .toArray(function (err, results) {
          db.close();
          res.json(results);
        })
    })
}

module.exports.getUser = function (req, res) {
  let id = req.params.id;
  mongoClient.connect(url, function (err, db) {
    db
      .collection('users')
      .find({"_id": new ObjectID(id)})
      .toArray(function (err, user) {
        db.close();
        if (user.length > 0) {
          res.json(user[0]);
        } else {
          res
            .status(404)
            .json({err: 'User not found'});
        }
      })
  })
}

module.exports.addUser = function (req, res) {
  if (!(!!req.body.name) || !(!!req.body.age)) {
    return res
      .status(400)
      .json({err: 'Data format is not correct'});
  }

  let user = {
    name: req.body.name,
    age: parseInt(req.body.age)
  };

  mongoClient.connect(url, function (err, db) {
    db
      .collection('users')
      .insertOne(user, function (err, result) {
        db.close();
        res.json(result.ops[0]);
      })
  })

}

module.exports.editUser = function (req, res) {
  if (!(!!req.body.name) || !(!!req.body.age)) {
    return res
      .status(400)
      .json({err: 'Data format is not correct'});
  }

  let id = new ObjectID(req.params.id);
  mongoClient.connect(url, function (err, db) {
    db
      .collection('users')
      .find({"_id": id})
      .toArray(function (err, user) {
        if (user.length > 0) {
          let updateUser = {
            name: req.body.name,
            age: parseInt(req.body.age)
          };

          db
            .collection('users')
            .findOneAndUpdate({
              name: user[0].name
            }, {
              $set: updateUser
            }, {
              returnOriginal: false
            }, function (err, result) {
              console.log(err);
              db.close();
              res.json(result.value);
            })
        } else {
          db.close();
          res
            .status(404)
            .json({err: 'User not found'});
        }

      })
  })
}

module.exports.deleteUser = function (req, res) {
  let id = new ObjectID(req.params.id);

  mongoClient.connect(url, function (err, db) {
    db
      .collection('users')
      .find({"_id": id})
      .toArray(function (err, user) {
        if (user.length > 0) {

          db
            .collection('users')
            .deleteOne({
              name: user[0].name
            }, function (err, result) {
              console.log(err);
              db.close();
              res.json(user[0]);
            })
        } else {
          db.close();
          res
            .status(404)
            .json({err: 'User not found'});
        }

      })
  })
}