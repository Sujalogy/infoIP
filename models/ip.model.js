const mongoose = require('mongoose');

const searchSchema = mongoose.Schema({
    user : { type : mongoose.Schema.Types.ObjectId, ref : "UserModel", required: true },
    ip : {type : String, required: true},
    city : {type : String, required: true},
    createdAt : {type : Date, default: Date.now}
}, {
    versionKey : false,
});

const SearchModel = mongoose.model("search", searchSchema);

module.exports = {
    SearchModel
}