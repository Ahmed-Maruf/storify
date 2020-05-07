const mongoose = require('mongoose');
const Store = mongoose.model('Store');
exports.homePage = (req, res) => {
	res.render('index');
}

exports.addStore = (req, res) => {
	res.render('edit-store', {
		title: 'Add Store'
	});
}

exports.createStore = async (req, res) => {
	const store = await (new Store(req.body)).save();
	req.flash('success', `succefully created ${store.name}`);
	res.redirect(`/store/${store.slug}`);
}
