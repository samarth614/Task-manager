const API = "http://localhost:5000";

async function signup(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log("Signup response:", data);

  alert("Signup successful");
}

async function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  console.log("Raw response:", res);

  const data = await res.json();
  console.log("Login response:", data);

  if (!data.token) {
    alert("Login failed");
    return;
  }

  localStorage.setItem("token", data.token);

  window.location.href = "dashboard.html";
}