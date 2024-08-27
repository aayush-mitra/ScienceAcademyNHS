const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const Project = require('../../models/Project')

router.post('/create', (req, res) => {
    const {name, date, description, images} = req.body;

    if (name.length == 0 || !date || description.length == 0 || images.length == 0) {
        return res.json({
            success: false,
            message: "Error: Missing Fields"
        });
    } 

    const newProject = new Project({
        name,
        date,
        description,
        images
    })

    newProject.save().then(project => {

        return res.json({
            success: true,
            message: "Project created",
            project
        })


    }).catch(err => {
        console.log(err)
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.post('/edit', (req, res) => {
    const {projectId, name, date, description, images} = req.body;

    if (!projectId || !date || description.length == 0 || images.length == 0)  {
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    }

    Project.findOne({_id: projectId}).then(project => {
        if (!project) {
            return res.json({
                success: false,
                message: "Error: Project not found"
            });
        }

        project.name = name;
        project.date = date;
        project.description = description
        project.images = images


        project.save().then(p1 => {
            return res.json({
                success: true,
                message: "Project edited",
                project: p1
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

router.post('/delete', (req, res) => {
    const {projectId} = req.body;

    Project.findOne({_id: projectId}).then(project => {
        if (!project) {
            return res.json({
                success: false,
                message: "Error: Project not found"
            });
        }

        Project.deleteOne({_id: project._id}).then(() => {

            Project.find({}).then(projects => {

                return res.json({
                    success: true,
                    message: "Project deleted",
                    project,
                    projects
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


router.get('/get-projects', (req, res) => {
    
    Project.find({}).then(projects => {
        return res.json({
            success: true,
            projects
        })
    }).catch(err => {
        console.log(err)
        return res.json({
            success: false,
            message: "Error: Server Error"
        });
    })
})

router.get('/get-project', (req, res) => {
    const {projectId} = req.query;

    Project.findOne({_id: projectId}).then(project => {

        if (!project) {
            return res.json({
                success: false,
                message: "Error: Project not found"
            });
        }

        return res.json({
            success: true,
            project
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