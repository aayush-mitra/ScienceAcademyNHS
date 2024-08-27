const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MiscSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

MiscSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

MiscSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.data)
}

module.exports = mongoose.model("Misc", MiscSchema)