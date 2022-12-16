from django.shortcuts import render
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import CreateModelMixin,RetrieveModelMixin,UpdateModelMixin,ListModelMixin,DestroyModelMixin
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly,IsAuthenticated
from api.models import Options, Poll, Votes
from api.serializers import CreatePollSerializer, PollSerializer, VotesSerializer
from django.shortcuts import get_object_or_404


class PollViewSet(GenericViewSet,CreateModelMixin,RetrieveModelMixin,ListModelMixin):
    queryset = Poll.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreatePollSerializer
        return PollSerializer
    
    def perform_create(self, serializer):
        print(self.request.user)
        return serializer.save(user=self.request.user)

class VoteViewSet(GenericViewSet,CreateModelMixin,UpdateModelMixin,RetrieveModelMixin):
    queryset = Votes.objects.all()
    serializer_class = VotesSerializer
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = get_object_or_404(Votes,poll=kwargs['pk'],user=request.user)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if (not serializer.validated_data['poll'].is_active()):
            return Response({"Poll has ended"},status=status.HTTP_403_FORBIDDEN)
        if (serializer.validated_data['poll'].id != serializer.validated_data['option'].poll.id):
            return Response({"option":{"Option not found for given poll"}},status=status.HTTP_404_NOT_FOUND)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        option_selected = serializer.validated_data['option'].id
        option = Options.objects.get(id = option_selected)
        option.votes_count += 1
        option.save()
        serializer.save()
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = get_object_or_404(Votes,poll=kwargs['pk'],user=request.user)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        if (not serializer.validated_data['poll'].is_active()):
            return Response({"Poll has ended"},status=status.HTTP_403_FORBIDDEN)
        print(serializer.validated_data['option'].poll.id,kwargs['pk'])
        if (serializer.validated_data['option'].poll.id != int(kwargs['pk'])):
            return Response({"option":{"Option not found for given poll"}},status=status.HTTP_404_NOT_FOUND)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def perform_update(self, serializer):
        new_option = serializer.validated_data['option'].id
        old_option = Votes.objects.get(poll = self.kwargs['pk'],user=self.request.user).option.id
        if new_option != old_option:
            option = Options.objects.get(id = old_option)
            option.votes_count -= 1
            option.save()
            option = Options.objects.get(id = new_option)
            option.votes_count += 1
            option.save()
        serializer.save()
