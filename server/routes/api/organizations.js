const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();

const Organization = require('../../models/Organization')

router.post('/organization-request', (req, res) => {
    const {
        name,
        experience,
        description,
        city,
        state,
        causes
        
    } = req.body;

    if (name.length <= 0 || experience.length <= 0 || description.length <= 0 || city.length <= 0 || state.length <= 0) {
        return res.json({
            success: false,
            message: "Please fill in all required fields."
        });
    }

    const newOrganization = new Organization({
        name,
        experience,
        description,
        city,
        state,
        causes
    })

    newOrganization.save().then(o => {
        return res.json({
            success: true,
            message: "request submitted"
        })
    }).catch(err => {
        console.log(err);
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.post('/approve-organization', (req, res) => {
    const {organizationId} = req.body;

    Organization.findOne({_id: organizationId}).then(o => {
        if (!o) {
            return res.json({
                success: false,
                message: "Error: Organization not Found"
            });
        }

        o.approved = true;

        o.save().then(o1 => {

            return res.json({
                success: true,
                message: "Organization approved",
                organization: o1
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


router.post('/edit-organization', (req, res) => {
    const {
        organizationId,
        name,
        description,
        city,
        state,
        causes
    } = req.body;

    Organization.findOne({_id: organizationId}).then(org => {
        if (!org) {
            return res.json({
                success: false,
                message: "Error: No Organization Found"
            });
        }

        org.name = name;
        org.experience = experience;
        org.description = description;
        org.city = city;
        org.state = state;
        org.causes = causes;

        org.save().then(o1 => {
            Organization.find({approved: true}).then(orgs => {
                return res.json({
                    success: true,
                    message: "organization edited",
                    organization: o1,
                    organizations: orgs
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


router.post('/delete-organization', (req, res) => {
    const {organizationId} = req.body;

    Organization.findOne({_id: organizationId}).then(org => {

        if (!org) {
            return res.json({
                success: false,
                message: "Error: Organization not found"
            });
        }

        Organization.deleteOne({_id: org._id}).then(() => {

            Organization.find({approved: true}).then(orgs => {

                return res.json({
                    success: true,
                    message: "Organization deleted",
                    organizations: orgs,
                    deletedOrganization: org
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

router.get('/approved-organizations', (req, res) => {
    
    Organization.find({approved: true}).then(organizations => {

        if (!organizations) {
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        }

        return res.json({
            success: true,
            organizations
        })

    }).catch(err => {
        console.log(err);
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })

})

router.get('/organization-requests', (req, res) => {

    Organization.find({approved: false}).then(organizations => {
        if (!organizations) {
            return res.json({
                success: false,
                message: "Error: Server Error"
            });
        }
        return res.json({
            success: true,
            organizations
        })
    }).catch(err => {
        console.log(err);
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.get('/organization', (req, res) => {
    const {organizationId} = req.query;

    Organization.findOne({_id: organizationId}).then(org => {
        if (!org) {
            return res.json({
                success: false,
                message: "Error: Organization not found"
            });
        }

        return res.json({
            success: true,
            organization: org
        })
    }).catch(err => {
        console.log(err);
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

module.exports = router;
