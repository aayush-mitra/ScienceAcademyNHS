const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const router = express.Router();

const Misc = require('../../models/Misc')
const Mail = require('../../models/Mail')
const UserSession = require('../../models/UserSession')

router.post('/set-password', (req, res) => {
    const {password} = req.body;

    Misc.findOne({name: 'password'}).then(doc => {
        if (!doc) {
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.json({
                    success: false,
                    message: "Error: Server Error"
                });
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Error: Server Error"
                    });
                }

                doc.data = hash;
                doc.save().then(n => {
                    return res.json({
                        success: true,
                        message: "Password updated"
                    })
                }).catch(err => res.json({
                    success: false,
                    message: "Error: Server Error"
                }))
            })
        })
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.post('/login', (req, res) => {
    const {password, name} = req.body;
    
    Misc.findOne({name: 'password'}).then(doc => {
        if (!doc.validPassword(password)) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            })
            
        }

        const newUserSession = new UserSession({
            name
        })

        newUserSession.save().then(doc => {
            return res.json({
                success: true,
                message: "Valid sign in",
                token: doc._id
                
            });
        }).catch(err => {
            console.log(err);
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


router.get("/verify", (req, res) => {
    const { token } = req.query;
    
    UserSession.findOne({_id: token}).then(session => {
        if (!session) {
            return res.json({
                success: false,
                message: "Error: Invalid Token"
            });
        }

        return res.json({success: true, message:"Authorized"})
       
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
    
  });

router.get('/logout', (req, res) => {
    const {token} = req.query;

    UserSession.findOne({_id: token}).then(s => {

    if (!s) {
        return res.json({
            success: false,
            message: "Error: User not found"
        });
    }

    UserSession.deleteOne({_id: s._id}).then(() => {
        return res.json({
            success: true,
            message: "Logged Out"
        })
    }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.post('/join-mail-list', (req, res) => {
    const {email} = req.body;

    Mail.findOne({email}).then(mail => {
        if (mail) {
            return res.json({
                success: false,
                message: "Error: Email already in system"
            });
        }

        const newMail = new Mail({
            email
        })

        newMail.save().then(m => {
            return res.json({
                success: true,
                message: `${email} added to emailing list.`
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

router.post('/leave-mail-list', (req, res) => {
    const {email} = req.body;

    Mail.findOne({email}).then(mail => {
        if (!mail) {
            return res.json({
                success: false,
                message: "Error: Email not found"
            });
        }

        Mail.findOne({email}).deleteOne().then(() => {
            return res.json({
                success: true,
                message: `${email} removed from mailing list.`
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

router.post('/update-field', (req, res) => {
    const {name, data} = req.body;

    Misc.findOne({name}).then(doc => {
        if (!doc) {
            return res.json({
                success: false,
                message: "Error: No misc field with given name"
            });
        }

        doc.data = data;
        doc.save().then(doc1 => {
            return res.json({
                success: true,
                message: `${name} updated to ${data}`
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

router.get('/get-field', (req, res) => {
    const {name} = req.query;

    Misc.findOne({name}).then(doc => {
        if (!doc) {
            return res.json({
                success: false,
                message: "Error: No misc field with given name"
            });
        }

        return res.json({
            success: true,
            data: doc.data
        })
    }).catch(err => {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})



module.exports = router