var app = angular.module('messagesController', [])

  .controller('messagesCtrl', messagesCtrl)


  messagesCtrl.$inject = ['$http']
  function messagesCtrl($http){
    console.log('yo dog');

    var name = window.location.hash.split('/')[2].split('-').join(' ');
    console.log(name);
    $http({
      method: "GET"
      ,url: "/api/messages/"+name
    })
    .then(function(data){
      console.log(data);
    })
  }
