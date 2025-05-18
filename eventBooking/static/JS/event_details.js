document.addEventListener("DOMContentLoaded", async () => {
    //get event id from url
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event_id");
    const isBooked = urlParams.get("is_booked") === "true"; //convert to boolean

    if(!eventId) {
        alert("Event ID not found in URL");
        return;
    }
     try{
        const res = await fetch(`/event/?event_id=${eventId}`, {
            method: "GET",
        });
        const data = await res.json();
        if(res.status === 200){
            document.getElementById("event-name").innerText = data.name;
            document.getElementById("event-category").innerText = data.category;
            document.getElementById("event-description").innerText = data.description;
            document.getElementById("event-date").innerText = data.date;
            document.getElementById("event-venue").innerText = data.venue;
            document.getElementById("event-price").innerText = data.price;

            const img = document.getElementById("event-image");
            img.src = data.image;
            img.alt = data.name;

            const bookingStatus = document.getElementById("booking-status");
            const bookBtn = document.getElementById("book-btn");
            if(isBooked){
                bookBtn.style.display = "none";
                bookingStatus.innerText = "You have already booked this event.";
                bookingStatus.style.color = "red";
            }
            else{
                bookBtn.style.display = "block";
                bookBtn.onclick = () => bookEvent(eventId, data.name);
                bookingStatus.innerText = "You have not booked this event yet.";
                bookingStatus.style.color = "green";
            }
        }
        else{
            alert("Failed to fetch event details" || data.error);
        }
    }
    catch (error) {
        console.error("Error fetching event details:", error);
        alert("An error occurred while fetching event details.");
    }
});

const bookEventMsg = document.getElementById("booking-msg");
async function bookEvent(eventId, eventName) 
 {
    const userId = sessionStorage.getItem("user_id");
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    const res = await fetch("/bookEventApi/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  // Required for Django CSRF protection
        },
        body: JSON.stringify({ user_id: userId, event_id: eventId })
    });

    data = await res.json();
    if (res.status === 201) {
        bookEventMsg.innerText = `Successfully booked ${eventName}!`;
        bookEventMsg.style.color = "green";
        // alert(`Successfully booked ${eventName}!`);
        setTimeout(() => {
            window.location.href = "/events";
        }, 2000);  // 2000 ms = 2 seconds

    } else {
        bookEventMsg.innerText = `Failed to book ${eventName}: ${JSON.stringify(data)}`;
        bookEventMsg.style.color = "red";
        // alert(`Failed to book ${eventName}: ${JSON.stringify(data)}`);
    }

}