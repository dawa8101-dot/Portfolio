// Task Planner State
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskCategorySelect = document.getElementById('task-category');
const taskDateInput = document.getElementById('task-date');
const taskListContainer = document.getElementById('task-list');

// Stat Elements
const statTotal = document.getElementById('stat-total');
const statPending = document.getElementById('stat-pending');
const statCompleted = document.getElementById('stat-completed');

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize Planner
document.addEventListener('DOMContentLoaded', () => {
  // Set default due date in form to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  taskDateInput.value = tomorrow.toISOString().split('T')[0];

  // Load and Render Tasks
  loadTasks();
  renderTasks();
  
  // Attach Event Listeners
  taskForm.addEventListener('submit', handleAddTask);
  taskListContainer.addEventListener('click', handleTaskAction);
  
  // Attach Filter Listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active class from all filters
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked filter
      e.target.classList.add('active');
      // Set current filter and render
      currentFilter = e.target.getAttribute('data-filter');
      renderTasks();
    });
  });
});

// Load tasks from LocalStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('awa_portfolio_tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    // Standard default tasks for showcase
    tasks = [
      {
        id: 'default-1',
        title: 'Review COS 106 Syllabus & Course Guide',
        category: 'Study',
        date: new Date().toISOString().split('T')[0],
        completed: true
      },
      {
        id: 'default-2',
        title: 'Submit Practical Term Project proposal',
        category: 'Project',
        date: new Date().toISOString().split('T')[0],
        completed: false
      },
      {
        id: 'default-3',
        title: 'Study React components and hooks',
        category: 'Study',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        completed: false
      }
    ];
    saveTasks();
  }
}

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('awa_portfolio_tasks', JSON.stringify(tasks));
}

// Render Tasks based on filter
function renderTasks() {
  // Clear the list
  taskListContainer.innerHTML = '';
  
  // Filter Tasks
  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }
  
  // Sort Tasks: Pending first, then by date
  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date) - new Date(b.date);
  });
  
  // Update Statistics
  updateStats();
  
  // Check if empty
  if (filteredTasks.length === 0) {
    taskListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"><i class="far fa-calendar-check" style="color: var(--text-light);"></i></div>
        <p>No ${currentFilter === 'all' ? '' : currentFilter} tasks found. Add a task to get started!</p>
      </div>
    `;
    return;
  }
  
  // Generate HTML for each task
  filteredTasks.forEach(task => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskItem.setAttribute('data-id', task.id);
    
    // Format Date nicely
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(task.date).toLocaleDateString('en-US', dateOptions);
    
    // Check if task is overdue (if pending and date is before today)
    const todayStr = new Date().toISOString().split('T')[0];
    const isOverdue = !task.completed && task.date < todayStr;
    const dateColor = isOverdue ? 'color: #ef4444; font-weight: 600;' : '';

    taskItem.innerHTML = `
      <div class="task-left">
        <div class="task-checkbox-container">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as completed">
        </div>
        <div class="task-info">
          <span class="task-title">${escapeHTML(task.title)}</span>
          <div class="task-meta">
            <span class="task-tag">${task.category}</span>
            <span style="${dateColor}">
              <i class="far fa-clock"></i> ${isOverdue ? 'Overdue: ' : 'Due: '}${formattedDate}
            </span>
          </div>
        </div>
      </div>
      <button class="task-delete-btn" aria-label="Delete task">
        <i class="far fa-trash-alt"></i>
      </button>
    `;
    
    taskListContainer.appendChild(taskItem);
  });
}

// Add task handler
function handleAddTask(e) {
  e.preventDefault();
  
  const title = taskTitleInput.value.trim();
  const category = taskCategorySelect.value;
  const date = taskDateInput.value;
  
  if (!title || !category || !date) return;
  
  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    title,
    category,
    date,
    completed: false
  };
  
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  
  // Reset input form
  taskTitleInput.value = '';
  taskTitleInput.focus();
}

// Toggle/Delete Task action handler using event delegation
function handleTaskAction(e) {
  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;
  
  const taskId = taskItem.getAttribute('data-id');
  
  // Handle Checkbox click
  if (e.target.classList.contains('task-checkbox')) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = e.target.checked;
      saveTasks();
      renderTasks();
    }
    return;
  }
  
  // Handle Delete button click (including nested icon clicks)
  if (e.target.closest('.task-delete-btn')) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
  }
}

// Update Statistics Boxes
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  
  statTotal.textContent = total;
  statPending.textContent = pending;
  statCompleted.textContent = completed;
}

// Helper to escape HTML tags to prevent XSS injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
