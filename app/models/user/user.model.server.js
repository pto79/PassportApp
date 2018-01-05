var mongoose      = require("mongoose");
var crypto        = require('crypto');
//var jwt	          = require('jsonwebtoken');

module.exports = function() {

    var UserSchema = new mongoose.Schema(
        {
            google:   {
                id:    String,
                token: String
            },
            facebook:   {
                id:    String,
                token: String
            },
            firstName: String,
            lastName: String,
            email: String,
            roles: [String],
            hash: String,
            salt: String
        }, {collection: "user"});

    UserSchema.methods.setPassword = function(password){
      this.salt = crypto.randomBytes(16).toString('hex');
      this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    };

    UserSchema.methods.validPassword = function(password){
      var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
      return this.hash === hash;
    };

    var UserModel = mongoose.model('UserModel', UserSchema);

    var api = {
        findUserByCredentials: findUserByCredentials,
        findUserByUsername: findUserByUsername,
        findUserById: findUserById,
        findAllUsers: findAllUsers,
        createUser: createUser,
        removeUser: removeUser,
        updateUser: updateUser,
        findUserByGoogleId: findUserByGoogleId,
        findUserByFacebookId: findUserByFacebookId,
        getMongooseModel: getMongooseModel,
        findUserByEmail: findUserByEmail,
        setSalt: setSalt,
        setHash: setHash
    };
    return api;

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }

    function findUserByGoogleId(googleId) {
        return UserModel.findOne({'google.id': googleId});
    }

    function updateUser(userId, user) {
        return UserModel.update({_id: userId}, {$set: user});
    }

    function removeUser(userId) {
        return UserModel.remove({_id: userId});
    }

    function findAllUsers() {
        return UserModel.find();
    }
    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username});
    }

    function getMongooseModel() {
        return UserModel;
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function findUserByCredentials(credentials) {
        return UserModel.findOne(
            {
                email: credentials.email
            }
        );
    }

    function findUserByEmail(email) {
        return UserModel.findOne({email: email});
    }    

    function setSalt() {    
      return crypto.randomBytes(16).toString('hex');
    }

    function setHash(password, salt) {
      return crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
    }
}
