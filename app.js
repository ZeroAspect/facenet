const express = require("express")
const app = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const queryIp = require("./funcs/ip.js")
const User = require("./models/Users.js")
const { marked } = require("marked")
const MySql = require("./db/database.js")
// Middleware


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.engine("hbs", hbs.engine({ extname: "hbs", "defaultLayout": "main" }))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname + "/views"))

const buttons = {
  login: `<button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>`,
  cadastro: `<button type="button" class="btn btn-warning" onclick="location.href='/cadastro'">Cadastrar</button>`
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
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastro'">Cadastrar</button>
      `,
      ip
    })
  }else{
    console.log(user)
    res.render('home', {
      // <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
      //     <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
      //   </svg>
      // </button>
      message: `
      <div class="dropdown">
        <a href="" class="d-block link-body-emphasis text-decoration-none dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">
          <strong>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
            </svg>
          </strong>
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="/${user.nome}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
            </svg>
            ${user.nome}
          </a></li>
          <hr class="dropdown-divider"/>
          <li><a class="dropdown-item" href="/publicar">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            Novo conteudo
          </a></li>
          <li><a class="dropdown-item" href="/editar/perfil">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
            </svg>
            Editar perfil
          </a></li>
          <hr class="dropdown-divider"/>
          <li><a class="dropdown-item text-danger" href="/logout">Sair</a></li>
        </ul>
      </div>
      `,
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
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastro'">Cadastrar</button>
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
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastro'">Cadastrar</button>
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
app.get('/cadastro', async(req, res)=>{
  const ip = await queryIp()
  const user = await User.findOne(
    {
      where: {
        ip: ip.ip
      }
    }
  )
  if(user === null){
    res.render('cadastro', {
      message: `
      <button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastro'">Cadastrar</button>
      `
    })
  }else{
    res.redirect('/')
  }
})
app.post('/cadastro', async(req, res)=>{
  const { email, senha, nome } = await req.body
  const ip = await queryIp()
  const userFormat = await nome.replace(' ', '')
  const userFormated = await userFormat.toLowerCase()

  const userEmail = await User.findOne({
    where: {
      email
    }
  })
  const userName = await User.findOne({
    where: {
      nome
    }
  })
  if(userEmail === null && userName === null){
    await User.create({
      nome,
      email,
      senha,
      biografia: marked("Bem-vindo ao FaceNet"),
      ip: ip.ip
    })
    res.redirect('/')
  }else{
    res.render('cadastro', {
      message: `
      <button type="button" class="btn btn-outline-dark me-2" onclick="location.href='/login'">Entrar</button>
      <button type="button" class="btn btn-warning" onclick="location.href='/cadastro'">Cadastrar</button>
      `,
      notify: `
      <div class="alert alert-danger text-center" role="alert">
        <strong>
          E-mail ou nome de usuário já existem!
        </strong>
      </div>
      `
    })
  }
})
app.get('/:nome', async(req, res)=>{
  const { nome } = req.params
  const mysql = await MySql()
  const ip = await queryIp()
  const user = await User.findOne(
    {
      where: {
        ip: ip.ip
      }
    }
  )
  if(user === null){
    res.redirect('/')
  }else{
    const userDb = await mysql.query('SELECT * FROM users WHERE nome =?', [nome])
    console.log(userDb)
    if(userDb.length > 0){
      res.render('profile', {
        user: userDb[0],
        message: `
          <div class="dropdown">
            <a href="" class="d-block link-body-emphasis text-decoration-none dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-expanded="false">
              <strong>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
              </strong>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/${user.nome}">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
                ${user.nome}
              </a></li>
              <hr class="dropdown-divider"/>
              <li><a class="dropdown-item" href="/publicar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                Novo conteudo
              </a></li>
              <li><a class="dropdown-item" href="/editar/perfil">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
                  <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                  <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                </svg>
                Editar perfil
              </a></li>
              <hr class="dropdown-divider"/>
              <li><a class="dropdown-item text-danger" href="/logout">Sair</a></li>
            </ul>
          </div>
        `
      })
    }else{
      res.redirect('/')
    }
  }
})
app.get('/:nome/conteudos', async(req, res)=>{
  const ip = await queryIp()
  const user = await User.findOne({
    where: {
      ip: ip.ip
    }
  })
  const userProfile = await User.findOne({
    where: {
      nome: req.params.nome
    }
  })
  if(user === null){
    
  }
})