(function (global) {
    var DemoViewModel,
        app = global.app = global.app || {};

    DemoViewModel = kendo.data.ObservableObject.extend({

        scanBack: function () {
            this.scan(false, false);
        },

        scanBackFlip: function () {
            this.scan(false, true);
        },

        scanFront: function () {
            this.scan(true, false);
        },

        scanFrontFlip: function () {
            this.scan(true, true);
        },

        scan: function (preferFrontCamera, showFlipCameraButton) {
            that=this;

            if (this.checkSimulator()){
                itemCode = "rpw01";
                that.invokeApi();
            } else {
                cordova.plugins.barcodeScanner.scan(

                    // success callback function
                    function (result) {
                        // wrapping in a timeout so the dialog doesn't free the app
                        itemCode = result.text;
                        that.invokeApi();
/*
                        var r = confirm("Attach an image for " + key + "?");
                        if (r == true) {
                            x = "You pressed OK!";
                        } else {
                            x = "You pressed Cancel!";
                        }
                        setTimeout(function() {
                            alert("Now go and invoke the api.");                            
                        }, 0);
*/
                    },
                    // error callback function
                    function (error) {
                        alert("Scanning failed: " + error);
                    },
                    
                    // options objects
                    {
                        "preferFrontCamera" : preferFrontCamera, // default false
                        "showFlipCameraButton" : showFlipCameraButton // default false
                    }
                );
            }
        },

        attach: function () {
            alert('About to attach picture for:' + itemCode);

            var success = function (fileURI) {
                navigator.notification.confirm("FileURI:" + fileURI);
                window.resolveLocalFileSystemURI(
                        fileURI, 
                        function(fileEntry){
                            console.log(fileEntry);
                            navigator.notification.confirm("Before Creating File to attach");
                            fileEntry.file(
                                function(file) {
                                    var fileToAttach = file;    
                                    var fileName = fileToAttach.name;
                                    navigator.notification.confirm("After Creating File to attach");
                                    var attachDS = new kendo.data.DataSource({
                                        transport: {
                                            read: {
                                                // the remote service url
                                                url: "https://yab.qad.com/hackathon/api/qracore/fileAttachment?objectId=urn%3Abe%3Acom.qad.base.item.IItem%3A10USA." + itemCode + "&name=MobileUpload-" + fileName,
                                                // the request type
                                                type: "post",
                                                contentType : 'application/octet-stream',
                                                processData : false,
                                                cache : false,
                                                data : fileToAttach,
                                                // Set authorization header
                                                beforeSend: function (xhr) {
                                                    xhr.setRequestHeader('Authorization', 'Basic bWZnOgo=');
                                                    //xhr.setRequestHeader('objectId','urn:be:com.qad.base.item.IItem:10USA.rpw01')
                                                    //xhr.setRequestHeader('pluginName','qad-erp-base')

                                                },
                                                // the data type of the returned result
                                                dataType: "json",
                                                success : function(data) {
                                                    navigator.notification.confirm("AttachDS success");
                                                },
                                                error : function(xhr, statusText, error) {
                                                    navigator.notification.confirm("AttachDS error: " + error);
                                                }
                                            }
                                        },
                                        // describe the result format
                                        schema: {
                                            // the data, which the data source will be bound to is in the "list" field of the response
                                            data: "data"
                                        }
                                    });
                                    //attachDS.add(fileToAttach);
                                    //attachDS.sync(function () {
                                    attachDS.fetch(function () {
                                        var data2 = this.data();
                                        navigator.notification.confirm("AttachDS fetch complete");
                                        for (var i = data2.length - 1; i >= 0; i--) {
                                            console.log(data2[i].text);
                                        };
                                    }); 
                                }, 
                                function(e){
                                    console.log(e);
                                    navigator.notification.confirm("Error in fileEntry.file: " + e);
                            });
                        },
                        function(e){
                            console.log(e);
                            navigator.notification.confirm("Error in resolveLocalFileSystemURI: " + e);
                        }
                );
            };
            var error = function () {
                navigator.notification.alert("Unfortunately we could not add the image");
            };
            var config = {
                destinationType: 1,//Camera.DestinationType.FILE_URI,
                targetHeight: 400,
                targetWidth: 400
            };
            navigator.camera.getPicture(success, error, config);

        },

        encode: function () {
            if (!this.checkSimulator()) {
                cordova.plugins.barcodeScanner.encode(

                    // pick one of TEXT_TYPE / EMAIL_TYPE / PHONE_TYPE / SMS_TYPE
                    cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,

                    // the thing to encode - for a link use TEXT_TYPE above
                    "http://www.telerik.com",

                    // success callback (will currently not be invoked)
                    function (result) {
                        alert("Encoding succeeded: " + result);
                    },

                    // error callback
                    function (error) {
                        alert("Encoding failed: " + error);
                    }
                );
            }
        },

        checkSimulator: function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.cordova === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        },

        invokeApi: function() {
                var itemDS = new kendo.data.DataSource({
                    transport: {
                        read: {
                            // the remote service url
                            //url: "https://yab.qad.com/hackathon/api/qracore/inboxdata",
                            //url: "https://yab.qad.com/hackathon/api/erp/salesOrders?salesOrderNumber=AUTO1&domainCode=10USA",
                            url: "https://yab.qad.com/hackathon/api/erp/items?domainCode=10USA&itemCode=" + itemCode,
                            // the request type
                            type: "get",
                            // Set authorization header
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Basic bWZnOgo=');
                            },
                            // the data type of the returned result
                            dataType: "json",
                        }
                    },
                    // describe the result format
                    schema: {
                        // the data, which the data source will be bound to is in the "list" field of the response
                        //data: "data.domainNotifications[0].notifications"
                        //data: "data.salesOrders"
                        data: "data.items"
                    }
                });
                itemDS.fetch(function () {
                    var data = this.data();
                    $('#itemcode').text(data[0].itemCode);
                    $('#itemdesc').text(data[0].description);
                    $('#productLine').text(data[0].productLine);
                    $('#itemStatus').text(data[0].itemStatus);
                });
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);