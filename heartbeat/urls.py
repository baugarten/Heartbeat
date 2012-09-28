from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from tastypie.api import Api

from artists.api import ArtistResource, ArtistDetailsResource, HotAlbumResource, AlbumResource, SongResource
from users.api import UserResource, CreateProfileResource, ProfileResource

admin.autodiscover()

users_api = Api(api_name="users")
users_api.register(UserResource())
users_api.register(ProfileResource())
users_api.register(CreateProfileResource())

users_api.register(ArtistResource())
users_api.register(ArtistDetailsResource())
users_api.register(AlbumResource())
users_api.register(SongResource())
users_api.register(HotAlbumResource())

urlpatterns = patterns(
    '',
    # Examples:
    # url(r'^$', 'heartbeat.views.home', name='home'),
    # url(r'^heartbeat/', include('heartbeat.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^register/', 'users.views.register'),
    url(r'^', include('artists.urls')),
    url(r'^users/', include('users.urls')),
    url(r'^artists/', include('artists.urls')),
    url(r'^api/', include(users_api.urls)),
    url(r'^admin/', include(admin.site.urls)),
)
urlpatterns += patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
      'document_root': settings.MEDIA_ROOT,
      }),
    )
urlpatterns += staticfiles_urlpatterns()
