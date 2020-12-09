exports.getNotFound = (req, res, next) => {
    res.status(404).render('not-found', {
        pageTitle: 'Not found 404',
        activeShop: false,
        formsCss: false,
        productCss: false,
        path: '/404',
        isLoggedIn: req.session.isLoggedIn
    });
}