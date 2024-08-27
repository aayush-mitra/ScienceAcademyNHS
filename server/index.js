const express = require('express')
const dotenv = require('dotenv')
dotenv.config();
const connectDB = require('./config/db.js')
const PORT = process.env.PORT || 5000

const misc = require('./routes/api/misc')
const meetings = require('./routes/api/meetings')
const projects = require('./routes/api/projects')
const organizations = require('./routes/api/organizations')
const members = require('./routes/api/members')

connectDB();

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/misc', misc)
app.use('/api/meetings', meetings)
app.use('/api/projects', projects)
app.use('/api/organizations', organizations)
app.use('/api/members', members)

app.get('/', (req, res) => {
    return res.json({
        success: true,
        message: "Hello World"
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})