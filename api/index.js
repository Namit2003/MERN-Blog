const express = require('express')
const cors = require('cors')
const User = require('./models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const app = express()

const salt = bcrypt.genSaltSync(10);
const secret = 'f1a8d3e9c5b2a6b8c1f3e2a5f8e6a2f5b2d1f8e3b5d8c1f2e6a2f5b2d1f8e3'

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(cookieParser())

mongoose.connect('mongodb+srv://Namit:Namit2003@cluster0.d5mnosr.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        res.json(userDoc)
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            })
        })
    } else {
        res.status(400).json('Wrong credentials')
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err
        res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})






app.listen(4000)