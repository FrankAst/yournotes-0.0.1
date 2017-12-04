const app = angular.module('myApp', ['ui.bootstrap.modal']); //eslint-disable-line

const insertHtml = (element, html, $scope, $compile) => {
  const compiledElement = $compile(html)($scope);
  element.empty();
  element.append(compiledElement);
};

app.controller('mainCtrl', ($scope, $http, $filter, $compile) => {
  $scope.toggle = true;
  $scope.isFormShow = false;
  $scope.isPickerShow = false;
  $scope.showForm = () => {
    if ($scope.isPickerShow === true) $scope.isPickerShow = false;
    $scope.isFormShow = !$scope.isFormShow;
  };

  $scope.showPicker = () => {
    $scope.isPickerShow = !$scope.isPickerShow;
  };

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
        const pageElement = angular.element(document.getElementById('nav')); //eslint-disable-line
        const html = `
        <h3>Привет, ${response.data.local.name}</h3>
        <button ng-click="openContactModal()">Contact us</button>
                         <button ng-click="sortAsc()">Earliest</button>
                         <button ng-click="sortDesc()">Latest</button>
                         <button ng-click="logout()">Log out</button>`;
        insertHtml(pageElement, html, $scope, $compile);
        console.dir(response);
      },
      response => {//eslint-disable-line
        // console.log(response.statusText);//eslint-disable-line
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
    let { content, title } = $scope;
    if (content === '') content = 'Empty content';
    if (title === '') title = 'Empty title';
    $http({
      method: 'POST',
      url: '/notes',
      data: {
        content,
        color: col,
        title,
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
        console.log(response.data);
      }
    );
  };

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
