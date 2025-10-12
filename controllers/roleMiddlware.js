// controllers/roleMiddleware.js
exports.authRolTicocel = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.empresa === 'Ticocel') {
    return res.redirect('/listarVentasGoogleFijoTicocel');
  }
  next();
};

exports.authRolFavtelNIC = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.empresa === 'Favtel') {
    return res.redirect('/BDFijoNICFAV');
  }
  next();
};

exports.authRolNICFAVFijo = (req, res, next) => {
  if (req.user.rol !== 'admin' && req.user.empresa === 'Favtel') {
    return res.redirect('/listarVentasGoogleFijo');
  }
  next();
};

exports.TicocelBDF = (req, res, next) => {
  if (req.user.empresa === 'Ticocel') {
    return res.redirect('/BDFijoTicocel');
  }
  next();
};

exports.FavtelNicaraguaKolbi = (req, res, next) => {
  if (req.user.rol === 'vendedor' && req.user.empresa === 'Favtel') {
    return res.redirect('/bdKolbiNicaragua');
  }
  next();
};

exports.FavtelNicaraguaClaro = (req, res, next) => {
  if (req.user.rol === 'vendedor' && req.user.empresa === 'Favtel') {
    return res.redirect('/bdClaroNicaragua');
  }
  next();
};

exports.TicocelRVF = (req, res, next) => {
  if (req.user.empresa === 'Ticocel') {
    return res.redirect('/registrarVentaTicocelFijo');
  }
  next();
};

exports.TicocelLVFTIC = (req, res, next) => {
  if (req.user.empresa === 'Ticocel') {
    return res.redirect('/listarVentasGoogleFijoTicocel');
  }
  next();
};
