// var app = angular.module('main',[]);
// app.controller('newNoteCtrl', =>($scope, $http){

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
//         };
// });
//     };
// });




// // var main = angular.module("main").run(function($http,$rootScope){
// //     // if(sessionStorage.length > 0){
// //     //     $rootScope.current_user = sessionStorage.current_user;
// //     //     $rootScope.authenticated = true;
// //     // }else{
// //     //     $rootScope.authenticated = false;
// //     //     $rootScope.current_user = 'Guest';
// //     // }
    
// //     // $rootScope.signout = function(){
// //     //     $http.get('auth/signout');
// //     //     $rootScope.authenticated = false;
// //     //     $rootScope.current_user = 'Guest';
// //     //     sessionStorage.clear();
// //     // };

// // });                                                                                                     
// // // Конфигурация маршрутизации (определяем маршруты)
// // main.config([
// //     '$stateProvider', '$urlRouterProvider', '$httpProvider',
// //     function ($stateProvider, $urlRouterProvider,$rootScope) {
// //         $urlRouterProvider.otherwise('/');
// //         $stateProvider
// //             .state('home', {
// //                 url: '/',
// //                 templateUrl: 'Index.html',
// //                 caseInsensitiveMatch: true,
// //                 controller: 'MainController'
// //             })
// //             .state('contact', {
// //                 url: '/contact',
// //                 templateUrl: 'Contact.html',
// //                 caseInsensitiveMatch: true,
// //                 controller: 'MainController'
// //             })
// //             .state('about', {
// //                 url: '/about',
// //                 templateUrl: 'About.html',
// //                 caseInsensitiveMatch: true,
// //                 controller: 'MainController'
// //             })
// //             .state('login',{
// //                 url: '/login',
// //                 templateUrl: 'login.html',
// //                 caseInsensitiveMatch: true,
// //                 controller: 'AuthController'
// //             })
// //             .state('register',{
// //                 url: '/register',
// //                 templateUrl: 'register.html',
// //                 caseInsensitiveMatch: true,
// //                 controller: 'AuthController'
// //             }).state('unauth',{
// //                 url: '/unauth',
// //                 templateUrl: 'unauth.html',
// //                 caseInsensitiveMatch: true
// //             });
// //     }
// // ]);   