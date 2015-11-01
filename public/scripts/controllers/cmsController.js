var app = angular.module('cmsController', [])

  .controller('cmsCtrl', cmsCtrl);

  cmsCtrl.$inject = ['$http'];
  function cmsCtrl($http){
    var self = this;

    /////start loading all self.all $http calls, in order to load these first and have them stocked to be available for the toggle switch
    //////get all challenges
    function allChallenges(){
      $http({
        method: "GET"
        ,url: "/api/challenges"
      })
      .then(function(allChallenges){
        self.allChallenges = allChallenges.data;
        self.allMaster = allChallenges.data;
        console.log(self.allChallenges);
      })
    }

    /////load all users
    function allUsers(){
      $http({
        method: "GET"
        ,url: "/api/users"
      })
      .then(function(allUsers){
        self.allUsers = allUsers.data;
        console.log(self.allUsers);
      })
    }

    /////load all Charities
    function allCharities(){
      $http({
        method: "GET"
        ,url: "/api/charities"
      })
      .then(function(allCharities){
        self.allCharities = allCharities.data;
        console.log(self.allCharities);
      })
    }

    //////load all Reponses
    function allResponses(){
      $http({
        method: "GET"
        ,url: "/api/responses"
      })
      .then(function(allResponses){
        console.log(allResponses);
        self.allResponses = allResponses.data;
        console.log(self.allResponses);
      })
    }
    /////////run all functions on-load so that we have our self.alls loaded from the beginning
    function setInitialRepeat(){
      allChallenges();
      allUsers();
      allCharities();
      allResponses();
    }
    setInitialRepeat();
    /////end loading all self.alls on load
    /////////begin logic for toggling self.alls
    //////////////////////////////////////////


    ////////begin events related to non-all $http loads
    /////////////////////////////////
    ////////////challenges //////////

    //////show a single Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "GET"
    //     ,url: "/api/challenges/Pie-in-the-Face-Challenge"
    //   })
    //   .then(function(err, singleChallenge){
    //     if(err){console.log(err)}
    //     console.log(singleChallenge);
    //   })
    // })

    // Find One Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "POST"
    //     ,url: "/api/challenges"
    //     ,data: {title: , sponsor: "Jimmy Dean"}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    // })

    // Update One Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "POST"
    //     ,url: "/api/challenges/update"
    //     ,data: {search: {title: "Drought Bucket Challenge2"}, title: "Drought Bucket Challenge"}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    // })

    // Delete ONe Challenge
    // $('.submitCms').on('click', function(){
    //   $http({
    //     method: "DELETE"
    //     ,url: "/api/challenges/Jack's-Jumping-Challenge"
    //   })
    //   .then(function(data){
    //     console.log(data);
    //   })
    // })




    // $http({
    //   method: "GET",
    //   url: "/api/challengefriends"
    // })
    // .then(function(data){
    //   console.log(data);
    //   var allFriendsChallenges = data.data;
    //   console.log(allFriendsChallenges);
    //   for (var i = 0; i < allFriendsChallenges.length; i++) {
    //     allFriendsChallenges[i].challengeUrlToSend = "https://challengemaker.herokuapp.com/#/youvebeenchallenged/"+allFriendsChallenges[i].challenge + "/" + allFriendsChallenges[i].friendVideoUrl.split('/')[4] + "/" + allFriendsChallenges[i].senderName.split(' ').join('-');
    //     console.log(allFriendsChallenges[i]);
    //   }
    //   self.allFriendsChallenges = allFriendsChallenges
    // })

    /////check password
    // $('.pwChecker').on('click', function(){
    //   var attempt = $('.pwAttempt').val();
    //   console.log(attempt);
    //   $http({
    //     method: "POST"
    //     ,url: "/api/password"
    //     ,data: {password: attempt}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //     self.passwordCorrect = data.data.valid;
    //     if(self.passwordCorrect){
    //       $('.passwordBox').html('')
    //     }
    //   })
    // })
    // ///keypress event
    // $('.pwAttempt').keypress(function(evt){
    //   console.log(evt);
    //   var attempt = $('.pwAttempt').val();
    //   console.log(attempt);
    //   $http({
    //     method: "POST"
    //     ,url: "/api/password"
    //     ,data: {password: attempt}
    //   })
    //   .then(function(data){
    //     console.log(data);
    //     self.passwordCorrect = data.data.valid;
    //     if(self.passwordCorrect){
    //       $('.passwordBox').html('')
    //     }
    //   })
    // })



    //////////end controller
  }
