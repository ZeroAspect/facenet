const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
// Middleware

app.engine("hbs", hbs.engine({ extname: "hbs", "defaultLayout": "main" }))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname + "/views"))

app.get('/', async(req, res)=>{
  res.render('home')
})