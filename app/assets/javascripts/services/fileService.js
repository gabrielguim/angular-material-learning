(function () {
	angular.module('ScribeApp').factory('files', function ($http) {

		var documentToShow;

		return {
			getRootFolder: function (current_root_folder_id) {
				return $http.get('/my-drive/' + current_root_folder_id + '.json');
			},

			getChildrenFolders: function (current_root_folder_id) {
				return $http.get('/folders/children/' + current_root_folder_id + '.json');
			},

			getChildrenFiles: function (current_root_folder_id) {
				return $http.get('/documents/children/' + current_root_folder_id + '.json');
			},

			setDocumentToShow: function (item) {
				documentToShow = item;
			},

			getDocumentToShow: function () {
				return documentToShow;
			},

		};

	});
})();
