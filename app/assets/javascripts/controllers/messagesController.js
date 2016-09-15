(function () {
	angular.module('ScribeApp').controller('messagesController', function ($scope, $cookies, httpToolsService) {

		var current_user_id = $cookies.getObject('current_user_id');

		$scope.messages = [];

		httpToolsService.request('GET', '/notifications/user/' + current_user_id + ".json", '').then(
			function (res) {
				var mensagens = res.data;
				$scope.messages = mensagens;
				console.log($scope.messages);
	 		},
			function (err) { console.log(err) }
		);

	});
})();
