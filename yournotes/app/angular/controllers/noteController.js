// main.controller("noteController", function ($scope, $http, $rootScope, $location) {
// $scope.note = {text: ''};


// // входной вызов к webapi (сервис, реализованный при помощи node)
// $scope.create = function(){
//         $http.post('/newForm', $scope.note).success(function(data){
//         if(data.state == 'success'){
//                 // $rootScope.authenticated = true;
//                 // $rootScope.current_user = data.user.username;
//                 // $rootScope.sess = data.user;
//                 // sessionStorage.setItem('current_user', $rootScope.sess.username);
//                 console.log('Angular has written new note.');
//                 // $location.path('/');
//                 // }

//             else{
//                 // $scope.error_message = data.message;
//                 // $rootScope.sess = null;
//                 console.log('error angular');
//             }
//         });
// };
// });