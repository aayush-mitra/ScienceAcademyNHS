const mongoose = require('mongoose')

const OrganizationSchema = new mongoose.Schema({
    name: String,
    experience: String,
    description: String,
    city: String,
    state: String,
    causes: [
        String
    ],
    approved: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Organization", OrganizationSchema)