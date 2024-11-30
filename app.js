const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const queryIp = require("./funcs/ip.js")
const User = require("./models/Users.js")
// Middleware

app.engine("hbs", hbs.engine({ extname: "hbs", "defaultLayout": "main" }))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname + "/views"))

app.get('/', async(req, res)=>{
  const ip = await queryIp()
  console.log(ip)
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })

  if(user === null){
    res.render('home', {
      // <button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      // <button type="button" class="btn btn-warning" onclick="location.href='/cadastrar'">Cadastrar</button>
      message: `
      <button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastrar'">Cadastrar</button>
      `,
      ip
    })
  }else{
    res.render('home', {
      message: `Welcome back, ${user.name}!`,
      ip
    })
  }
})