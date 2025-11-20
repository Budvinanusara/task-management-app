
const getTasks = () => {
    const tasksString = localStorage.getItem('tasks');
    try {
        return tasksString ? JSON.parse(tasksString) : [];
    } catch (e) {
        console.error("Error parsing tasks from Local Storage:", e);
        return [];
    }
};
const saveTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
const taskListContainer = document.getElementById('task-list');

const createTaskCardHTML = (task) => {
    const statusClass = task.status === 'Completed' ? 'completed' : '';
    
    const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';

    return `
        <article class="task-card ${statusClass}" data-id="${task.id}">
            <div class="task-details">
                <h3>
                    ${task.title}
                    <span class="priority-tag ${task.priority}">${task.priority}</span>
                </h3>
                <p>${task.description || 'No description provided.'}</p>
                <p>Due: ${formattedDate}</p>
            </div>
            <div class="task-actions">
                <button onclick="toggleTaskStatus(${task.id})" class="btn-complete">
                    ${task.status === 'Completed' ? 'Uncomplete' : 'Complete'}
                </button>
                <button onclick="editTask(${task.id})" class="btn-edit">Edit</button>
                <button onclick="deleteTask(${task.id})" class="btn-delete">Delete</button>
            </div>
        </article>
    `;
};

const renderTasks = (tasksToRender) => {
    taskListContainer.innerHTML = '';
    if (tasksToRender.length === 0) {
        taskListContainer.innerHTML = '<p style="text-align: center;">No tasks found. Add a new one!</p>';
        return;
    }

    tasksToRender.forEach(task => {
        taskListContainer.innerHTML += createTaskCardHTML(task);
    });
};

const handleAddTask = (event) => {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;

    const newTask = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        status: 'To Do'
    };

    const tasks = getTasks();
    tasks.push(newTask);
    saveTasks(tasks);

    renderTasks(tasks);
    document.getElementById('task-form').reset();
};

const toggleTaskStatus = (taskId) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const currentStatus = tasks[taskIndex].status;
        tasks[taskIndex].status = currentStatus === 'Completed' ? 'To Do' : 'Completed';
        
        saveTasks(tasks);
        renderTasks(tasks);
    }
};

const deleteTask = (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const updatedTasks = getTasks().filter(task => task.id !== taskId);
    
    saveTasks(updatedTasks);
    renderTasks(updatedTasks);
};

const editTask = (taskId) => {

    const tasks = getTasks();
    const taskToEdit = tasks.find(task => task.id === taskId);

    if (!taskToEdit) return;

    const newTitle = prompt("Edit Task Title:", taskToEdit.title);

    if (newTitle !== null && newTitle.trim() !== '') {
        taskToEdit.title = newTitle.trim();

        saveTasks(tasks);
        renderTasks(tasks);
    }
};

const filterTasks = () => {
    const allTasks = getTasks();
    
    const priorityFilter = document.getElementById('filter-priority').value;
    const searchTerm = document.getElementById('search-tasks').value.toLowerCase();

    let filteredTasks = allTasks;

    if (priorityFilter !== 'All') {
        filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }
    
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            task.description.toLowerCase().includes(searchTerm)
        );
    }

    renderTasks(filteredTasks);
};

document.addEventListener('DOMContentLoaded', () => {

    const initialTasks = getTasks();
    renderTasks(initialTasks);

    document.getElementById('task-form').addEventListener('submit', handleAddTask);

});