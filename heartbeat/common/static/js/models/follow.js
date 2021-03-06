define([
    'jquery',
    'backbone',
    'vent',
], function($, Backbone, vent) {

  var Follow = Backbone.Model.extend({
    defaults: {
      artist_id: -1,
      user_id: -1,
      autoGenerated: false,
    },
    url: function() {
      var url = "/api/users/follow/";
      if (this.get("id")) {
        return url + "" + this.get("id") + "/";
      }
      return url;
    },
    initialize: function() {
      vent.bind("follow", this.savefollow);
    },

  });
  return Follow;
});
