// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', ['ionic','ionic.service.core', 'ngCordova','ngCordova.plugins.file','ngCordova.plugins.file','ngCordova.plugins.camera'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        
    });
})
.config(function($provide){
 
    $provide.decorator("$exceptionHandler", function($delegate, $injector){
        return function(exception, cause){
            var $rootScope = $injector.get("$rootScope");
            //$rootScope.addError({message:"Exception", reason:exception});
            alert(exception)
            $delegate(exception, cause);
        };
    });
 
})

.controller('imageController',['$scope','$cordovaCamera','$cordovaFile','$cordovaDevice','$timeout' ,'$window', function($scope, $cordovaCamera, $cordovaFile,$cordovaDevice,$timeout, $window) {
    // 1
    $scope.log = {};
      try {
            $scope.options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
	  correctOrientation:true
    };
    }
    catch(ex)
    {
        console.log(ex);
    }
    
    document.addEventListener('deviceready', function () {
    
    
  
      
            $scope.log.cordova  = $cordovaDevice.getCordova();
            $scope.log.version =$cordovaDevice.getVersion();
            $scope.log.platform = $cordovaDevice.getPlatform();
            $scope.log.device = $cordovaDevice.getDevice();
            $scope.log.model = $cordovaDevice.getModel();
            $scope.log.uid =$cordovaDevice.getUUID();
            
      
   
    $scope.test = $cordovaCamera.getPicture();
   $scope.images = [];


    $scope.takePicture = function() {
        // 2
       var options = {
         quality : 75,
         targetWidth: 200,
         targetHeight: 200,
         sourceType: 1
      };

        // 3
        $cordovaCamera.getPicture(options).then(function(imageData) {

            // 4
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // 5
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;
                        
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                    fileEntry.copyTo(
                        fileSystem2,
                        newName,
                        onCopySuccess,
                        fail
                    );
                },
                fail);
            }

            // 6
            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    $scope.images.push(entry.nativeURL);
                });
            }

            function fail(error) {
                console.log("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function(err) {
            console.log(err);
        });
    }

    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }

    $scope.sendEmail = function() {
        // 1
        var bodyText = "<h2>Look at this images!</h2>";
        if (null != $scope.images) {
            var images = [];
            var savedImages = $scope.images;
            for (var i = 0; i < savedImages.length; i++) {
                // 2
                images.push("" + $scope.urlForImage(savedImages[i]));
                // 3
                images[i] = images[i].replace('file://', '');
            }

            // 4
            window.plugin.email.open({
                to:          ["sylwooo@dhotmail.com"], // email addresses for TO field
                cc:          Array, // email addresses for CC field
                bcc:         Array, // email addresses for BCC field
                attachments: images, // file paths or base64 data streams
                subject:    "Just some images", // subject of the email
                body:       bodyText, // email body (for HTML, set isHtml to true)
                isHtml:    true, // indicats if the body is HTML or plain text
            }, function () {
                console.log('email view dismissed');
            },
            this);
        }
    }
    })
}]);