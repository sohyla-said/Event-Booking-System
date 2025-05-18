from django.urls import path
from . import views

urlpatterns = [
    path('', views.register_page, name='register_page'),
    path('registerApi/', views.RegisterAPIView.as_view(), name='register_api'),  # URL for user registration
    path('loginApi/', views.LoginAPIView.as_view(), name='login_api'),  # URL for JWT token login
    path('register/', views.register_page, name='register_page'),  # URL for user registration page
    path('login/', views.login_page, name='login_page'),  # URL for user login page
    path('eventsApi/', views.EventListApiView.as_view(), name='events_api'),  # URL for event list API
    path('events/', views.event_list_page, name='events_page'),  # URL for event list page
    path('event/', views.EventNameByIdApiView.as_view(), name='event_name_by_id'),
    path('eventDetails/', views.event_detail_page, name='event_detail'),  # URL for event detail page
    path('bookEventApi/', views.BookEventApiView.as_view(), name='book_event_api'),  # URL for booking event API
    path('adminPanel/', views.admin_panel, name='admin_panel'),  # URL for admin panel page
    path('adminEvents/', views.AdminEventListCreateAPIView.as_view(), name='admin_event_list_create'),
    path('adminEvents/<int:pk>/', views.AdminEventRetrieveUpdateDestroyAPIView.as_view(), name='admin_event_rud'),
    path('adminUpdateEventForm/', views.update_event_form_page, name='update_event_form_page'),  # URL for update event form page
    path('adminAddEventForm', views.add_event_form_page, name='add_event_form_page'),  # URL for add event form page
]