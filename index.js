const express = require("express")
const app = require("./config/config.js")

require("./app.js")

app.listen(3000, (err)=>{
  if(err) throw err
  console.log("Server is running on port 3000")
})