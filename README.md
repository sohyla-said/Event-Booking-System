# Event Booking Web Application

A Django-based web application that allows users to:

* Register and log in (with roles: admin or user)
* View upcoming events
* Book events (1 ticket per event)
* View detailed event pages

Admins can:

* Add, update, delete events through a custom admin panel

---

## Features

### User Features

* Register/login with session storage
* Book events (with duplicate booking prevention)
* View only future events
* View full event details (including image)

### Admin Features

* Dashboard to manage all events
* Add new events with image upload
* Update or delete existing events

---

## Tech Stack

* **Backend:** Django (DRF)
* **Frontend:** HTML, CSS, JavaScript (no frontend framework)
* **Database:** SQLite (default Django DB)

---

## Folder Structure

```
project_root/
├── users/                  # Main Django app
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── templates/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── events_list.html
│   │   ├── event_details.html
│   │   ├── admin_panel.html
│   │   ├── add_event_form.html
│   │   └── update_event_form.html
│   └── static/
│       ├── CSS/
│       │   ├── event_list.css
│       │   ├── add_event.css
│       │   └── update_event.css
│       └── JS/
│           ├── login.js
│           ├── register.js
│           ├── events_list.js
│           ├── event_details.js
│           ├── add_event.js
│           └── update_event.js
├── media/                  # Uploaded images
├── db.sqlite3
├── manage.py
└── eventBooking/           # Django project
    ├── settings.py
    └── urls.py
```

---

## How to Run

1. **Clone the repository**

```bash
git clone <repo-url>
cd project_root
```

2. **Create and activate a virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Run migrations**

```bash
python manage.py migrate
```

5. **Start the development server**

```bash
python manage.py runserver
```

6. **Access the application**

* Visit `http://127.0.0.1:8000/register/` to sign up
* Use `/adminPanel/` for the admin dashboard

---

## Media Setup (for image uploads)

Ensure `MEDIA_URL` and `MEDIA_ROOT` are configured in `settings.py`:

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

And in `urls.py`:

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## To Do

*

---

## License

This project is for educational purposes. You can adapt and reuse it freely.
