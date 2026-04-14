/* ============================================================
   STATE — single source of truth
============================================================ */
var state = {
  title: 'Build a Testable Todo Item Card',
  description: 'Create a clean, modern Todo / Task Card component with all required data-testid attributes, semantic HTML, accessibility features, and a responsive layout from 320px to 1200px.',
  priority: 'High',
  status: 'In Progress',
  dueDate: '2026-04-16',
  dueDateDisplay: 'Apr 16, 2026',
  dueDateISO: '2026-04-16T18:00:00Z',
  isDone: false
};

// Saved snapshot for cancel
var savedState = Object.assign({}, state);

/* ============================================================
   ON PAGE LOAD
============================================================ */
window.onload = function () {
  applyPriorityIndicator(state.priority);
  updateTimeRemaining();
  setInterval(updateTimeRemaining, 30000);
};

/* ============================================================
   TIME REMAINING
   Granular: "Due in 2 days", "Due in 3 hours",
             "Due in 45 minutes", "Overdue by 1 hour"
   If Done: show "Completed"
============================================================ */
function updateTimeRemaining() {
  var el        = document.getElementById('time-remaining');
  var overdueEl = document.getElementById('overdue-indicator');
  var card      = document.getElementById('todo-card');

  // If task is done — stop updating, show Completed
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
    // Overdue — granular
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
    card.classList.add('is-overdue');

  } else {
    // Not yet due — granular
    var days2 = Math.floor(diff / 86400000);
    var hrs2  = Math.floor(diff / 3600000);
    var mins2 = Math.floor(diff / 60000);

    var text2;
    if (days2 >= 2)     text2 = 'Due in ' + days2 + ' days';
    else if (days2 === 1) text2 = 'Due tomorrow';
    else if (hrs2 >= 1)  text2 = 'Due in ' + hrs2  + (hrs2  === 1 ? ' hour' : ' hours');
    else if (mins2 >= 1) text2 = 'Due in ' + mins2 + (mins2 === 1 ? ' minute' : ' minutes');
    else                 text2 = 'Due now!';

    el.textContent = text2;
    el.className   = 'time-chip';
    overdueEl.classList.add('hidden');
  }
}

/* ============================================================
   PRIORITY INDICATOR
   Changes card left border + badge class
============================================================ */
function applyPriorityIndicator(priority) {
  var card  = document.getElementById('todo-card');
  var badge = document.getElementById('priority-badge');

  // Remove old priority classes
  card.classList.remove('priority-high', 'priority-medium', 'priority-low');
  badge.classList.remove('high', 'medium', 'low');

  if (priority === 'High') {
    card.classList.add('priority-high');
    badge.classList.add('high');
    badge.textContent = 'High';
    badge.setAttribute('aria-label', 'Priority: High');
  } else if (priority === 'Medium') {
    card.classList.add('priority-medium');
    badge.classList.add('medium');
    badge.textContent = 'Medium';
    badge.setAttribute('aria-label', 'Priority: Medium');
  } else {
    card.classList.add('priority-low');
    badge.classList.add('low');
    badge.textContent = 'Low';
    badge.setAttribute('aria-label', 'Priority: Low');
  }
}

/* ============================================================
   STATUS SYNC
   Keeps checkbox, status badge and status control in sync
============================================================ */
function syncStatus(newStatus) {
  state.status  = newStatus;
  state.isDone  = (newStatus === 'Done');

  var checkbox  = document.getElementById('complete-toggle');
  var badge     = document.getElementById('status-badge');
  var control   = document.getElementById('status-control');
  var title     = document.getElementById('todo-title');
  var card      = document.getElementById('todo-card');

  // Sync checkbox
  checkbox.checked = state.isDone;

  // Sync status badge text + class
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

  // Sync dropdown
  control.value = newStatus;

  // Update time remaining (stops if Done)
  updateTimeRemaining();
}

/* ============================================================
   CHECKBOX TOGGLE
   If checked → Done
   If unchecked after Done → Pending
============================================================ */
function handleToggle(checkbox) {
  if (checkbox.checked) {
    syncStatus('Done');
  } else {
    syncStatus('Pending');
  }
}

/* ============================================================
   STATUS DROPDOWN CHANGE
============================================================ */
function handleStatusChange(select) {
  syncStatus(select.value);
}

/* ============================================================
   EXPAND / COLLAPSE DESCRIPTION
============================================================ */
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

/* ============================================================
   EDIT MODE — Enter
   Populates form fields with current state values
============================================================ */
function enterEditMode() {
  // Save snapshot for cancel
  savedState = Object.assign({}, state);

  // Populate form fields
  document.getElementById('edit-title-input').value       = state.title;
  document.getElementById('edit-description-input').value = state.description;
  document.getElementById('edit-priority-select').value   = state.priority;
  document.getElementById('edit-due-date-input').value    = state.dueDate;

  // Switch views
  document.getElementById('view-mode').classList.add('hidden');
  document.getElementById('edit-mode').classList.remove('hidden');

  // Focus first input
  document.getElementById('edit-title-input').focus();
}

/* ============================================================
   EDIT MODE — Save
   Updates state and refreshes the card display
============================================================ */
function saveEdit() {
  var newTitle    = document.getElementById('edit-title-input').value.trim();
  var newDesc     = document.getElementById('edit-description-input').value.trim();
  var newPriority = document.getElementById('edit-priority-select').value;
  var newDueDate  = document.getElementById('edit-due-date-input').value;

  // Update state
  if (newTitle)    state.title       = newTitle;
  if (newDesc)     state.description = newDesc;
  state.priority = newPriority;

  if (newDueDate) {
    state.dueDate    = newDueDate;
    state.dueDateISO = newDueDate + 'T18:00:00Z';
    // Format display date nicely
    var d = new Date(newDueDate + 'T12:00:00Z');
    state.dueDateDisplay = d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }

  // Update DOM
  document.getElementById('todo-title').textContent       = state.title;
  document.getElementById('todo-description').textContent = state.description;
  document.getElementById('todo-due-date').textContent    = state.dueDateDisplay;
  document.getElementById('todo-due-date').setAttribute('datetime', state.dueDateISO);

  applyPriorityIndicator(state.priority);
  updateTimeRemaining();

  // Exit edit mode
  exitEditMode();
}

/* ============================================================
   EDIT MODE — Cancel
   Restores previous state, no changes saved
============================================================ */
function cancelEdit() {
  state = Object.assign({}, savedState);
  exitEditMode();
}

/* ============================================================
   EXIT EDIT MODE
   Returns focus to Edit button as per spec
============================================================ */
function exitEditMode() {
  document.getElementById('edit-mode').classList.add('hidden');
  document.getElementById('view-mode').classList.remove('hidden');

  // Return focus to Edit button as per spec
  document.getElementById('edit-btn').focus();
}