(function () {
    var everlive = new Everlive("AHOGWgp7FXpE6abZ");
    var inboxDS = new kendo.data.DataSource({
        transport: {
            read: {
                // the remote service url
                url: "https://yab.qad.com/hackathon/api/qracore/inboxdata",
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
            data: "data.domainNotifications[0].notifications"
        }
    });
    document.addEventListener("deviceready", function () {
        window.listview = kendo.observable({
            addImage: function () {
                var success = function (data) {
                    everlive.Files.create({
                        Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                        ContentType: "image/jpeg",
                        base64: data
                    }).then(loadPhotos);
                };
                var error = function () {
                    navigator.notification.alert("Unfortunately we could not add the image");
                };
                var config = {
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetHeight: 400,
                    targetWidth: 400
                };
                navigator.camera.getPicture(success, error, config);
            },
            runAPI: function () {
                inboxDS.fetch(function () {
                    var data = this.data();
                    for (var i = data.length - 1; i >= 0; i--) {
                        console.log(data[i].text);
                        data[i].user = data[i].text.substring(28,31);
                        data[i].action = data[i].text.substring(38);
                    }
                    $("#images").kendoMobileListView({
                        dataSource: data,
                        template: "<p><strong>#:urlText#</strong> - <strong>#:user#</strong> - #:action#</p>"
                    });
                });
            }
        });
        var app = new kendo.mobile.Application(document.body, {
            skin: "nova"
        });

        function loadPhotos() {
            everlive.Files.get().then(function (data) {
                var files = [];
                for (var i = data.result.length - 1; i >= 0; i--) {
                    var image = data.result[i];
                    files.push(image.Uri);
                }
                $("#images").kendoMobileListView({
                    dataSource: files,
                    template: "<img src='#: data #'>"
                });
            });
        }
        loadPhotos();
        navigator.splashscreen.hide();
    });
}());