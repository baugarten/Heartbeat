(function($) {
    LoginBox = Backbone.View.extend({
        el: $("#login_box"),
        defaults: {
            usernameField: $("#username_log"),
            passwordField: $("#password_log"),
        },
        logIn: function(response, status, xhr, form) {
            var username = response['username'];
            var artistId = msg['artistId'];
            if (username == null) {
                displayError(response['error']);
            } else {
                this.user.logIn(username, artistId)
            }
        },
        initialize: function() {
            this.user = new User();
            this.render();

            $(this.el).children("form").ajaxForm({
                success: this.logIn
            });
        },
        events: {
            "click #logout": "logout",
            "click #username": "loadUserPage",
            "click #register": "register"
        },
        render: function() {
            var template = _.template( $("#login_box_template").html(), {
                username: "hello" //(this.user.username == null) ? "" : this.user.username
            });
            $(this.el).html(template);
        },
        loadUserPage: function() {

        },
        logout: function() {

        },
    });
    
    var loginBox = new LoginBox();
                                    

})(jQuery);