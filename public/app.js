document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("emailForm");
  const status = document.getElementById("status");
  const toast = document.getElementById('toast');
  const sendBtn = document.getElementById('sendBtn');
  const resetBtn = document.getElementById('resetBtn');

  const pvTo = document.getElementById('pv-to');
  const pvSubject = document.getElementById('pv-subject');
  const pvMessage = document.getElementById('pv-message');

  function showToast(text, duration = 3500) {
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  function setSending(sending) {
    if (sending) {
      sendBtn.classList.add('sending');
      sendBtn.setAttribute('aria-busy', 'true');
      sendBtn.disabled = true;
    } else {
      sendBtn.classList.remove('sending');
      sendBtn.removeAttribute('aria-busy');
      sendBtn.disabled = false;
    }
  }

  // Live preview updates
  const inputs = ['to','subject','message'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      pvTo.textContent = document.getElementById('to').value || '—';
      pvSubject.textContent = document.getElementById('subject').value || '(No subject)';
      pvMessage.textContent = document.getElementById('message').value || 'Start typing your message to see a live preview.';
    });
  });

  resetBtn.addEventListener('click', () => {
    form.reset();
    pvTo.textContent = '—';
    pvSubject.textContent = '(No subject)';
    pvMessage.textContent = 'Start typing your message to see a live preview.';
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setSending(true);

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
        showToast(json.message || "Email sent");
        form.reset();
        // reset preview
        pvTo.textContent = '—';
        pvSubject.textContent = '(No subject)';
        pvMessage.textContent = 'Start typing your message to see a live preview.';
      } else {
        showToast(json.error || "Failed to send email");
      }
    } catch (err) {
      showToast(err.message || "Network error");
    } finally {
      setSending(false);
    }
  });
});
