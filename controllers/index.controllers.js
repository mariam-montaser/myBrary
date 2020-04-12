exports.getHomepage = (req, res) => {
    res.render('index', {
        pageTitle: 'homepage'
    });
}