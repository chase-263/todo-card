# Todo Item Card — HNG Stage 1a

An advanced, interactive Todo / Task Card built with vanilla HTML, CSS, and JavaScript.
This is an upgrade from Stage 0, adding edit mode, status transitions, expand/collapse,
priority indicators, and enhanced time management.

## Live Demo
[View Live](https://chase-263.github.io/todo-card)

## What Changed from Stage 0
- **Edit mode** — clicking Edit opens a form to update title, description, priority and due date. Save applies changes, Cancel restores previous values
- **Status control** — status is now an interactive dropdown (Pending / In Progress / Done) instead of a static badge
- **Status sync** — checkbox, status badge and status dropdown always stay in sync with each other
- **Priority indicator** — card left border and badge color change visually based on Low / Medium / High
- **Expand/collapse** — description is collapsible with a toggle button
- **Granular time** — time remaining now shows "Due in 3 hours", "Due in 45 minutes", "Overdue by 1 hour" etc.
- **Overdue indicator** — a red "Overdue" badge appears when the task is past its due date
- **Done state** — when marked Done, time remaining stops and shows "Completed", title is struck through and card is muted

## New Design Decisions
- Left border accent on card encodes priority at a glance (red = High, orange = Medium, green = Low)
- Status dropdown replaces static badge to make status interactive without entering edit mode
- Description defaults to collapsed to keep the card compact, expand on demand
- Edit form fields stack vertically on mobile for easy tap targets
- On desktop, priority and status align horizontally for a cleaner layout

## Any Known Limitations
- Tags are currently hard-coded and cannot be edited in the edit form
- Due date time is fixed at 18:00 UTC when saved from the edit form
- No data persistence — refreshing the page resets the card to its initial state

## Accessibility Notes
- All form fields in edit mode have visible `<label for="">` elements
- Status dropdown has an accessible name via `aria-label`
- Expand toggle uses `aria-expanded` and `aria-controls` as required
- Collapsible section has a matching `id` referenced by `aria-controls`
- Live time updates use `aria-live="polite"`
- Keyboard tab order: Checkbox → Status control → Expand toggle → Edit → Delete → Save/Cancel (in edit mode)
- Focus returns to the Edit button when edit mode is closed
- All interactive elements have visible focus styles (WCAG AA)
- Color contrast meets WCAG AA standards throughout

## All data-testid Attributes

### Stage 0 (still present)
- `test-todo-card`
- `test-todo-title`
- `test-todo-description`
- `test-todo-priority`
- `test-todo-due-date`
- `test-todo-time-remaining`
- `test-todo-status`
- `test-todo-complete-toggle`
- `test-todo-tags`
- `test-todo-tag-work`
- `test-todo-tag-urgent`
- `test-todo-tag-design`
- `test-todo-edit-button`
- `test-todo-delete-button`

### Stage 1a (new)
- `test-todo-edit-form`
- `test-todo-edit-title-input`
- `test-todo-edit-description-input`
- `test-todo-edit-priority-select`
- `test-todo-edit-due-date-input`
- `test-todo-save-button`
- `test-todo-cancel-button`
- `test-todo-status-control`
- `test-todo-priority-indicator`
- `test-todo-expand-toggle`
- `test-todo-collapsible-section`
- `test-todo-overdue-indicator`

## Tech Stack
- HTML5 (semantic, no frameworks)
- CSS3 (no frameworks)
- Vanilla JavaScript (no frameworks, no libraries)

## How to Run Locally
1. Clone the repo
2. Open `index.html` in your browser or use Live Server in VS Code