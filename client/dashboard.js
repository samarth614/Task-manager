const API = "https://task-manager-backend-pbj7.onrender.com";
const token = localStorage.getItem('token');

async function loadTasks(){
    const res = await fetch(API + "/tasks", {
        headers: { Authorization: token }
    });

    const data = await res.json();
    console.log("Tasks response:", data);

    if (!Array.isArray(data)) {
        console.error("Not array →", data);
        return;
    }

    const list = document.getElementById('taskList');
    list.innerHTML = '';

    data.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t.text;
        list.appendChild(li);
    });
}
async function addTask(){
    const text= document.getElementById("taskInput").value;
    await fetch(API+"/tasks",{
        method:'POST',headers:{
            'Content-Type':'application/json',
            Authorization:token
        },
        body: JSON.stringify({text})
    });
    loadTasks();
}
loadTasks();
        