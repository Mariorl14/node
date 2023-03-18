const vistaPrincipal = (req, res)=>{
    res.render('login')
}
const vistaRegister = (req, res)=>{
    res.render('register')
}
const vistaHome = (req, res)=>{
    res.render('home')
}

module.exports = {
    vistaPrincipal,
    vistaHome,
    vistaRegister
}