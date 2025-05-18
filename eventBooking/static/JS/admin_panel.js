document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById("event-container");

    const res = await fetch(`/adminEvents/`); 
    const events = await res.json();

    events.forEach(event => {
        // if( event.date < new Date() ) {
        //     return;
        // }
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
        <img src="${event.image}" alt="${event.name}" class="event-image">
        <div class="event-details">
            <h2 class="event-name">${event.name}</h2>
            <p><strong><i class="fa-solid fa-list"></i>Category:</strong> ${event.category}</span></p>
            <p><strong><i class="fa-solid fa-comment"></i>Description:</strong> ${event.description}</span></p>
            <p><strong><i class="fa-solid fa-calendar"></i>Date:</strong> ${event.date}</span></p>
            <p><strong><i class="fa-solid fa-location-dot"></i>Venue:</strong> ${event.venue}</span></p>
            <p><strong><i class="fa-solid fa-money-bill"></i>Price:</strong> $${event.price}</span></p>
            
            <button class="delete-btn" onclick="deleteEvent(${event.id})">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
            <button class="update-btn">
                <a href="/adminUpdateEventForm/?event_id=${event.id}">
                    <i class="fa-solid fa-pen"></i> Update
                </a>
            </button>`;
            container.appendChild(card);
    });
});

async function deleteEvent(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try {
        const response = await fetch(`/adminEvents/${eventId}/`, {
            method: "DELETE",
            headers: {
                "X-CSRFToken": csrfToken,
            },
        });

        if (response.status === 204) {
            alert("Event deleted successfully.");
            window.location.reload();  // Refresh to reflect changes
        } else {
            const data = await response.json();
            alert("Failed to delete event: " + (data.detail || response.statusText));
        }
    } catch (error) {
        console.error("Error deleting event:", error);
        alert("An error occurred while trying to delete the event.");
    }
}
