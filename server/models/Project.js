const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    description: {
        type: String
    },
    images: [String]
})

module.exports = mongoose.model("Project", ProjectSchema)