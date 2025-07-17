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

  if (utmSource === "gmb") {
    return "gmb_bilsthorpe";
  }

  if (utmSource === "gmb2") {
    return "gmb_worksop";
  }

  if (utmSource === "gmb3") {
    return "gmb_newark";
  }

  if (/google\./.test(referrer)) {
    return "organic";
  }

  if (!referrer) {
    return "direct";
  }

  return "unknown";
}

function sendCallTracking(url, source) {
  fetch("https://app.tyreemergency.com/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
      type: "Phone",
      source: source,
      status: "Pending"
    }),
  }).catch((error) => {
    console.error("Failed to send call tracking data:", error);
  });
}


document.body.addEventListener("click", function (event) {
    const target = event.target.closest('a[href^="tel:"]');
    if (!target) return;
    const currentUrl = window.location.href;
    const source = detectSource();
    sendCallTracking(currentUrl, source)
})