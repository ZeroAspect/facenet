const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const queryIp = require("./funcs/ip.js")
const User = require("./models/Users.js")
// Middleware


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.engine("hbs", hbs.engine({ extname: "hbs", "defaultLayout": "main" }))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname + "/views"))

const buttons = {
  login: `<button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>`,
  cadastro: `<button type="button" class="btn btn-warning" onclick="location.href='/cadastrar'">Cadastrar</button>`
}

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
app.get('/login', async(req, res, next)=>{
  const ip = await queryIp()
  const user = await User.findOne(
    {
      where: {
        ip: ip.ip
      }
    }
  )

  if(user === null){
    res.render('login', {
      message: `
      <button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastrar'">Cadastrar</button>
      `
    })
  }else{
    res.redirect('/')
  }
})
app.post('/login', async(req, res)=>{
  const { email, senha } = await req.body
  const ip = await queryIp()
  const user = await User.findOne({
    where: {
      email,
      senha
    }
  })
  if(user === null){
    res.render('login', {
      message: `
      <button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastrar'">Cadastrar</button>
      `,
      notify: `
      <div class="alert alert-danger text-center" role="alert">
        <strong>
          Usuário ou senha inválidos!
        </strong>
      </div>
      `
    })
  }else{
    await user.update({
      ip: ip.ip
    })
    res.redirect('/')
  }
})