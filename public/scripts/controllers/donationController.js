angular.module('donationController', [])

  .controller('donationCtrl', donationCtrl)

  donationCtrl.$inject = ['$http']
  function donationCtrl($http){
  //////////////////////////////////
  /////////begin donation controller
    var self = this
    self.jimmysMessage = "Boom!"//////our test messge in the upper right, for sanity-check purposes (you see the handlebars, the angular is out)

    /////////////////////////////////////////////////////////////////////////
    ///////////begin button logic for the challenge path forward-back buttons

    $("#submitPayment").on('click', function(){
      $('.paymentContainer').animate({
        marginLeft: "-500px"
        ,opacity: 0
      })
    })

    ///////////////end logic for forward and back button in the challenge path
    //////////////////////////////////////////////////////////////////////////


  ///////end of the the Donation Controller
  /////////////////////////////////////////
  }
