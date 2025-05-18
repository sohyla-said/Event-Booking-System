document.getElementById('add-event-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    // const body = JSON.stringify(Object.fromEntries(formData.entries()));
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    try{
        const res = await fetch("/adminEvents/",{
            method: 'POST',
            headers: {
                // 'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: formData
        });
        const data = await res.json();
        const msg = document.getElementById("message");

        if (res.status === 201) {
            msg.innerText = "✅ Event created successfully!";
            msg.style.color = "green";
            setTimeout(() => {
            window.location.href = "/adminPanel";
        }, 2000);
        } else {
            msg.innerText = "❌ Failed to create event: " + JSON.stringify(data);
            msg.style.color = "red";
            // form.reset();
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("message").innerText = "❌ Error submitting form.";
    }
});