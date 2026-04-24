const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


//models
const User = mongoose.model("User", {email: String, password: String});

const Task = mongoose.model("Task", {UserId: String, text: String});

/*  auth routes */

//signup
app.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({email, password: hash});
    res.json(user);
});

//login
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(400).json({message: 'User not found'});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({message: 'Invalid credentials'});
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.json({token});
});

/* Middleware*/
function auth(req, res, next){
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({message: 'No token provided'});
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).json({message: 'Invalid token'});
    }
}




//add task
app.post('/tasks',auth , async (req, res) => {
    const task=await Task.create({
        UserId: req.user.id,
        text:req.body.text
    });
    res.json(task);
    });

//get tasks
app.get('/tasks', auth, async (req, res) => {
    const tasks = await Task.find({UserId: req.user.id});
    res.json(tasks);
});


/* server.  */

app.listen(5000, () => console.log('Server running on port 5000'));
