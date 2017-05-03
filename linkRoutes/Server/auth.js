module.exports = {
    checkLogin: function(req, res, next) {
        //if (!req.session.admin || req.session.admin.name != "11") {
        if (!req.session.admin) {
            if (req.method == "GET") {
                res.redirect('/admin/login');
            } else {
                res.json({ error: "need login!" });
            }
            return;
        }
        next();
    },
    checkNotLogin: function(req, res, next) {
        //if (req.session.admin && req.session.admin.name == "11") {
        if (req.session.admin) {
            res.redirect('back'); //返回之前的页面
            return;
        }
        next();
    },
};