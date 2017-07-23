var app = angular.module('myApp', []);

app.controller('mainCtrl', function($scope, $http){

$scope.remove = function(currentID){
 

 $http.delete('/notes', {params: {'id': currentID}}).then(
  function successCallback(response){

    $scope.notes = $scope.notes.filter(function(note){
      return note._id !== currentID;    
    });

  }, function errorCallback(response){
    console.log('did not removed');
  });

    

};



});

app.controller('saveCtrl', function($scope, $http, $filter){


$scope.create = function(){


var date = new Date();



     $http({
        method: 'post',
        url: '/notes',
        data: { 'content': $scope.textarea, 'title': "Here must be a title", 'date': $filter('date')(date, 'HH:mm | dd.MM.yyyy')}
     }).then(function successCallback(response) {


            $scope.notes.push(response.data);
            $scope.textarea = "";


  }, function errorCallback(response) {
     	console.log(response.statusText);

  });
};





    });
