const express = require('express');
const authHelper = require('../helpers/authentication');

const router = express.Router();

router.get('/', (req, res, next) => {
	authHelper.isAuthenticated(req).then((isAuthenticated) => {
		const template = isAuthenticated ? 'dataprivacy/privacy_logged_in' : 'dataprivacy/privacy_guests';
		if (isAuthenticated) {
			return authHelper.populateCurrentUser(req, res)
				.then(() => authHelper.restrictSidebar(req, res))
				.then(() => Promise.resolve(template));
		}
		return Promise.resolve(template);
	}).then((template) => {
		res.render(template, {
			title: 'Datenschutzerklärung',
			inline: !!template.includes('guest'),
		});
	});
});

module.exports = router;
