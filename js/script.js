// Burger menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const body = document.getElementById("top");
const aboutHeader = document.getElementById("header-about");
const phoneHeader = document.getElementById("header-phone");
const contactsHeader = document.getElementById("header-contacts");
const sslCert = document.getElementById("ssl-cert");

burger?.addEventListener("click", () => {
  burger.classList.toggle("active");
  body.classList.toggle("lock");
  aboutHeader.classList.toggle("hide");
  phoneHeader.classList.toggle("hide");
  sslCert.classList.toggle("hide");
  contactsHeader.classList.toggle("show");
  const open = nav.classList.toggle("open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
// Close menu on link click (mobile)
nav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      nav.classList.remove("open");
      burger.classList.remove("active");
      body.classList.remove("lock");
      aboutHeader.classList.remove("hide");
      phoneHeader.classList.remove("hide");
      sslCert.classList.remove("hide");
      contactsHeader.classList.remove("show");
      burger.setAttribute("aria-expanded", "false");
    }
  })
);
// Kalkulator
(function () {
  const money = (v) =>
    new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(v);
  const rows = Array.from(document.querySelectorAll(".price-table tbody tr"));
  if (!rows.length) return;
  const vatEl = document.getElementById("vat");
  const sumNettoEl = document.getElementById("sumNetto");
  const sumVatEl = document.getElementById("sumVat");
  const sumTotalEl = document.getElementById("sumTotal");
  const sumTotalEl2 = document.getElementById("sumTotal2");
  function recalc() {
    let netto = 0;
    rows.forEach((row) => {
      const price = Number(row.dataset.price || 0);
      const qty = Math.max(0, Number(row.querySelector(".qty").value || 0));
      const line = price * qty;
      row.querySelector(".line-sum").textContent = money(line).replace(
        "\u00A0",
        " "
      );
      netto += line;
    });
    sumNettoEl.textContent = money(netto).replace("\u00A0", " ");
    const vat = vatEl && vatEl.checked ? Math.round(netto * 0.23) : 0;
    sumVatEl.textContent = money(vat).replace("\u00A0", " ");
    sumTotalEl.textContent = money(netto + vat).replace("\u00A0", " ");
    sumTotalEl2.textContent = money(netto + vat).replace("\u00A0", " ");
  }
  rows.forEach((r) =>
    r.querySelector(".qty").addEventListener("input", recalc)
  );
  if (vatEl) vatEl.addEventListener("change", recalc);
  recalc();
})();
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) =>
  anchor.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
      }
    }
  })
);
// Year
document.getElementById("y").textContent = new Date().getFullYear();

//poupup
const popup = document.getElementById("pricing-popup");
const openBtn = document.getElementById("openPricing");
const closeBtn = document.querySelector(".popup-close");
const rows = document.querySelectorAll(".price-table tr");
const pageContent = document.querySelector(".page-content");

openBtn.addEventListener("click", () => {
  popup.classList.add("active");
  pageContent.classList.add("blurred");
  body.classList.toggle("lock");
  rows.forEach((row, index) => {
    setTimeout(() => {
      row.classList.add("show");
    }, index * 100);
  });
});

function closePopup() {
  popup.classList.remove("active");
  pageContent.classList.remove("blurred");
  body.classList.remove("lock");
  rows.forEach((row) => row.classList.remove("show"));
}

closeBtn.addEventListener("click", closePopup);

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    closePopup();
  }
});

// Swiper
const swiper = new Swiper(".swiper", {
  // Optional parameters
  spaceBetween: 30,
  centeredSlides: true,
  effect: "fade",
  centeredSlides: true,
  loop: true,
  // navigation: false,
  noSwipingClass: "swiper-slide",
  slidesPerView: "auto",
  spaceBetween: 15,
  speed: 2500,
  autoplay: {
    delay: 11000,
    disableOnInteraction: false,
    reverseDirection: false,
  },
  keyboard: {
    enabled: true,
  },
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});

// Form send message to WhatsApp and Messenger
function getFormData() {
  const form = document.getElementById("contactForm");
  const formData = new FormData(form);
  const name = formData.get("name");
  // const email = formData.get("email");
  const message = formData.get("message");

  return { name, message };
}

// WhatsApp send
document.getElementById("sendWhatsApp").addEventListener("click", function () {
  const { name, message } = getFormData();
  const phone = "48600580984"; // <-- WhatsApp number

  const text = `👤 *Imię i nazwisko:* ${name}%0A
💬 *Wiadomość:* _${message}_`;

  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    navigator.userAgent
  );
  const url = isMobile
    ? `whatsapp://send?phone=${phone}&text=${text}`
    : `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;

  const confirmSend = confirm(
    "✅ Twoja wiadomość została przygotowana.\nKliknij OK, aby otworzyć WhatsApp."
  );
  if (confirmSend) {
    window.open(url, "_blank");
    document.getElementById("contactForm").reset();
  }
});

// Scroll to top
const scrollTop = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    scrollTop.classList.add("show");
  } else {
    scrollTop.classList.remove("show");
  }
});

scrollTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Hide overlay after 3 seconds with fade-out
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const overlay = document.getElementById("consent-overlay");
    overlay.style.opacity = "0";
    // Remove from DOM after transition
    setTimeout(() => overlay.remove(), 600);
  }, 3000);
});
