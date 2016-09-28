(function () {
	angular.module('ScribeApp').factory('trash', function ($http) {

		return {
			getDeletedFiles: function (user_id) {
				return $http.get('/documents/trash/' + user_id + '.json');
			}
		};

	});
})();
