document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("event_id");

  if (!eventId) {
    alert("No event ID provided.");
    return;
  }

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

  // Fetch existing event data
  try {
    const res = await fetch(`/adminEvents/${eventId}/`);
    const event = await res.json();

    // Populate form fields with existing data
    document.getElementById("heading").innerText += " " + event.name;
    document.getElementById("event-name").value = event.name;
    document.getElementById("event-description").value = event.description;
    document.getElementById("event-category").value = event.category;
    document.getElementById("event-date").value = event.date;
    document.getElementById("event-venue").value = event.venue;
    document.getElementById("event-price").value = event.price;
    // document.getElementById("event-image").value = event.image;

    // const imgPreview = document.getElementById("image-preview");
    // imgPreview.src = event.image;  // Should be full URL from serializer
    // imgPreview.style.display = "block";

    // Show existing image
    if (event.image) {
        const preview = document.getElementById("image-preview");
        preview.src = event.image;
        preview.style.display = "block";
    }
  } catch (err) {
    alert("Failed to load event data.");
    console.error(err);
  }

  // Handle update form submission
  document.getElementById("update-event-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    // const formData = new FormData(form);
    const formData = new FormData();
    // Append non-file fields manually
    formData.append("name", document.getElementById("event-name").value);
    formData.append("description", document.getElementById("event-description").value);
    formData.append("category", document.getElementById("event-category").value);
    formData.append("date", document.getElementById("event-date").value);
    formData.append("venue", document.getElementById("event-venue").value);
    formData.append("price", document.getElementById("event-price").value);

    // Append image only if a file is selected
    const imageInput = document.getElementById("event-image");
    if (imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
    }

    // const body = JSON.stringify(Object.fromEntries(formData.entries()));
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("event_id");


    try {
      const res = await fetch(`/adminEvents/${id}/`, {
        method: "PUT",
        headers: {
        //   "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: formData,
      });

      const msg = document.getElementById("message");
      if (res.status === 200) {
        msg.innerText = "✅ Event updated successfully!";
        msg.style.color = "green";
        setTimeout(() => {
          window.location.href = "/adminPanel/";
        }, 2000);
      } else {
        const errorData = await res.json();
        msg.innerText = "❌ Update failed: " + JSON.stringify(errorData);
        msg.style.color = "red";
      }
    } catch (err) {
      console.error(err);
      document.getElementById("message").innerText = "❌ Error updating event.";
    }
  });
});
