define([
    'jquery',
    'backbone',
    'underscore',
    'vent',
    'follow',
    'util',
    'jquery.cookie',
], function ($, Backbone, _, vent, Follow, util) {
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
            following: {},
        },
        initialize: function() {
            _.bindAll(this, 'logIn', 'loggedIn', 'artist_id', 'follow', 'unfollow', 'follows');
            vent.bind('follow', this.follow);
            vent.bind('unfollow', this.unfollow);
            if ($.cookie("user")) {
              this.set({ loggedin: $.cookie("user") > 0,
                id: $.cookie("user"),
                is_artist: $.cookie("artist_id") >= 0,
                artist_id: $.cookie("artist_id"),
                username: $.cookie("username"),
              });
            } else {
              this.checkLoggedIn();
            }
        },
        follow: function(artist_id, trycount) {
          if (!trycount) { trycount = 0; }
          else if (trycount > 3) {
            this.trigger("followerror", artist_id, true);
          }
          if (!this.loggedIn()) {
            Backbone.history.navigate("/accounts/login/", { trigger: true });
            return;
          } 
          var id = this.get("id");
          var follow = new Follow();
          var that = this;
          follow.url = "/api/users/follow/";
          follow.save({
            profile: "/api/users/users/" + id + "/",
            artist: "/api/users/artist/" + artist_id + "/",
            autoGenerated: false,
          }, {
            success: function(a,b,c) {
              var newhash = that.get('following');
              var idarr = a['id'].split('/');
              newhash[artist_id] = idarr[idarr.length-2];
              that.set({ 'following': newhash });
            },
            error: function(a,b,c) {
              that.follow(artist_id, trycount + 1);
            },
          });
        },
        unfollow: function(artist_id) {
          if (!this.loggedIn()) {
            Backbone.history.navigate("/accounts/login/", { trigger: true });
            return;
          }
          var that = this;
          var id = this.get("following")[artist_id];
          var follow = new Follow({id: id});
          follow.id = id;
          follow.destroy({
            success: function() { 
              var newfollows = $.grep(that.get('following'), function(value) { 
                return value != artist_id; 
              }) 
              that.set({'following': newfollows });
            },
            error: function() { vent.trigger("didfollow", [artist_id], {error: true}); },
          });
        },
        logIn: function(response, status, xhr, form) {
          if (response['status'] != "ERROR") {
            var artist_id = -1;
            if (response['artist_id']) { 
              artist_id = parseInt(util.idFromUri(response['artist_id'])); 
            }
            this.set({ loggedin: response["id"] > 0,
              id: response['id'],
              is_artist: artist_id >= 0,
              artist_id: artist_id,
              username: response["username"],
              email: response["email"],
              following: this.parseFollows(response["follows"]),
              is_staff: response["is_staff"] || response["is_superuser"],
            });
            vent.trigger("login", this);
            this.trigger("didfollow", this.get("following"));
          }
          return true
        },
        logOut: function() {
            data = "&username=" + this.get("username");
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
                id: -1,
                error: "",
            });
            vent.trigger("logout");
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
        parseFollows: function(follows) {
          var followHash = {}; 
          _.each(follows, function(follow) {
            var split = follow.artist.split("/");
            followHash[split[split.length - 2]] = follow.id;
          });
          return followHash;
        },
        isfollowing: function(artist_id, callback) {
          if (this.get("checked")) {
            callback(follows(artist_id));
          } else {
            var self = this;
            this.on("checked", function() { 
              callback(self.follows(artist_id));
            });
          }
        },
        follows: function(artist_id) {
          return util.hasOwnProperty(this.get("following"), artist_id);
        },
  });
  return User;
});
