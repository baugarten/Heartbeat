define([
    'jquery',
    'backbone',
    'underscore',
    'album',
    'artist',
], function ($, Backbone, _, Album, Artist) {
  var Albums = Backbone.Collection.extend({
    url: "/api/users/album/hot/",
    model: Album,
    defaults: {
      artist: "",
      album: "",
      songs: null,
      cover: "",
      url: "",
    },
    initialize: function() {
      var that = this;
      this.fetch({
        beforeSend: function(a, b, c) {
          console.log(a);
          console.log(b);
          console.log(c);
                    },
        success: function(a, b, c) {
          var albums = $.parseJSON(b.albums);
          console.log(albums.length);
          for (var i = 0; i < albums.length; i++) {
            that.add(Album.fromJSON(albums[i]));
            console.log(albums[i]);
          }
          that.trigger("change");
        },
        error: function(a, b, c) {
          console.log(a);
          console.log(b);
          console.log(c);
        },
      });
    },
    download: function() {

    },

  });

  return Albums;
});
