function createLead(url, type) {
  fetch("https://app.tyreemergency.com/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, type }),
  }).catch((error) => {
    console.error("Failed to create lead:", error);
  });
}

const currentUrl = window.location.href;

// Phone call tracking
document.body.addEventListener("click", function (event) {
  const target = event.target.closest('a[href^="tel:"]');
  if (!target) return;
  createLead(currentUrl, "Phone");
});

// WhatsApp widget tracking
const whatsappWidget = document.getElementById("whatsappWidget");
if (whatsappWidget) {
  whatsappWidget.addEventListener("click", function () {
    createLead(currentUrl, "Chat");
  });
}

// Form submission tracking
const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", function (event) {
    event.preventDefault(); // optional, depends on your form logic
    createLead(currentUrl, "Form");
    setTimeout(() => quoteForm.submit(), 300); // allow lead to be sent
  });
}
