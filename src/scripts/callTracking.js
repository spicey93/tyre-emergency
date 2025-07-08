function detectSource() {
  const referrer = document.referrer;
  const urlParams = new URLSearchParams(window.location.search);

  const utmSource = urlParams.get("utm_source")?.toLowerCase();
  const utmMedium = urlParams.get("utm_medium")?.toLowerCase();

  // Google Ads via UTM or auto-tagging (gclid)
  if (
    (utmSource === "google" && (utmMedium === "cpc" || utmMedium === "ppc")) ||
    urlParams.has("gclid")
  ) {
    return "google_ads";
  }

  if (utmSource === "facebook" || /facebook\.com/.test(referrer)) {
    return "facebook";
  }

  if (/google\.com\/maps/.test(referrer)) {
    return "google_my_business";
  }

  // if (utmSource === "gmb") {
  //   return "gmb_bilsthorpe"
  // }

  // if (utmSource === "gmb2") {
  //   return "gmb_worksop"
  // }

  // if (utmSource === "gmb3") {
  //   return "gmb_newark"
  // }

  if (/google\./.test(referrer)) {
    return "organic";
  }

  if (!referrer) {
    return "direct";
  }

  return "unknown";
}

document.addEventListener("DOMContentLoaded", function () {
  let userIP = null;
  let pendingCall = null;
  let isSending = false;
  let lastSentAt = 0;
  const cooldown = 2000; // 2 seconds between sends

  // Fetch IP address and cache it
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      userIP = data.ip;

      if (pendingCall) {
        sendCallTracking(
          pendingCall.phone,
          pendingCall.url,
          pendingCall.source
        );
        pendingCall = null;
      }
    })

    .catch((error) => {
      console.error("Failed to fetch IP address:", error);
    });

  document.body.addEventListener("click", function (event) {
    const target = event.target.closest('a[href^="tel:"]');
    if (!target) return;

    const currentUrl = window.location.href;
    const phoneNumber = target.getAttribute("href");
    const source = detectSource(); // ✅ CALL THIS HERE

    // Guard against rapid clicks
    const now = Date.now();
    if (now - lastSentAt < cooldown) {
      console.warn("Ignoring rapid click on tel link.");
      return;
    }

    if (userIP) {
      sendCallTracking(phoneNumber, currentUrl, source);
    } else {
      pendingCall = { phone: phoneNumber, url: currentUrl, source: source };
    }

    lastSentAt = now;
  });

  function sendCallTracking(phone, url, source) {
    if (isSending) return;

    isSending = true;
    fetch("https://futyre.co.uk/phones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url, // ✅ Use function argument
        phone: phone, // ✅ Use function argument
        ip: userIP,
        source: source,
        user: "6743863ef0cc6a823145f385"
      }),
    })
      .catch((error) => {
        console.error("Failed to send call tracking data:", error);
      })
      .finally(() => {
        isSending = false;
      });
  }
});
