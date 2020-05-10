const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose')
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
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

exports.forgot = async (req, res) => {
	//1 - See if the user exists
	const user = await User.findOne({email: req.body.email});
	if (!user) {
		req.flash('error', 'No such user exist');
		return res.redirect('back');
	}
	//2 - Set reset token and expiry of the token
	user.resetToken = crypto.randomBytes(20).toString('hex');
	user.resetTokenExpiryDate = Date.now() + 3600000;
	
	await user.save();
	//3 - Send email with the token
	const resetUrl = `http://${req.headers.host}/account/reset/${user.resetToken}`;
	req.flash('info', `You have been emailed a password reset link ${resetUrl}`);
	
	//4 - redirect to login page
	res.redirect('/login');
	
}

exports.reset = async (req, res) => {
	const user = await User.findOne({
		resetToken: req.params.token,
		resetTokenExpiryDate: {$gt: Date.now()}
	});
	
	if(!user){
		req.flash('error', 'Password reset token invalid or expired');
		
	}
	
	res.render('reset',{
		title: 'Reset Password'
	});
}

exports.confirmedPass = (req,res,next) => {
	if (req.body.password === req.body['password-confirm']){
		return next();
	}
	req.flash('error', 'Password not same');
	res.redirect('back');
}

exports.update = async (req, res) => {
	const user = await User.findOne({
		resetToken: req.params.token,
		resetTokenExpiryDate: {$gt: Date.now()}
	});
	
	if(!user){
		req.flash('error', 'Password reset token invalid or expired');
		res.redirect('/login');
	}
	
	const setPass = promisify(user.setPassword, user);
	
	await setPass(req.body.password);
	user.resetToken = undefined;
	user.resetTokenExpiryDate = undefined;
	const updateUser = await user.save();
	await req.login(updateUser);
	req.flash('success', 'Password reset done!');
	res.redirect('/');
}