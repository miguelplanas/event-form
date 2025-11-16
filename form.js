// Init TinyMCE
tinymce.init({
  selector: '#agenda',
  height: 150,
  menubar: false
});

// CHANGE THIS → Your n8n webhook URL:
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/event/create";;

document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Extract TinyMCE HTML
  const agendaHtml = tinymce.get("agenda").getContent();

  // Extract form fields
  const payload = {
    "Event title": document.getElementById("event_title").value.trim(),
    "Region": document.getElementById("region").value.trim(),
    "Date": document.getElementById("date").value,
    "Timeline": document.getElementById("timeline").value.trim(),
    "Register": document.getElementById("register").value.trim(),
    "Title": document.getElementById("title").value.trim(),
    "Why to attend": document.getElementById("why_to_attend").value.trim(),
    "Speaker": document.getElementById("speaker").value.trim(),
    "Slides Title": document.getElementById("slides_title").value.trim(),
    "Slides Link": document.getElementById("slides_link").value.trim(),
    "Agenda": agendaHtml,
    "Feedback form": document.getElementById("feedback_form").value.trim(),
    "Questions": document.getElementById("questions").value.trim(),
    "Invitations": document.getElementById("invitations").value.trim()
  };

  // SHOW SENDING
  document.getElementById("result").textContent = "Sending...";

  try {
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let data;

    try {
    data = JSON.parse(text);
    } catch {
    data = { raw: text, error: "Not JSON" };
    }

    document.getElementById("result").textContent =
      JSON.stringify(data, null, 2);

  } catch (err) {
    document.getElementById("result").textContent = "Error: " + err.message;
  }
});
