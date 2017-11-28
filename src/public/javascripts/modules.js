const app = angular.module('myApp', []); //eslint-disable-line

app.controller('mainCtrl', ($scope, $http) => {
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
});

app.controller('saveCtrl', ($scope, $http, $filter) => {
  $scope.create = () => {
    const date = new Date();
    let col = document.getElementsByName('color')[0].value; //eslint-disable-line
    $http({
      method: 'post',
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
        $scope.textarea = '';
        col = null;
      },
      response => {
        console.log(response.statusText);//eslint-disable-line
      }
    );
  };
});
