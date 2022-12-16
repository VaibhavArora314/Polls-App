from datetime import datetime, timedelta, tzinfo
from email.policy import default
from api.models import Poll,Options,Votes
from rest_framework import serializers

class VotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Votes
        fields = ('poll', 'option', 'user', )

class OptionsSerializer(serializers.ModelSerializer):
    votes_count = serializers.IntegerField(read_only=True)
    poll = serializers.PrimaryKeyRelatedField(queryset=Poll.objects.all(),required=False)
    class Meta:
        model = Options
        fields = ('id','poll', 'votes_count', 'description', )


class CreatePollSerializer(serializers.ModelSerializer):
    options = OptionsSerializer(many=True)
    class Meta:
        model = Poll
        fields = ('id','user', 'description', 'live_results', 'time_period','options')

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        poll = Poll.objects.create(**validated_data)
        for option_data in options_data:
            Options.objects.create(poll=poll,**option_data)
        return poll

class PollSerializer(serializers.ModelSerializer):
    options = OptionsSerializer(many=True,read_only=True)
    time_left = serializers.SerializerMethodField(method_name='calculate_time_left')
    can_edit = serializers.SerializerMethodField(method_name='checkCanEdit')
    username = serializers.SerializerMethodField(method_name='get_username')
    ended = serializers.SerializerMethodField(method_name="checkEnded")

    def checkEnded(self,poll):
        return not poll.is_active()

    def checkCanEdit(self,poll):
        user = self.context['request'].user
        if (user.is_staff or user.id == poll.user.id):
            return True
        return False

    def calculate_time_left(self,poll):
        if not poll.is_active():
            return "Ended"

        current_time = datetime.now().replace(tzinfo=None)
        end_time = poll.created_at.replace(tzinfo=None) + timedelta(days=poll.time_period)
        days = ((end_time - current_time).days)
        hours = int((end_time - current_time).seconds/3600)
        minutes = int((end_time - current_time).seconds/60)%60
        seconds = int((end_time - current_time).seconds/60)%60
        if (days > 0): 
            return f"{days} days" if days > 1 else "1 day"
        if (days == 0 and hours > 0):
            return f"{hours} hours" if hours > 1 else "1 hour"
        if (days == 0 and hours == 0 and minutes > 0):
            return f"{minutes} minutes" if minutes > 1 else "1 minute"
        return "Less than a minute"
            

    def get_username(self,poll):
        return poll.user.username

    class Meta:
        model = Poll
        fields = ('id','user','username', 'description', 'live_results', 'time_left', 'options','can_edit','ended')
