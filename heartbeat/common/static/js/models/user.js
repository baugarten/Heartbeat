define([
    'jquery',
    'backbone',
    'underscore',
    'vent',
    'jquery.cookie',
], function ($, Backbone, _, vent) {
    var User = Backbone.Model.extend({
        defaults: {
            username: "",
            loggedin: void 0,
            is_artist: false,
            error: "",
            artist_id: -1,
            artist: "",
            csrf_token: "",
            checked: false,
        },
        initialize: function() {
            _.bindAll(this, 'logIn', 'loggedIn', 'artist_id', 'follow');
            vent.bind('follow', this.follow);
            if ($.cookie("user")) {
              this.set({ loggedin: $.cookie("user") > 0,
                is_artist: $.cookie("artist_id") >= 0,
                artist_id: $.cookie("artist_id"),
                username: $.cookie("username"),
              });
            } else {
              this.checkLoggedIn();
            }
        },
        follow: function(artist_id) {
          if (!this.loggedIn()) {
            // must be logged in
            return;
          } 
          var id = this.get("id");
          /*$.ajax({
            type: 'POST',
            url: '/api/users/follow/',
            dataType: "json",
            data: {
              profile: id,
              artist: artist_id,
            },
            beforeSend: function(a,b,c) {
              console.log(a);
              console.log(b);
              console.log(c);
                        },
            success: function(a, b, c) {
              console.log(a);
              console.log(b);
              console.log(c);
            },
            error: function(a, b, c) {
              console.log(a);
              console.log(b);
              console.log(c);

            },
          });*/
        },
        logIn: function(response, status, xhr, form) {
          if (response['status'] != "ERROR") {
            console.log("LOGIN");
            console.log(response);
            this.set({ loggedin: response["id"] > 0,
              id: response['id'],
              is_artist: response["artist_id"] >= 0,
              artist: response["artist"],
              artist_id: response["artist_id"],
              username: response["username"],
            });
            this.trigger("login");
          }
          return true
        },
        logOut: function() {
            var data = "csrfmiddlewaretoken=" + this.get("csrf_token");
            data += "&username=" + this.get("username");
            $.ajax({
                type: "GET",
                url: "/api/users/profile/logout",
                data: data,
                complete: function(a, b) {
                    console.log(a);
                    console.log(b);
                },
            });
            this.set({
                username: "",
                loggedin: false,
                isArtist: false,
                artist_id: -1,
                error: "",
            });
            this.trigger("logout");
        },
        artist_id: function() {
          return this.get('artist_id');
        },
        loggedIn: function() {
          return this.get("loggedin");
        },
        whenLoggedIn: function(callback) {
          if (this.get("checked")) {
            callback(this.get("loggedin"));
          } else {
            var that = this;
            this.on("loggedin", function() { callback(that.get('loggedin')); });
          }
        },
        checkLoggedIn: function() {
          var that = this;
          $.ajax({
            type: "GET",
            url: "/accounts/loggedin/",
            beforeSend: function(xhr) {
              console.log(xhr);
            },
            success: function(response, status, xhr, form) {
              if (response['status'] != "ERROR") {
                console.log(response);
                that.logIn(response, status, xhr, form);
              } else {
                that.set({ 'loggedin': false });
              }
              that.set({"checked": true });
              that.trigger("loggedin");
            },
            error: function() {
              that.trigger("loggedin");
            },
          }); 
        },
  });
  return User;
});
