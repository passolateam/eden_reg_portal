const form = document.getElementById("registrationForm");
const responseDiv = document.getElementById("response");

// Backend API URL - using port 3100 (within 3100-3111 range)
const API_URL = 'http://localhost:3100';

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  responseDiv.textContent = "⏳ Registering...";
  responseDiv.style.color = "white";

  const formData = new FormData(form);
  const data = {
    parent_name: formData.get('parent_name'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    child_name: formData.get('child_name')
  };

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    
    if (result.success) {
      responseDiv.textContent = `✅ ${result.message}`;
      responseDiv.style.color = "lightgreen";
      form.reset();
    } else {
      responseDiv.textContent = "❌ Registration failed";
      responseDiv.style.color = "red";
    }
  } catch (err) {
    responseDiv.textContent = "❌ Cannot connect to server";
    responseDiv.style.color = "red";
  }
});