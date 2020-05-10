const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.validateRegistration = (req, res, next) => {
	req.sanitizeBody('name');
	req.checkBody('name', 'You must supply a name').notEmpty();
	req.checkBody('email', 'That email is not valid').notEmpty().isEmail();
	req.sanitizeBody('email').normalizeEmail({
		gmail_remove_dots: false,
		gmail_remove_subaddress: false,
		remove_dots: false,
		remove_extension: false
	});
	req.checkBody('password', 'Must provide a password').notEmpty();
	req.checkBody('password-confirm', 'Opps! Pass not same').equals(req.body.password);
	
	const errors = req.validationErrors();
	
	if (errors){
		console.log("Errors");
		req.flash('error', errors.map(error => error.msg));
		res.render('registration', {
			title: 'Register',
			flashes: req.flash()
		})
	}
	next();
}
exports.loginForm = (req, res, next) => {
	res.render('login', {title: 'Login Form'});
}

exports.registrationForm = (req, res, next) => {
	res.render('registration', {title: 'Registration Form'});
	
}

exports.register = async (req, res, next) => {
	const user = new User({
		email: req.body.email,
		name: req.body.name
	});
	const registerPromise = promisify(User.register, User);
	await registerPromise(user, req.body.password);
	console.log(req.body);
	next();
	
}