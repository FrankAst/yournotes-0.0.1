const app = angular.module('myApp', ['ui.bootstrap.modal']); //eslint-disable-line

app.controller('mainCtrl', ($scope, $http, $filter) => {
  $scope.toggle = true;

  $scope.sortDesc = () => {
    $scope.toggle = true;
  };

  $scope.sortAsc = () => {
    $scope.toggle = false;
  };

  $scope.openLoginModal = () => {
    $scope.showLoginForm = true;
  };

  $scope.closeLoginForm = () => {
    $scope.showLoginForm = false;
  };

  $scope.openContactModal = () => {
    $scope.showContactForm = true;
  };

  $scope.closeContactForm = () => {
    $scope.showContactForm = false;
  };

  $scope.remove = currentID => {
    $http.delete('/notes', { params: { id: currentID } }).then(
      () => {
        $scope.notes = $scope.notes.filter(note => {
          return note._id !== currentID;
        });
      },
      () => {
        console.log('did not removed'); //eslint-disable-line
      }
    );
  };

  $scope.create = () => {
    const date = new Date();
    let col = document.getElementsByName('color')[0].value; //eslint-disable-line
    $http({
      method: 'POST',
      url: '/notes',
      data: {
        content: $scope.content,
        color: col,
        title: $scope.title,
        date: $filter('date')(date, 'HH:mm | dd.MM.yyyy'),
      },
    }).then(
      response => {
        $scope.notes.push(response.data);
        $scope.content = '';
        $scope.title = '';
        col = null;
      },
      response => {
        console.log(response.statusText);//eslint-disable-line
      }
    );
  };
});

app.controller('contactUsCtrl', ($scope, $http) => {
  $scope.sendMail = () => {
    $http({
      method: 'POST',
      url: '/mail',
      data: {
        email: $scope.email_mail,
        name: $scope.name_mail,
        message: $scope.message_mail,
      },
    }).then(
      response => { //eslint-disable-line
        console.log('alallaalal send mail');
      },
      response => {
        console.log(response.statusText);//eslint-disable-line
      }
    );
  };
});

app.controller('loginCtrl', ($scope, $http) => {
  $scope.login = () => {
    $http({
      method: 'POST',
      url: '/login',
      data: {
        email: $scope.email,
        password: $scope.password,
      },
    }).then(
      response => {
        const userState = angular.element(document.querySelector('#nav')); //eslint-disable-line
        userState.html(`<h3>${response.data.local.name}</h3>`);
         console.log(response.data.local.email); //eslint-disable-line
      },
      response => {
        console.log(response.statusText);//eslint-disable-line
      }
    );
  };

  $scope.fblogin = () => {};

  $scope.signup = () => {
    $http({
      method: 'POST',
      url: '/signup',
      data: {
        email: $scope.email_reg,
        password: $scope.password_reg,
        name: $scope.name_reg,
      },
    }).then(
      response => {
         console.log(response.data); //eslint-disable-line
      },
      response => {
        console.log(response.statusText);//eslint-disable-line
      }
    );
  };
});
