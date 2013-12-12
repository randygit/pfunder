
angular.module('mean.contacts').controller('ContactController', ['$scope', '$location','$route', 'Global', '$window','$http','$modal', function ($scope, $location, $route, Global, $window, $http, $modal ) {
   
    // initialization
    $scope.headers = ["name", "phone", "email", ""];
    $scope.form = {};
    $scope.columnSort = { sortColumn: 'name', reverse: false };

    console.log('Intializing...');

    $scope.window = $window;
    $scope.global = Global;  

    console.log('getting list of contacts');

    $http.get('/api/contacts').
      success(function(data, status, headers, config) {
          //console.log(JSON.stringify(data));
          $scope.contacts = data;
    });


    $scope.view = function(id) { 
        console.log('Inside View function ' + id);
        var allheaders = ["name", "phone", "email", "facebook", "twitter", "skype"]; 
        $http.get('/api/contact/' + id).
            success(function(data, status, headers, config) {
                if (data.status) {
                    console.log('contact' + JSON.stringify(data.contact));
                    $scope.contact = data.contact;

                    $modal.open({
                        templateUrl: '/views/contacts/partials/viewContact.html',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: viewContactCtrl,
                        resolve: {
                            contact: function() {
                                return data.contact;
                            } 
                        }
                    });   // $modal.open
                } else {
                    $location.path('/');
                }
            });
    };

    var viewContactCtrl = function($scope, $modalInstance, contact ) { 

        console.log('inside viewContactCtrl ' + JSON.stringify(contact));
        $scope.contact = contact;
        $scope.allheaders = ["name", "phone", "email", "facebook", "twitter", "skype"];

        $scope.closeView = function() {
            $modalInstance.dismiss('cancel');
        };

    };
 

    $scope.add = function() {
        console.log('Inside Add function');

        var modalInstance = $modal.open({
            templateUrl: '/views/contacts/partials/addContact.html',
            backdrop: true,
            windowClass: 'modal',
            controller: addContactCtrl,
            resolve: {
                contact: function() {
                    return $scope.form.add;
                } 
            }
        });   // $modal.open

        modalInstance.result.then(function(contact) {
            console.log('Result ' + JSON.stringify(contact));
            // save data here
            if (contact) {
                console.log('Some data to save'); 

                // will force api/contact to redirect
                $http.post('/api/contact', contact).success(function(data) {
  
                    console.log("Success. addint record at /api/contact");
                    $route.reload(); 
                })
                .error(function(data) {
                    console.log("Error. adding record at /api/contact");
                    $scope.window.location = '/'; 
                });
            }
            else {
                console.log('No data to save');
                $scope.window.location = '/';
            }
        });
    };

    var addContactCtrl = function($scope, $modalInstance, contact ) { 

        console.log('inside addContactCtrl '); 
        // $scope.form.add = contact;

        $scope.addContact = function (contact) {
            console.log('inside addContact()');
            console.log('AddContact ' + JSON.stringify(contact));
            $modalInstance.close(contact); 
        };

        $scope.closeAdd = function() {
            console.log('inside closeContact()');
            $modalInstance.dismiss('cancel');
            // save data
        };

    };
 

    $scope.edit = function(id, name) { 
        console.log('Inside Edit function ' + name+ " id " + id);
        // read data first
        $http.get('/api/contact/' + id).
            success(function(data, status, headers, config) {
                if (data.status) {
                    console.log('contact' + JSON.stringify(data.contact));
                    $scope.contact = data.contact;

                    var modalInstance = $modal.open({
                        templateUrl: '/views/contacts/partials/editContact.html',
                        backdrop: true,
                        windowClass: 'modal',
                        controller: editContactCtrl,
                        resolve: {
                            contact: function() {
                                return data.contact;
                            } 
                        }
                    });   // $modal.open
              
                    // wait for result and save data

                    modalInstance.result.then(function(contact) {
                        console.log('Result ' + JSON.stringify(contact));
                        console.log('Key ' + contact._id);
                        // save data here
                        if (contact) {
                            console.log('Some data to save'); 
                          
                            // will force api/contact to redirect
                            $http.put('/api/contact/'+contact._id, contact).success(function(data) {
              
                                console.log("Success. updating record at /api/contact"); 
                                $route.reload();
                            })
                            .error(function(data) {
                                console.log("Error. adding record at /api/contact");
                                $scope.window.location = '/'; 
                            });
                            
                        }
                        else {
                            console.log('No data to save');
                            $scope.window.location = '/contact';
                        }
                    });

                } else {
                    $scope.window.location('/');
                }
            });

    };
    

    var editContactCtrl = function($scope, $modalInstance, contact ) { 

        console.log('inside editContactCtrl ' + JSON.stringify(contact)); 
        $scope.edit = contact;

        // data is returned through contact variable
        $scope.editContact = function (contact) {
            console.log('inside editContact()');
            console.log('EDitContact ' + JSON.stringify(contact));
            $modalInstance.close(contact); 
        };

        $scope.closeEdit = function() {
            console.log('inside closeEdit()');
            $modalInstance.dismiss('cancel');
            // save data
        };

    };


    $scope.delete = function(id, name) { 
        console.log('Inside delete function ' + name+ " id " + id);
        // read data first
        var contactDetails = {
            id: String,
            name: String
        };

        contactDetails.id = id;
        contactDetails.name = name;

        console.log('About to open modal delete');

        var modalInstance = $modal.open({
            templateUrl: '/views/contacts/partials/deleteContact.html',
            backdrop: true,
            windowClass: 'modal',
            controller: deleteContactCtrl,
            resolve: {
                contactInfo: function() {
                    return contactDetails;
                } 
            }
        });  

        modalInstance.result.then(function(contactInfo) {
            console.log('Result ' + JSON.stringify(contactInfo));
            console.log('Key ' + contactInfo.id);
            // save data here
            if (contactInfo) {
                console.log('Some data to delete'); 
              
                // will force api/contact to redirect
                $http.delete('/api/contact/'+contactInfo.id).success(function(data) {
  
                    console.log("Success. deleting record at /api/contact");
                    $route.reload(); 
                })
                .error(function(data) {
                    console.log("Error. deleting record at /api/contact");
                    $scope.window.location = '/'; 
                });
                
            }
            else {
                console.log('No data to delete');
                $scope.window.location = '/contact';
            }
        });  
              
       
    };
    

    var deleteContactCtrl = function($scope, $modalInstance, contactInfo ) { 

        console.log('inside deleteContactCtrl ' + JSON.stringify(contactInfo)); 
        $scope.delete = contactInfo;

        // data is returned through contact variable
        $scope.deleteContact = function () {
            console.log('inside deleteContact()'); 
            $modalInstance.close(contactInfo); 
        };

        $scope.closeDelete = function() {
            console.log('inside closeDelete)');
            $modalInstance.dismiss('cancel');
            // save data
        };

    };

     
    
   
    $scope.opts = {
        backdropFade: true,
        dialogFade: true
    };
         
}]);



