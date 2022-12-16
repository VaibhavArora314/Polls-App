from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import PollViewSet, VoteViewSet

router = DefaultRouter()
router.register('polls',PollViewSet,'polls')
# router.register('options',OptionViewSet,'options')
router.register('votes',VoteViewSet,'votes')

urlpatterns = router.urls