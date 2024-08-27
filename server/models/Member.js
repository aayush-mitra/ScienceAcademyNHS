const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        default: 0
    },
    officer: {
        type: Boolean,
        default: false
    },
    officerPosition: {
        type: String,
        default: ""
    },
    picture: {
        type: String,
        default: ""
    }
})

module.exports = mongoose.model("Member", MemberSchema)