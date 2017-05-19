/*global Blob*/
/*global atob*/

var SCOPE = {
    scope: "publish_actions,public_profile,email,user_birthday,gender"
};
var BASIC_INF = 'id,name,email,birthday,gender,cover,picture';

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {
        type: 'image/png'
    });
}



function NewFeedBuilder() {
    this.tile = "Moonlight Game";
    this.message = "Play with me";
    this.link = "https://ec2-34-209-82-231.us-west-2.compute.amazonaws.com/moonlight/index.html";
    var _this = this;
    this.setTitle = function(v) {
        _this.tile = v;
        return _this;
    };
    this.setMessage = function(v) {
        _this.message = v;
        return _this;
    };
    this.setLink = function(v) {
        _this.link = v;
        return _this;
    };

}


function postImageToFacebook(token, filename, mimeType, imageData, feed, onSuccess, onFail) {
    var fd = new FormData();
    fd.append("access_token", token);
    fd.append("source", imageData);
    fd.append("no_story", true);

    // Upload image to facebook without story(post to feed)
    $.ajax({
        url: "https://graph.facebook.com/me/photos?access_token=" + token,
        type: "POST",
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function(data) {
            console.log("success: ", data);

            // Get image source url
            FB.api(
                "/" + data.id + "?fields=images",
                function(response) {
                    if (response && !response.error) {
                        //console.log(response.images[0].source);

                        // Create facebook post using image
                        FB.api(
                            "/me/feed",
                            "POST", {
                                "message": feed.message,
                                "picture": response.images[0].source,
                                "link": feed.link,
                                "name": feed.title,
                                "description": feed.message,
                                "privacy": {
                                    value: 'EVERYONE'
                                }
                            },
                            function(response) {
                                if (response && !response.error) {
                                    /* handle the result */
                                    // console.log("Posted story to facebook");
                                    // console.log(response);
                                    if (onSuccess) onSuccess(response);
                                }
                                else
                                if (onFail) onFail(response);
                            }
                        );
                    }
                }
            );
        },
        error: function(shr, status, data) {
            console.log("error " + data + " Status " + shr.status);
        },
        complete: function(data) {
            //console.log('Post to facebook Complete');
        }
    });
}

function shareCanvas(idName, feed, onSuccess, onFail) {
    var blob;
    var data = document.getElementById(idName).toDataURL("image/png");
    try {
        blob = dataURItoBlob(data);
    }
    catch (e) {
        console.log(e);
    }
    FB.getLoginStatus(function(response) {
        // console.log(response);
        if (response.status === "connected") {
            postImageToFacebook(response.authResponse.accessToken,
                "Canvas".concat(Math.random()), "image/png", blob, feed, onSuccess, onFail);
        }
        else if (response.status === "not_authorized") {
            FB.login(function(response) {
                postImageToFacebook(response.authResponse.accessToken,
                   "Canvas".concat(Math.random()), "image/png", blob, feed, onSuccess, onFail);
            }, {
                scope: "publish_actions"
            });
        }
        else {
            FB.login(function(response) {
                postImageToFacebook(response.authResponse.accessToken, "Canvas to Facebook/Twitter", "image/png", blob,feed, onSuccess, onFail);
            }, {
                scope: "publish_actions"
            });
        }
    });
}


function getFacebookInf(onSuccess) {
    FB.getLoginStatus(function(response) {
        if (response.status === "connected") {
            FB.api('/me?access_token='+response.authResponse.accessToken+'&fields=' + BASIC_INF, onSuccess);
        }
        else if (response.status === "not_authorized") {
            FB.login(function(response) {
                FB.api('/me?access_token='+response.authResponse.accessToken+'&fields=' + BASIC_INF, onSuccess);
            }, SCOPE);
        }
        else {
            FB.api('/me?access_token='+response.authResponse.accessToken+'&fields=' + BASIC_INF, onSuccess);
        }
    });
}


// function getFacebookInf(onSuccess) {
//     var res = {
//         email: "blueskythien2010@yahoo.com.vn",
//         birthday: "01/14/1990",
//         id: "804679229709679",
//         gender: "male"
//     };
//     onSuccess(res);
// }
