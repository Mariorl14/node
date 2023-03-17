const vistaPrincipal = (req, res)=>{
    res.render('home')
}
const vistaRegister = (req, res)=>{
    res.render('register')
}
const vistaLogin = (req, res)=>{
    res.render('login')
}

module.exports = {
    vistaPrincipal,
    vistaLogin,
    vistaRegister
}