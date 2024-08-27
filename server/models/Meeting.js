const mongoose = require('mongoose')

const MeetingSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    description: {
        type: String
    },
    links: [String],
    images: [String]
})

module.exports = mongoose.model("Meeting", MeetingSchema)
