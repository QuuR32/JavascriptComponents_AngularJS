const AJAX_BASE_URL = 'http://atelierlibre.url.ph/app/JavascriptComponents_WS/';
// const AJAX_BASE_URL = '/JavascriptComponents_WS/';

var myApp = angular.module('MyApp', ['ngRoute', 'ngAnimate']);

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	
	$routeProvider
		.when('/home', {
			templateUrl: 'JavascriptComponents_AngularJS/views/home.html',
			controller: 'AppController'
		})
		.when('/news', {
			templateUrl: 'JavascriptComponents_AngularJS/views/news.html',
			controller: 'AppController'
		})
		.when('/contact', {
			templateUrl: 'JavascriptComponents_AngularJS/views/contact.html',
			controller: 'AppController'
		})
	    .otherwise({
	      redirectTo: '/home'
	    });
}]);

myApp.controller('AppController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
	$scope.message = "Heyyy";
	$scope.newNews = {};

	$http({
	    method: 'POST',
	    url: AJAX_BASE_URL + 'news.php',
	    data : 'data=' + JSON.stringify({m: 'all'}),
	    headers: {
	    		'Content-Type': 'application/x-www-form-urlencoded'
	    	}
	}).then(function(result) {
		$scope.news = result.data;
	}, function(error) {
		console.dir(error);
	});
	
	$scope.setNewNews = function() {
		$scope.unselectAllNewsBut(-1);
		
		document.getElementById("butSubmit").value = "Creer une news";
		
		$scope.newNews.Titre = "";
		$scope.newNews.Contenu = "";
		$scope.newNews.ID = null;
	}
	
	$scope.unselectAllNewsBut = function(_ID) {
		for(var i = 0; i < $scope.news.length; i++) {
			if ($scope.news[i].news.ID != _ID)
				$scope.news[i].news.selected = false;
	    		document.getElementById("aNews_" + $scope.news[i].news.ID).style.backgroundColor = "Transparent";
	    	}
	}
	
	$scope.selectNews = function(_news) {
		$scope.unselectAllNewsBut(_news.ID);
		
		let elemID = "aNews_" + _news.ID;
		
		if(_news.selected) {
			document.getElementById(elemID).style.backgroundColor = "Transparent";
			_news.selected = false;
			
			$scope.setNewNews();
		} else {
			document.getElementById(elemID).style.backgroundColor = "rgb(254, 201, 212)";
			document.getElementById("butSubmit").value = "Modifier une news";
			
			$scope.newNews.Titre = _news.Titre;
			$scope.newNews.Contenu =  _news.Contenu;
			$scope.newNews.ID = _news.ID;

			_news.selected = true;
		}
	};
	
	$scope.addNews = function() {
		if (!$scope.newNews.Titre || $scope.newNews.Titre == "" || !$scope.newNews.Contenu || $scope.newNews.Contenu == "") {
			return;
		}
		if ($scope.newNews.ID == null) {
			let data = {
				m: 'add',
				Titre: encodeURIComponent($scope.newNews.Titre),
				Contenu: encodeURIComponent($scope.newNews.Contenu)
			};
			
			$http({
			    method: 'POST',
			    url: AJAX_BASE_URL + 'news.php',
			    data : "data=" + encodeURIComponent(JSON.stringify(data)),
			    headers: {
			    		'Content-Type': 'application/x-www-form-urlencoded'
			    	}
			}).then(function(result) {
				$scope.news.push(result.data[0]);
				$timeout(function() {
					$scope.selectNews($scope.news[$scope.news.length - 1].news);
				}, 200);
			}, function(error) {
				console.dir(error);
			});
		} else {
			let data = {
				m: 'update',
				ID: $scope.newNews.ID,
				Titre: encodeURIComponent($scope.newNews.Titre),
				Contenu: encodeURIComponent($scope.newNews.Contenu)
			};
			
			$http({
			    method: 'POST',
			    url: AJAX_BASE_URL + 'news.php',
			    data : "data=" + encodeURIComponent(JSON.stringify(data)),
			    headers: {
			    		'Content-Type': 'application/x-www-form-urlencoded'
			    	}
			}).then(function(result) {
				if (result.data == "1") {
					for (var i = 0; i < $scope.news.length; i++) {
					    if ($scope.news[i].news.ID == $scope.newNews.ID) {
						    	$scope.news[i].news.Titre = $scope.newNews.Titre;
						    	$scope.news[i].news.Contenu = $scope.newNews.Contenu;
					    }
					}
				}
			}, function(error) {
				console.dir(error);
			});
		}
	};
	
	$scope.deleteNews = function(_elemID) {
		let data = {
			m: 'delete',
			ID: _elemID
		};
		let postData = 'data=' + JSON.stringify(data);
		
		$http({
		    method: 'POST',
		    url: AJAX_BASE_URL + 'news.php',
		    data : postData,
		    headers: {
		    		'Content-Type': 'application/x-www-form-urlencoded'
		    	}
		}).then(function(result) {
			if (result.data == "1") {
				for (var i = $scope.news.length - 1; i >= 0; --i) {
				    if ($scope.news[i].news.ID == "" + _elemID) {
				    		$scope.news.splice(i, 1);
				    }
				}
				
				document.getElementById("butSubmit").value = "Creer une news";

				$scope.newNews.Titre = "";
				$scope.newNews.Contenu = "";
				$scope.newNews.ID = null;
			}
		}, function(error) {
			console.dir(error);
		});
	};
}]);