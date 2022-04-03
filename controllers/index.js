const project_controller = require('./projectController.js');
const task_controller = require('./taskController.js');
const user_controller = require('./userController.js');
const status_controller = require('./statusController.js');
const project_folder_controller = require('./projectFolderController.js');
const user_preferences_controller = require('./userPreferencesController.js');

module.exports = {
	project_controller,
	status_controller,
	task_controller,
	user_controller,
	project_folder_controller,
	user_preferences_controller,
};
