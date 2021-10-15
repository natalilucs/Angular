const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const student_controller = require('./student_controller');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect("mongodb+srv://admin:admin12345@cluster1.wlzyx.mongodb.net/Grades?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/students', student_controller);

app.listen(8000);



