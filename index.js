const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")
require('./connection/mongoose.connection')
let PORT = process.env.PORT_NUMBER || 4250


const signupRouter = require('./routes/signup.route')
app.use("/signup", signupRouter)
const signinRouter = require('./routes/signup.route')
app.use("/signin", signinRouter)
const usersRouter = require('./routes/signup.route')
app.use("/users", usersRouter)


let userModel = require('./models/schema.model')


app.get("/signin", (req, res) => {
    res.render("signin")
})

app.get("/signup", (req, res) => {
    res.render("signup", { message: "" })
})

app.post("/signin", (req, res) => {
    userModel.findOne({ email: req.body.email, password: req.body.password })
        .then((result) => {
            console.log(result);
            if (result) {
                res.redirect("/users")
            } else {
                res.render("signin")
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/details", (req, res) => {
    console.log(req.body);
    let form = new userModel(req.body);
    form.save()
        .then((result) => {
            console.log("form submitted successfully");
            console.log(result);
            res.redirect("signin")
        })
        .catch((err) => {
            console.log(err);
            if (err.code == 11000) {
                res.render("signup", { status: false, message: "Duplicate user found" })
            } else {
                res.render("signup", { status: false, message: "Please fill in appropriately" })
            }
        })
})

app.get("/users", (req, res) => {
    userModel.find()
        .then((result) => {
            console.log(result);
            res.render('dashboard', { userDetails: result })
        })
        .catch((err) => {
            console.log(err);
            res.render("dashboard", { info: "user does not exist" })
        })
})


app.post("/delete", (req, res) => {
    userModel.deleteOne({ email: req.body.newEmail })
        .then((result) => {
            res.redirect("users")
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/edit", (req, res) => {
    userModel.findOne({ email: req.body.newEmail })
        .then((result) => {
            if (result) {
                res.render("editusers", { info: result })
                console.log(result);
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

app.post("/update", (req, res) => {
    userModel.updateOne({ email: req.body.email }, req.body)
        .then((result) => {
            console.log("form updated successfully");
            console.log(result);
            res.redirect("users")
        })

        .catch((err) => {
            console.log(err);
        })
})


app.listen(PORT, () => {
    console.log(`Lift off! Server has started on port ${PORT}`);
})