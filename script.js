// Store the last few tasks to prevent consecutive duplicates
var recentTasks = [];

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', function () {
    var savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(function (task) {
        addTaskToList(task.text, task.date);
    });
});

// Placeholder handling
document.getElementById('chatInput').addEventListener('focus', function () {
    this.placeholder = '';
    this.setSelectionRange(1, 1);
});

document.getElementById('chatInput').addEventListener('blur', function () {
    if (this.value === '') {
        this.placeholder = 'Add items to your to-do list';
    }
});

// Adding task to list
document.getElementById('addlist').addEventListener('click', function () {
    var dateInput = document.getElementById('date').value;
    var chatInput = document.getElementById('chatInput').value;

    if (dateInput === '' || chatInput === '') {
        alert('Please enter both date and task');
    } else {
        var today = new Date().toISOString().split('T')[0];

        if (dateInput < today) {
            alert('Date cannot be in the past');
        } else {
            if (recentTasks.includes(chatInput)) {
                alert('This task was recently added. Please add a different task.');
            } else {
                addTaskToList(chatInput, dateInput);
                recentTasks.push(chatInput);

                if (recentTasks.length > 1) {
                    recentTasks.shift();
                }

                saveTasksToLocalStorage();
            }
        }
    }
});

// Function to add task to the list
function addTaskToList(text, date) {
    var list = document.getElementById('list');
    var li = document.createElement('li');
    li.textContent = `${text} in ${date}`;

    var actionButtons = document.createElement('div');
    actionButtons.className = 'action-buttons';

    var completedBtn = document.createElement('button');
    completedBtn.textContent = 'Completed';
    completedBtn.className = 'completed';
    completedBtn.addEventListener('click', function () {
        li.style.textDecoration = 'line-through';
        li.style.color = 'green';
        completedBtn.style.display = 'none';
        couldntCompleteBtn.style.display = 'none';
        saveTasksToLocalStorage();
    });

    var couldntCompleteBtn = document.createElement('button');
    couldntCompleteBtn.textContent = "Couldn't Complete";
    couldntCompleteBtn.className = 'couldnt-complete';
    couldntCompleteBtn.addEventListener('click', function () {
        li.style.textDecoration = 'line-through';
        li.style.color = 'red';
        completedBtn.style.display = 'none';
        couldntCompleteBtn.style.display = 'none';
        saveTasksToLocalStorage();
    });

    actionButtons.appendChild(completedBtn);
    actionButtons.appendChild(couldntCompleteBtn);

    li.appendChild(actionButtons);
    list.appendChild(li);
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    var tasks = Array.from(document.getElementById('list').getElementsByTagName('li')).map(li => {
        var [text, date] = li.textContent.split(' in ');
        return { text: text, date: date };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listener for clearing all tasks
document.getElementById('clearAll').addEventListener('click', function () {
    if (confirm('Are you sure you want to clear all tasks?')) {
        localStorage.removeItem('tasks');
        document.getElementById('list').innerHTML = '';
        recentTasks = [];
    }
});
