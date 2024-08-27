const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Meeting = require('../../models/Meeting.js')

router.post('/create', (req, res) => {
    const {date, description, links, images} = req.body;

    if (!date || description.length ==0 ) {
        return res.json({
            success: false,
            message: "Error: Missing Fields"
        });
    }

    const newMeeting = new Meeting({
        date,
        description,
        links,
        images
    })

    newMeeting.save().then(m1 => {
        return res.json({
            success: true,
            meeting: m1,
            message: "Meeting created"
        })
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.post('/edit', (req, res) => {
    const {meetingId, date, description, links, images} = req.body;

    Meeting.findOne({_id: meetingId}).then(meeting => {
        if (!meeting) {
            return res.json({
                success: false,
                message: "Error: Meeting not found"
            });
        }

        meeting.date = date;
        meeting.description = description;
        meeting.links = links;
        meeting.images = images;

        meeting.save().then(m1 => {
            return res.json({
                success: true,
                meeting: m1,
                message: "Meeting updated"
            })
        }).catch(err => {
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        })
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.post('/delete', (req, res) => {
    const {meetingId} = req.body;

    Meeting.findOne({_id: meetingId}).then(meeting => {

        if (!meeting) {
            return res.json({
                success: false,
                message: "Error: Meeting not found"
            });
        }

        Meeting.deleteOne({_id: meeting._id}).then(() => {

            Meeting.find({}).then(meetings => {

                return res.json({
                    success: true,
                    message: "meeting deleted",
                    meetings,
                    meeting
                })
            }).catch(err => {
                console.log(err)
                return res.json({
                    success: false,
                    message: "Error: Server Error"
                });
            })

        }).catch(err => {
            console.log(err)
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        })

    }).catch(err => {
        console.log(err)
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.get('/get-meetings', (req, res) => {
    Meeting.find({}).then(meetings => {

        return res.json({
            success: true,
            meetings
        })

    }).catch(err => {
        console.log(err)
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})


router.get('/get-meeting', (req, res) => {
    const {meetingId} = req.query;

    Meeting.findOne({_id: meetingId}).then(meeting => {
        if (!meeting) {
            return res.json({
                success: false,
                message: "Error: Meeting not found"
            });
        }

        return res.json({
            success: true,
            meeting
        })
    }).catch(err => {
        console.log(err)
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

module.exports = router;