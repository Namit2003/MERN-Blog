const express = require('express')
require('dotenv').config();
const cors = require('cors')
const User = require('./models/User')
const Post = require('./models/Post')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path');
const fs = require('fs')

const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express()

const salt = bcrypt.genSaltSync(10);
const secret = 'f1a8d3e9c5b2a6b8c1f3e2a5f8e6a2f5b2d1f8e3b5d8c1f2e6a2f5b2d1f8e3'
const frontend_url = process.env.FRONTEND || 'http://localhost:5173'

app.use(cors({ credentials: true, origin: frontend_url }))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

const mongo_uri = process.env["MONGO_URI"];

mongoose.connect(mongo_uri);

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
    try {
        const { username, password } = req.body;
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            return res.status(400).json({ error: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal server error' });
                }

                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json({ error: 'Wrong credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/profile', (req, res) => {
    const { token } = req.cookies
    if (!token) {
        return res.json(null)
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err
        res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})


app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('. ');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err

        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id
        })
        res.json({ postDoc })
    })
})


app.get('/post', async (req, res) => {
    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    res.json(posts)
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('. ');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const { token } = req.cookies
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err

        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id)

        if (!isAuthor) {
            return res.status(400).json('You are not the author')
        }

        const updatedPost = await Post.findOneAndUpdate(
            { _id: postDoc._id },
            {
                $set: {
                    title,
                    summary,
                    content,
                    cover: newPath ? newPath : postDoc.cover,
                },
            },
            { new: true }
        );

        res.json(updatedPost)
    })
})


app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc)
})

app.listen(4000)