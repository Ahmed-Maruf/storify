const passport = require('passport');

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()){
		return next();
	}
	req.flash('error', 'You must logg in!');
	res.redirect('/login');
	
}
exports.login = passport.authenticate('local', {
	failureRedirect: '/login',
	failureFlash: 'Failed login!',
	successRedirect: '/',
	successFlash: 'Logged in!'
});

exports.logout = (req, res, next) => {
	req.logout();
	req.flash('success', 'You are now logged out 👐');
	res.redirect('/');
}