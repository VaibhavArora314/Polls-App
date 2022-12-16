from datetime import time,datetime,timedelta
from django.db import models
from django.conf import settings

class Poll(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL,on_delete=models.PROTECT)
    description = models.TextField(null=False,blank=False)
    live_results = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    time_period = models.FloatField(default=1)

    def is_active(self):
        current_time = datetime.now().replace(tzinfo=None)
        end_time = self.created_at.replace(tzinfo=None) + timedelta(days=self.time_period)
        return current_time < end_time
    
    def __str__(self) -> str:
        return self.description

class Options(models.Model):
    poll = models.ForeignKey(to=Poll,on_delete=models.CASCADE,related_name='options')
    votes_count = models.PositiveBigIntegerField(default=0)
    description = models.TextField(blank=False,null=False)

    def __str__(self) -> str:
        return self.description

class Votes(models.Model):
    poll = models.ForeignKey(to=Poll,related_name='Votes',on_delete=models.CASCADE,null=False,blank=False)
    option = models.ForeignKey(to=Options,on_delete=models.CASCADE,null=False,blank=False)
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL,on_delete=models.PROTECT,null=False,blank=False)