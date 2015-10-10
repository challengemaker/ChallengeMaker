angular.module('mainController', [])

  .controller('mainCtrl', mainCtrl);

  function mainCtrl($http){
    var self = this;

    self.firstData = "hi there everyone";

    $http.get('/api/users')

      .then(function(data){
        console.log(data);
        self.name = data.data.name;
      })

  }
