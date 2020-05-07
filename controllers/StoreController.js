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

exports.getStores = async (req, res) => {
	const stores = await Store.find();
	res.render('stores', {
		title: "Stores",
		stores
	})
}

exports.editStore = async (req, res) => {
	const store = await Store.findById({ _id: req.params.id });
	res.render('edit-store', {
		title: `Edit ${store.name}`,
		store
	})
}

exports.updateStore = async (req, res) => {
	const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true,
		runValidators: true
	}).exec();
	
	req.flash('success', `Successfully updated ${store.name} view store <a href="${store._id}">click</a>`);
	res.redirect(`/stores/${store.slug}/edit`);
}
