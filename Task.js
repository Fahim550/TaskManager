  const taskForm = document.querySelector("#form-input");
  const inputTitle = document.querySelector("#input-title");
  const inputDescription = document.querySelector("#input-description");
  const inputDate = document.querySelector("#input-date");
  const list_el = document.querySelector("#lists");

  let allTasks = getTasks();
  renderTasks();

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (inputTitle.value === '' || inputDescription.value === '' || inputDate.value === '') {
      alert("Please fill in all fields");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: inputTitle.value,
      description: inputDescription.value,
      date: inputDate.value,
      status: "Pending"
    };

    allTasks.push(newTask);
    saveTasks();
    renderTasks();

    // Clear form
    inputTitle.value = '';
    inputDescription.value = '';
    inputDate.value = '';
  });

  function renderTasks() {
    list_el.innerHTML = '';

    allTasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = "bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between";

      taskEl.innerHTML = `
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-gray-800 mb-1">${task.title}</h2>
          <p class="text-gray-600 mb-2">${task.description}</p>
          <div class="text-sm text-gray-500 flex items-center space-x-4">
            <span><strong>Date:</strong> ${task.date}</span>
            <span>
              <strong>Status:</strong> 
              <span class="${task.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'} font-medium">${task.status}</span>
            </span>
          </div>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-6 flex space-x-2">
          <button onclick="markDone(${task.id})" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm">Done</button>
          <button onclick="editTask(${task.id})" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm">Edit</button>
          <button onclick="deleteTask(${task.id})" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm">Delete</button>
        </div>
      `;

      list_el.appendChild(taskEl);
    });
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(allTasks));
  }

  function getTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }

  function deleteTask(id) {
    allTasks = allTasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }

  function markDone(id) {
    allTasks = allTasks.map(task => {
      if (task.id === id) task.status = "Completed";
      return task;
    });
    saveTasks();
    renderTasks();
  }

  function editTask(id) {
    const task = allTasks.find(t => t.id === id);
    inputTitle.value = task.title;
    inputDescription.value = task.description;
    inputDate.value = task.date;

    deleteTask(id); // Let the user resubmit updated data
  }
