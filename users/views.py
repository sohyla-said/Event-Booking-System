from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions,status
from .models import User, Events, Booking
from .serializers import RegisterSerializer
from .serializers import LoginSerializer
from .serializers import EventSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

# Create your views here.
class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Signup successful",
                "user_id": user.id,
                "email": user.email,
                "name": user.name,
                "is_admin": user.is_admin,}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def register_page(request):
    return render(request, 'register.html')

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    return Response({
                        "message": "Login successful",
                        "user_id": user.id,
                        "email": user.email,
                        "name": user.name,
                        "is_admin": user.is_admin,
                        }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Incorrect password. "}, status=status.HTTP_401_UNAUTHORIZED)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def login_page(request):
    return render(request, 'login.html')

# return a GET response with all events, and whether the current user has booked each one.
class EventListApiView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')  # GET ?user_id=3
        if not user_id:
            return Response({"error": "Missing user_id in query parameters."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        events = Events.objects.all()
        user_booked_event_ids = Booking.objects.filter(user=user).values_list('event_id', flat=True)

        serialized = EventSerializer(events, many=True)
        for event in serialized.data:
            event["is_booked"] = event["id"] in user_booked_event_ids

        return Response(serialized.data, status=status.HTTP_200_OK)

class EventNameByIdApiView(APIView):
    def get(self, request):
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response({"error": "Missing event_id in query parameters."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            event = Events.objects.get(id=event_id)
        except Events.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        serialized = EventSerializer(event)
        return Response(serialized.data, status=status.HTTP_200_OK)

def event_list_page(request):
    return render(request, 'events_list.html')

def event_detail_page(request):
    return render(request, 'event_details.html')

class BookEventApiView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        event_id = request.data.get('event_id')

        if not user_id or not event_id:
            return Response({"error": "Missing user_id or event_id."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            event = Events.objects.get(id=event_id)
        except Events.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if Booking.objects.filter(user=user, event=event).exists():
            return Response({"error": "You have already booked this event."}, status=status.HTTP_400_BAD_REQUEST)
        # if event.date < timezone.now():
        #     return Response({"error": "Cannot book past events."}, status=status.HTTP_400_BAD_REQUEST)  

        booking = Booking.objects.create(user=user, event=event, number_of_tickets=1)
        return Response({"message": "Booking successful", "booking_id": booking.id}, status=status.HTTP_201_CREATED)


def admin_panel(request):
    return render(request, 'admin_panel.html')

# get and post events
class AdminEventListCreateAPIView(ListCreateAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer 

# GET / PUT / DELETE for a specific event
class AdminEventRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Events.objects.all()
    serializer_class = EventSerializer 
    

# GET /admin/events/ to list all events
# POST /admin/events/ to create a new event
# PUT /admin/events/<id>/ to update an event
# DELETE /admin/events/<id>/ to delete an event

def update_event_form_page(request):
    return render(request, 'update_event_form.html')

def add_event_form_page(request):
    return render(request, 'add_event_form.html')
