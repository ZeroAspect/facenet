const User = require("../models/Users");

async function login(req, res, next){
  const user = await User.findOne({
    where: {
      ip: ip
    }
  })

  if(user === null){
    next()
  }else{
    res.redirect("/")
  }
}

module.exports = login