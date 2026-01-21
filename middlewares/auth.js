function requireLogin(req,res,next){
    if (!req.session.userId){
        return res.redirext('/auth/login');
    }
    next();
}

module.exports = {requireLogin};