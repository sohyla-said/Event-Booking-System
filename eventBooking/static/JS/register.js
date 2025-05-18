const registerMsg = document.getElementById("register-msg");
document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const formData = new FormData(event.target);
    const body = JSON.stringify(Object.fromEntries(formData.entries()));

    // Get CSRF token from the meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const res = await fetch("/registerApi/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  // Required for Django CSRF protection
        },
        body: body
    });
    const data = await res.json();
    // console.log(data);
    if (res.status === 201) {
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("is_admin", data.is_admin);
        registerMsg.style.color = "green";
        registerMsg.innerText = "Registration successful!";
        // alert("Registration successful!");
        if(!data.is_admin) {
            // Redirect to the user dashboard
            window.location.href = "/events";
        }
        else{
            window.location.href = "/adminPanel";
        }
    } else {
        const errorData = await res.json();
        registerMsg.style.color = "red";
        registerMsg.innerText = "Registration failed: " + JSON.stringify(errorData);
        // alert("Registration failed: " + JSON.stringify(errorData));
    }
});
