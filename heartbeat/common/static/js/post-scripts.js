function loginUI(username) {
    $("#username").show();
    $("#username_value").html(username);
    $("#logout").show();
    $("#login").hide();
    $("#username_login").hide()
        $("#register").hide();
    $("#username_log").val("");
    $("#password_log").val("");
}
function updateLink(id) {
    var field = $("#username_value");
    $("#username_value").click(function() {
            $("#content").load("/artists/" + id + "/");
        });
}
function showError(error) {
    $("#error_login").html(error);
}

function logout(token) {
    var data = "csrfmiddlewaretoken=" + token;
    $.ajax({
            type: "POST",
                url: "/users/logout/",
                data: data,
                complete: function(a, b) {
                console.log(a);
                console.log(b);
            },
                success: function(msg) {
                $("#content").load(document.location['pathname']);
                $("#username").hide();
                $("#username_value").html();
                $("#logout").hide();
                $("#login").show();
                $("#username_login").show();
                $("#register").show();

            }

        });

}

function login(data, errorLoc) {
    $.ajax({
            type: "POST",
                complete: function(a, b) {
                console.log(a);
                console.log(b);
            },
                url: "/users/login/",
                data: data,
                success: function(msg) {
                var username = msg["username"];
                var artistId = msg["artistId"];
                if (username != null) {
                    loginUI(username);
                } else {
                    errorLoc.html(msg['error']);
                }
                if (artistId >= 0) {
                    updateLink(artistId);
                }
                if (username != null) {
                    if (artistId >= 0 && document.location['pathname'] == '/users/') {
                        loadPage("/artists/" + artistId + "/");
                    } else {
                        $("#content").load(document.location['pathname']);
                    }
                }
            },
                });
}


$("#login_form").live("click", function() {
        var data = "username=" + $("#id_username").val() + "&password=" + $("#id_password").val() + "&csrfmiddlewaretoken=" + $("#content").find("input[name=csrfmiddlewaretoken]").val();
        console.log("what?");
        console.log(data);
        login(data, $("#login_form_error"));
    });
$('#login_button').live("click", function() {
        var data = "username=" + $("#username_log").val() + "&password=" + $("#password_log").val() + "&csrfmiddlewaretoken=" + $("#dropdown-menu").find("input[name=csrfmiddlewaretoken]").val();
        console.log("Hey");
        console.log(data);
        login(data, $("#error_login"));
    });

$('#register_button').live("click", function() {
        var data = "username=" + $("#id_username").val()
            + "&password1=" + $("#id_password1").val()
            + "&password2=" + $("#id_password2").val()
            + "&email=" + $("#id_email").val()
            + "&csrfmiddlewaretoken=" + $("[name=csrfmiddlewaretoken]").val();
        register(data);
    });
function register(data) {
    $.ajax({
            type: "POST",
                complete: function(a, b) {
                console.log(a);
                console.log(b);
            },
                url: "/users/register/",
                data: data,
                success: function(msg) {
                var username = msg["username"];
                var errors = msg["errors"];
                if (username != null) {
                    loginUI(username);
                } else {
                    var div = $("#errors");
                    $("#errors").html(errors);
                }

                if (username != null) {
                    loadPage("/");
                }
            }
        });        
}
function showRequest(formData, jqForm, options) {

    console.log("Request");
    console.log(formData);
    console.log(jqForm);
    console.log(options);
}
function albumSaved(responseText, statusText, xhr, form) {
    if (responseText['success'] == "true") {
        loadPage("/artists/" + responseText["artist_id"] + "/");
    } else {
        $("#errors").html(responseText["errors"]);
    }
    console.log("Response");
    console.log(responseText);
    console.log(statusText);
}
$("#song_submit").live("click", function() {
        var counter = 0;
        $('.song').each(function() {
                if (this.id != "management") {
                    if ($(this).find("[id$='name']").val() != ""
                        && ($(this).find("[id$='download_link']").val() != ""
                            || $(this).find('a').length > 0)) {
                        counter++;
                    } 
                }
            });
        $('#id_song-TOTAL_FORMS').val(counter);
        for (var i = 0; i < counter; i++) {
            $("#id_song-" + i + "-track_num").val(i+1);
        }

        var artist_id = $("#artist_id").val();
        var album_id = $("#album_id").val();
        if (! (/^\d+$/.test(album_id))) {
            album_id = -1;
        }
        var url = "";
        if (album_id != -1) {
            url =  "/artists/" + artist_id + "/albums/edit/" + album_id + "/";
        } else {
            url = "/artists/" + artist_id + "/";
        }
        var options = {
            url:url,
            dataType:'json',
            beforeSubmit: showRequest,
            success: albumSaved
        };
        var form = $("#album_form");
        $("#album_form").ajaxSubmit(options);
    });
function tourSaved(response, status, xhr, form) {
    var success = response['success'];
    var errors = response['errors'];
    if (success == "true") {
        loadPage("/artists/" + response["artist_id"] + "/");
    } else {
        $("#errors").html(errors);
    }
    console.log(response);
    console.log(status);
    console.log(xhr);

}
$("#tour_submit").live("click", function() {
        var counter = 0;
        $('.concert').each(function() {
                if ($(this).find("[id$='venue']").val() != ""
                    && $(this).find("[id$='address']").val() != ""
                    && $(this).find("[id$='city']").val() != ""
                    && $(this).find("[id$='state']").val() != ""
                    && $(this).find("[id$='country']").val() != ""
                    && ($(this).find("[id$='icon']").val() != ""
                        || $(this).find('a').length > 0)
                    && $(this).find("[id$='date']").val() != ""
                    && $(this).find("[id$='time']").val() != "") {
                    counter++;
                } 
            });
        $('#id_concert-TOTAL_FORMS').val(counter);

        var artist_id = $("#artist_id").val();
        var tour_id = $("#tour_id").val();
        if (! (/^\d+$/.test(tour_id))) {
            tour_id = -1;
        }
        var url = "";
        if (tour_id != -1) {
            url =  "/artists/" + artist_id + "/tours/edit/" + tour_id + "/";
        } else {
            url = "/artists/" + artist_id + "/";
        }
        var options = {
            url:url,
            dataType:'json',
            beforeSubmit: showRequest,
            success: tourSaved
        };
        var form = $("#tour_form");
        $("#tour_form").ajaxSubmit(options);
    });