from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.
class User(models.Model):

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_admin = models.BooleanField(default=False)
    is_user = models.BooleanField(default=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    def __str__(self):
        return self.name
    
class Events(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    category = models.CharField(max_length=100)
    venue = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='events/', blank=True, null=True)

    def __str__(self):
        return self.name
    
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    booking_date = models.DateField(auto_now_add=True)
    number_of_tickets = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.name} - {self.event.name}"