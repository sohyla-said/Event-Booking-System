document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById("event-container");
    const userId = sessionStorage.getItem("user_id");

    const res = await fetch(`/eventsApi/?user_id=${userId}`); 
    const events = await res.json();

    events.forEach(event => {
        const todayStr = new Date().toISOString().split('T')[0]; // e.g. '2025-05-18'
        if (event.date < todayStr) {
            return; // skip past event
        }
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
        <img src="${event.image}" alt="${event.name}" class="event-image">
        <div class="event-details">
            <h2 class="event-name">${event.name}</h2>
            <p><i class="fa-solid fa-calendar"></i><strong>Date:</strong> ${event.date}</p>
            <p><i class="fa-solid fa-money-bill"></i><strong>Price:</strong> $${event.price}</p>
            ${event.is_booked
            ? `<span style="color: #357ABD; font-weight: bold;">Booked <i class="fa-solid fa-check"></i></span>`
            : `<button onclick="bookEvent(${event.id})" class="booking-btn">Book Now <i class="fa-solid fa-bookmark"></i></button>`}
            
            <button class="details-btn">
                <a href="/eventDetails/?event_id=${event.id}&is_booked=${event.is_booked}">
                    View Details <i class="fa-solid fa-circle-info"></i>
                </a>
            </button>`;
            container.appendChild(card);
    });
});

const bookEventMsg = document.getElementById("booking-msg");
async function bookEvent(eventId) {
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
    const eventDetailsRes = await fetch(`/event/?event_id=${eventId}`, {
        method: "GET",
    })
    const eventDetails = await eventDetailsRes.json();
    const eventName = eventDetails.name; 
    if (res.status === 201) {
        bookEventMsg.innerText = `Successfully booked ${eventName}!`;
        bookEventMsg.style.color = "green";
        // alert(`Successfully booked ${eventName}!`);
        setTimeout(() => {
            window.location.reload();
        }, 2000);  // 2000 ms = 2 seconds

    } else {
        bookEventMsg.innerText = `Failed to book ${eventName}: ${JSON.stringify(data)}`;
        bookEventMsg.style.color = "red";
        // alert(`Failed to book ${eventName}: ${JSON.stringify(data)}`);
    }

}