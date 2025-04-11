  const taskForm = document.querySelector("#form-input");
  const inputTitle = document.querySelector("#input-title");
  const inputDescription = document.querySelector("#input-description");
  const inputDate = document.querySelector("#input-date");
  const inputPriority = document.querySelector("#priority");
  const list_el = document.querySelector("#lists");
  const inputStatus = document.querySelector("#input-status");
  const inputSearch = document.querySelector("#input-search");
  const deleteAllBtn = document.querySelector("#delete-all-btn");

  let allTasks = getTasks();

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
      priority:inputPriority.value,
      status: "Pending"
    };

    allTasks.push(newTask);
    saveTasks();
    displayTasks();

    // Clear form
    inputTitle.value = '';
    inputDescription.value = '';
    inputDate.value = '';
  });
 

  inputStatus.addEventListener('change', () => {
    displayTasks(inputStatus.value);
  });
  // show task in displayTasks
  const displayTasks = (filterStatus = "All") =>{
  list_el.innerHTML = '';

  const filteredTasks = filterStatus === "All"
    ? allTasks
    : allTasks.filter(task => task.status === filterStatus);

  if (filteredTasks.length === 0) {
    list_el.innerHTML = `<p class="text-gray-500 text-center">No tasks found for "${filterStatus}".</p>`;
    return;
  }  

  inputSearch.addEventListener('change', () => {
    displayTasks(inputStatus.value);
  });
  const lowercasedSearchInput = inputSearch.value.toLowerCase();
  const AllFilter = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(lowercasedSearchInput));

  const priorityOrder = { Low: 1, Medium: 2,High: 3 };

  AllFilter.sort((a, b) => {
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  AllFilter.map(task => {
    console.log("sort",task.priority);
        const taskEl = document.createElement('div');
        taskEl.className = "bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between";
  
        taskEl.innerHTML = `
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-800 mb-1 ${task.status === 'Completed' ? 'line-through' : ''}">${task.title}</h2>
            <p class="text-gray-600 mb-2 ${task.status === 'Completed' ? 'line-through' : ''}">${task.description}</p>
            <div class="text-sm text-gray-500 flex items-center space-x-4">
              <span><strong>Date:</strong> ${task.date}</span>
              <span>
                <strong>Status:</strong> 
                <span class="${task.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'} font-medium">${task.status}</span>
              </span>
              <span><strong>Priority:</strong> ${task.priority}</span>
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
  function deleteAll() {
    localStorage.removeItem("tasks"); // clear from localStorage
    allTasks = [];                   // clear in memory
    displayTasks();                  // refresh the UI
  }
  
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', deleteAll);
  }

  function deleteTask(id) {
    allTasks = allTasks.filter(task => task.id !== id);
    saveTasks();
    displayTasks(inputStatus.value);
  }



  function markDone(id) {
    allTasks = allTasks.map(task => {
      if (task.id === id){
        task.status = "Completed";
        task.priority="Low"
      } 
        
      return task;
    });
    saveTasks();
    displayTasks();
  }

  function editTask(id) {
    const task = allTasks.find(t => t.id === id);
    inputTitle.value = task.title;
    inputDescription.value = task.description;
    inputDate.value = task.date;
    inputPriority.value=task.priority;
    deleteTask(id); 
  }
  displayTasks(inputStatus.value);