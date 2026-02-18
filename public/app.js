document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("emailForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending...";

    const to = document.getElementById("to").value.trim();
    const name = document.getElementById("name").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message, name }),
      });

      const json = await res.json();
      if (res.ok) {
        status.textContent = json.message || "Email sent";
        form.reset();
      } else {
        status.textContent = json.error || "Failed to send email";
      }
    } catch (err) {
      status.textContent = err.message || "Network error";
    }
  });
});
