const express = require('express')
const router = express.Router();

const Member = require('../../models/Member')

router.post('/add-member', (req, res) => {
    const {name, grade} = req.body;

    if(name.length === 0 || grade < 9) {
        return res.json({
            success: false,
            message: "Error: Invalid Inputs"
        });
    }

    const newMember = new Member({
        name, grade
    })

    newMember.save().then(m => {
        Member.find({officer: false}).then(members => {
            return res.json({
                success: true,
                message: "Member Created",
                member: m,
                members
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

router.post('/delete-member', (req, res) => {
    const {memberId} = req.body;

    Member.findOne({_id: memberId}).then(m => {

        if (!m) {
            return res.json({
                success: false,
                message: "Error: Member not found"
            });
        }

        Member.deleteOne({_id: m._id}).then(() => {
            
            Member.find({officer: false}).then(ms => {
                return res.json({
                    success: true,
                    message: "Member Deleted",
                    members: ms,
                    deletedMember: m
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

router.post('/edit-officer', (req, res) => {
    const {officerPosition, name, picture} = req.body;

    Member.findOne({officerPosition}).then(officer => {

        if (!officer) {
            return res.json({
                success: false,
                message: "Error: No Such Officer Position"
            });
        }

        officer.name = name
        officer.picture = picture

        officer.save().then(o => {
            Member.find({officer: true}).then(os => {

                return res.json({
                    success: true,
                    message: "Officer Updated",
                    officer: o,
                    officers: os
                })

            }).catch(err => {
                console.log(err);
                return res.json({
                    success: false,
                    message: "Error: Server Error"
                });
            })
        }).catch(err => {
            console.log(err);
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        })
    }).catch(err => {
        console.log(err);
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.get('/members', (req, res) => {
    Member.find({officer: false}).then(members => {
        if (!members) {
            return res.json({
                success: false,
                message: "Error: Server Error"
            });

        }

        return res.json({
            success: true,
            members: members
        })
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.get('/officers', (req, res) => {
    Member.find({officer: true}).then(officers => {
        if (!officers) {
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        }

        return res.json({
            success: true,
            officers
        })
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

module.exports = router