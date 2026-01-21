const RAZORPAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const existing = document.querySelector(`script[src="${RAZORPAY_SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SDK_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// "1999.00" -> 199900 (paise)
function rupeesToPaise(amountStr) {
  const [r, p = "00"] = String(amountStr).split(".");
  const rupees = r.replace(/[^\d]/g, "") || "0";
  const paise = (p + "00").slice(0, 2).replace(/[^\d]/g, "0");
  return Number(`${rupees}${paise}`);
}

// 1999 or 1999.0 -> "1999.00"
function toRupeesString(num) {
  const n = Number(num);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2);
}