const { User, ProjectFolder, Preferences } = require('../models');

export async function migrateProjects() {
	let users = await User.find();
	users = await users.map((user) => user._id);

	for (let x = 0; x < users.length - 1; x++) {
		let user = await User.findOne({ _id: users[x] });
		if (user) {
			console.log({ projectFolder: user.projectFolder });

			let existingProjectFolder = await ProjectFolder.findOne({ userId: user._id });
			if (existingProjectFolder) {
				console.log(`user ${user.email} already has a project folder`);
				console.log({ existingProjectFolder });
				// let folderIds = await existingProjectFolder.projects.map((project) => project._id.toString());
				// let incomingIds = await user.projects
				// 	.map((project) => project._id.toString())
				// 	.filter((id) => !folderIds.includes(id));
				// let projects = await [...folderIds, ...incomingIds];
				// existingProjectFolder.project = await projects;
				// existingProjectFolder.save();
			} else {
				let projects = await user.projects.map((p) => p._id);
				let newProjectFolder = await new ProjectFolder({ userId: user._id, projects });
				newProjectFolder
					.save()
					.then(async (newFolder) => {
						user.projectFolder = await newFolder._id;
						user.save().then(() => console.log(`Successful save for ${user.email}`));
					})
					.catch((err) => console.log({ err }));
			}
		}
	}

	console.log('Done migrating user projects! Fingers crossed.');
}

export async function generateMissingPreferenceModels() {
	let users = await User.find();
	users = await users.map((u) => u._id);

	for (let a = 0; a < users.length; a++) {
		let user = await User.findOne({ _id: users[a] });
		if (user && !user.preferences) {
			let newDefaultPreferences = new Preferences({ userId: user._id });
			newDefaultPreferences.save().then((savedPreferences) => {
				user.preferences = savedPreferences._id;
				user.save().then(() => {
					console.log(`Saved ${user.email}'s new default settings!`);
				});
			});
		} else {
			console.log(`${user.email} already has preferences.`);
			console.log({ prefs: user.preferences });
		}
	}
}
