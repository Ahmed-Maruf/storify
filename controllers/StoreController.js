const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image');
		console.log(file.mimetype);
		if (isPhoto) {
			next(null, true);
		} else {
			next({message: 'That filetype isn\'t supported'}, false);
		}
	}
}

exports.homePage = (req, res) => {
	res.render('index');
}

exports.addStore = (req, res) => {
	res.render('edit-store', {
		title: 'Add Store'
	});
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
	if (!req.file) {
		next();
		return;
	}
	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = `${uuid.v4()}.${extension}`;
	const photo = await jimp.read(req.file.buffer);
	await photo.resize(800, jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	console.log(photo);
	next();
	
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
	const store = await Store.findById({_id: req.params.id});
	res.render('edit-store', {
		title: `Edit ${store.name}`,
		store
	})
}

exports.updateStore = async (req, res) => {
	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
		new: true,
		runValidators: true
	}).exec();
	
	req.flash('success', `Successfully updated ${store.name} view store <a href="${store._id}">click</a>`);
	res.redirect(`/stores/${store.slug}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
	const store = await Store.findOne({ slug: req.params.slug });
	if (!store) return next();
	res.render('store', {
		title: store.name,
		store
	})
}