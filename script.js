var state = {
  title: 'Build a Testable Todo Item Card',
  description: 'Create a clean, modern Todo / Task Card component with all required data-testid attributes, semantic HTML, accessibility features, and a responsive layout from 320px to 1200px.',
  priority: 'High',
  status: 'In Progress',
  dueDate: '2026-04-17',
  dueDateDisplay: 'Apr 17, 2026',
  dueDateISO: '2026-04-17T18:00:00Z',
  isDone: false
};

var savedState = Object.assign({}, state);

window.onload = function () {
  applyPriorityIndicator(state.priority);
  updateTimeRemaining();
  setInterval(updateTimeRemaining, 30000);
};

function updateTimeRemaining() {
  var el        = document.getElementById('time-remaining');
  var overdueEl = document.getElementById('overdue-indicator');
  var card      = document.getElementById('todo-card');

  if (state.isDone) {
    el.textContent = 'Completed';
    el.className   = 'time-chip completed';
    overdueEl.classList.add('hidden');
    return;
  }

  var due  = new Date(state.dueDateISO);
  var now  = new Date();
  var diff = due - now;

  if (diff <= 0) {
    var abs  = Math.abs(diff);
    var days = Math.floor(abs / 86400000);
    var hrs  = Math.floor(abs / 3600000);
    var mins = Math.floor(abs / 60000);
    var text;
    if (days >= 1)     text = 'Overdue by ' + days + (days === 1 ? ' day' : ' days');
    else if (hrs >= 1) text = 'Overdue by ' + hrs  + (hrs  === 1 ? ' hour' : ' hours');
    else               text = 'Overdue by ' + mins + (mins === 1 ? ' minute' : ' minutes');
    el.textContent = text;
    el.className   = 'time-chip overdue';
    overdueEl.classList.remove('hidden');
  } else {
    var days2 = Math.floor(diff / 86400000);
    var hrs2  = Math.floor(diff / 3600000);
    var mins2 = Math.floor(diff / 60000);
    var text2;
    if (days2 >= 2)       text2 = 'Due in ' + days2 + ' days';
    else if (days2 === 1) text2 = 'Due tomorrow';
    else if (hrs2 >= 1)   text2 = 'Due in ' + hrs2  + (hrs2  === 1 ? ' hour' : ' hours');
    else if (mins2 >= 1)  text2 = 'Due in ' + mins2 + (mins2 === 1 ? ' minute' : ' minutes');
    else                  text2 = 'Due now!';
    el.textContent = text2;
    el.className   = 'time-chip';
    overdueEl.classList.add('hidden');
  }
}

function applyPriorityIndicator(priority) {
  var card      = document.getElementById('todo-card');
  var badge     = document.getElementById('priority-badge');
  var indicator = document.getElementById('priority-indicator');

  card.classList.remove('priority-high', 'priority-medium', 'priority-low');
  badge.classList.remove('high', 'medium', 'low');
  indicator.classList.remove('high', 'medium', 'low');

  var p = priority.toLowerCase();
  card.classList.add('priority-' + p);
  badge.classList.add(p);
  indicator.classList.add(p);
  badge.textContent = priority;
  badge.setAttribute('aria-label', 'Priority: ' + priority);
  indicator.setAttribute('aria-label', 'Priority indicator: ' + priority);
}

function syncStatus(newStatus) {
  state.status = newStatus;
  state.isDone = (newStatus === 'Done');

  var checkbox = document.getElementById('complete-toggle');
  var badge    = document.getElementById('status-badge');
  var control  = document.getElementById('status-control');
  var title    = document.getElementById('todo-title');
  var card     = document.getElementById('todo-card');

  checkbox.checked  = state.isDone;
  badge.textContent = newStatus;
  badge.className   = 'badge badge-status';
  badge.setAttribute('aria-label', 'Status: ' + newStatus);

  if (newStatus === 'Done') {
    badge.classList.add('done');
    title.classList.add('completed');
    card.classList.add('is-done');
  } else if (newStatus === 'In Progress') {
    badge.classList.add('in-progress');
    title.classList.remove('completed');
    card.classList.remove('is-done');
  } else {
    badge.classList.add('pending');
    title.classList.remove('completed');
    card.classList.remove('is-done');
  }

  control.value = newStatus;
  updateTimeRemaining();
}

function handleToggle(checkbox) {
  if (checkbox.checked) {
    syncStatus('Done');
  } else {
    syncStatus('Pending');
  }
}

function handleStatusChange(select) {
  syncStatus(select.value);
}

function toggleExpand() {
  var section = document.getElementById('collapsible-section');
  var btn     = document.getElementById('expand-toggle');
  var isOpen  = section.classList.contains('expanded');
  if (isOpen) {
    section.classList.remove('expanded');
    section.classList.add('collapsed');
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = 'Show description';
  } else {
    section.classList.remove('collapsed');
    section.classList.add('expanded');
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Hide description';
  }
}

function enterEditMode() {
  savedState = Object.assign({}, state);
  document.getElementById('edit-title-input').value       = state.title;
  document.getElementById('edit-description-input').value = state.description;
  document.getElementById('edit-priority-select').value   = state.priority;
  document.getElementById('edit-due-date-input').value    = state.dueDate;
  document.getElementById('view-mode').classList.add('hidden');
  document.getElementById('edit-mode').classList.remove('hidden');
  document.getElementById('edit-title-input').focus();
}

function saveEdit() {
  var newTitle    = document.getElementById('edit-title-input').value.trim();
  var newDesc     = document.getElementById('edit-description-input').value.trim();
  var newPriority = document.getElementById('edit-priority-select').value;
  var newDueDate  = document.getElementById('edit-due-date-input').value;

  if (newTitle) state.title       = newTitle;
  if (newDesc)  state.description = newDesc;
  state.priority = newPriority;

  if (newDueDate) {
    state.dueDate    = newDueDate;
    state.dueDateISO = newDueDate + 'T18:00:00Z';
    var d = new Date(newDueDate + 'T12:00:00Z');
    state.dueDateDisplay = d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  document.getElementById('todo-title').textContent       = state.title;
  document.getElementById('todo-description').textContent = state.description;
  document.getElementById('todo-due-date').textContent    = state.dueDateDisplay;
  document.getElementById('todo-due-date').setAttribute('datetime', state.dueDateISO);

  applyPriorityIndicator(state.priority);
  updateTimeRemaining();
  exitEditMode();
}

function cancelEdit() {
  state = Object.assign({}, savedState);
  exitEditMode();
}

function exitEditMode() {
  document.getElementById('edit-mode').classList.add('hidden');
  document.getElementById('view-mode').classList.remove('hidden');
  document.getElementById('edit-btn').focus();
}