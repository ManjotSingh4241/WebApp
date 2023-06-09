const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
});


let User;

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(userData.password, 10)
            .then(hash => {
                const newUser = new User({
                    userName: userData.userName,
                    password: hash,
                    email: userData.email
                });
                newUser.save()
                    .then(() => resolve())
                    .catch(err => reject(`NNo User:${err}`));
            })
            .catch(err => reject(`pass fail${err}`));
    });
}
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://abhi:abhobhi@senecaweb.sezpktk.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db.on("error", error => {
            reject(error);
        });

        db.once("open", () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};
module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec()
            .then(user => 
                {
                
                if (!user)
                 {
                    reject(`Unable to find user: ${userData.userName}`);
                } 
                else 
                {
                    bcrypt.compare(userData.password, user.password)
                       
                    .then(result => {
                            
                            if (result)
                            
                            
                            {
                                resolve(user);
                      
                      
                            } 
                            
                            
                            else 
                            {
                                reject(`pass not work: ${userData.userName}`);
                            }
                        })
                        .catch(err => reject(`different passes: ${err}`));
                }
            })





            .catch(err => reject(`user gone: ${err}`));
    });
}