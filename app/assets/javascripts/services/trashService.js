(function () {
	angular.module('ScribeApp').factory('trash', function ($http) {

		return {

			getFiles: function (user_id) {
				//return $http.get('/documents/shared/' + user_id + '.json');
			}

		};

	});
})();
