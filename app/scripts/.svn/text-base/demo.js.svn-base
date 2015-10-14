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
            if (this.checkSimulator()){
                key = "rpw01";
                this.invokeApi();
            } else {
                cordova.plugins.barcodeScanner.scan(

                    // success callback function
                    function (result) {
                        // wrapping in a timeout so the dialog doesn't free the app
                        key = result.text;
                        var r = confirm("Attach an image for " + key + "?");
                        if (r == true) {
                            x = "You pressed OK!";
                        } else {
                            x = "You pressed Cancel!";
                        }
                        setTimeout(function() {
                            alert("Now go and invoke the api.");                            
                        }, 0);
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
                var itemCode = "rpw01";
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
                    for (var i = data.length - 1; i >= 0; i--) {
                        $('#itemcode').text(data[i].itemCode);
                        $('#itemdesc').text(data[i].description);
                        console.log(data[i].itemCode);
                        console.log(data[i].description);
                        //console.log(data[i].salesOrderNumber);
                        //console.log(data[i].soldToCustomerCode);
                        //console.log(data[i].text);
                        //data[i].user = data[i].text.substring(28,31);
                        //data[i].action = data[i].text.substring(38);
                    }
                });
        }
    });

    app.demoService = {
        viewModel: new DemoViewModel()
    };
})(window);