// Fixed due date — as per spec
var DUE_DATE = new Date("2026-04-16T18:00:00Z");

// Calculate and return friendly time remaining text
function calcTimeRemaining() {
  var now  = new Date();
  var diff = DUE_DATE - now;

  if (diff <= 0) {
    var abs   = Math.abs(diff);
    var oDays = Math.floor(abs / 86400000);
    var oHrs  = Math.floor(abs / 3600000);
    var oMins = Math.floor(abs / 60000);

    if (oDays >= 1) return { text: "Overdue by " + oDays + (oDays === 1 ? " day" : " days"), overdue: true };
    if (oHrs  >= 1) return { text: "Overdue by " + oHrs  + (oHrs  === 1 ? " hour" : " hours"), overdue: true };
                    return { text: "Overdue by " + oMins  + " min"  + (oMins  === 1 ? "" : "s"), overdue: true };
  }

  var days  = Math.floor(diff / 86400000);
  var hours = Math.floor(diff / 3600000);
  var mins  = Math.floor(diff / 60000);

  if (mins  < 60) return { text: "Due now!",                 overdue: false };
  if (hours < 24) return { text: "Due today",                overdue: false };
  if (days === 1) return { text: "Due tomorrow",             overdue: false };
                  return { text: "Due in " + days + " days", overdue: false };
}

// Update the time remaining chip in the DOM
function updateTimeRemaining() {
  var el = document.getElementById("time-remaining");
  var r  = calcTimeRemaining();
  el.textContent = r.text;
  el.classList.toggle("overdue", r.overdue);
}

// Run immediately on page load, then every 60 seconds
updateTimeRemaining();
setInterval(updateTimeRemaining, 60000);

// Checkbox toggle:
// - strike-through title
// - change status to "Done"
function handleToggle(checkbox) {
  var title  = document.getElementById("todo-title");
  var status = document.getElementById("status-badge");

  if (checkbox.checked) {
    title.classList.add("completed");
    status.textContent = "Done";
    status.classList.add("done");
    status.setAttribute("aria-label", "Status: Done");
  } else {
    title.classList.remove("completed");
    status.textContent = "In Progress";
    status.classList.remove("done");
    status.setAttribute("aria-label", "Status: In Progress");
  }
}