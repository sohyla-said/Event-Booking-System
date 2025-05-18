const loginMsg = document.getElementById("login-msg");

document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Get the form data
    const formData = new FormData(event.target);
    const body = JSON.stringify(Object.fromEntries(formData.entries()));

    // Get CSRF token from the meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const res = await fetch("/loginApi/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  // Required for Django CSRF protection
        },
        body: body
    });
    const data = await res.json();
    // console.log(data);
    if (res.status === 200) {
        // alert("Logged in successfully!");
        // store user data in local storage to be able to access it later
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("is_admin", data.is_admin);
        loginMsg.style.color = "green";
        loginMsg.innerText = "Login successful!";
        

        if(!data.is_admin) {
            // Redirect to the user dashboard
            window.location.href = "/events";
        }
        else{
            window.location.href = "/adminPanel";
        }
        // window.location.href = "/login";
    } else {
        const errorData = await res.json();
        loginMsg.style.color = "red";
        loginMsg.innerText = "Login failed: " + JSON.stringify(errorData);
        
        // alert("Login failed: " + JSON.stringify(errorData));
    }
})