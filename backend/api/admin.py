from django.contrib import admin
from api.models import Poll,Options,Votes

# Register your models here.
admin.site.register(Poll)
admin.site.register(Options)
admin.site.register(Votes)