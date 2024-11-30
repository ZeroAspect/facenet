async function queryIp(){
  try{
    const ip = await fetch("https://api64.ipify.org/?format=json")
    const json = ip.json()
    return json
  }catch(error){
    console.error(error)
    return null
  }
}

module.exports = queryIp