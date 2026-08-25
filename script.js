const HOTELS = [
    {
        id: 1,
        name: "Hotel Royal Palace",
        location: "Connaught Place, New Delhi",
        price: 4999,
        rating: "4.6",
        reviews: 1240,
        image: "hotel1",
        tagline: "The classic CP address",
        nearestMetro: "Rajiv Chowk",
        description: "Probably the most well known 4-star in the CP inner circle. Rajiv Chowk metro is at walking distance and Janpath market is even closer. Rooms are big by CP standards, and the rooftop restaurant does very good North Indian food. Works equally well for business trips and weekend stays.",
        amenities: ["Free WiFi", "Swimming Pool", "Restaurant", "Gym", "Room Service", "Free Parking"]
    },
    {
        id: 2,
        name: "The Grand Karol Bagh",
        location: "Karol Bagh, New Delhi",
        price: 2999,
        rating: "4.2",
        reviews: 986,
        image: "hotel2",
        tagline: "Best pick for shopping trips",
        nearestMetro: "Karol Bagh",
        description: "Clean, no-nonsense hotel right in the middle of the Karol Bagh market area, with Gaffar Market 5 minutes on foot. Rooms are simple but comfortable and the in-house restaurant serves both veg and non-veg.",
        amenities: ["Free WiFi", "Restaurant", "Room Service", "Free Parking"]
    },
    {
        id: 3,
        name: "Hotel Skyline",
        location: "Aerocity, New Delhi (Near IGI Airport)",
        price: 5499,
        rating: "4.7",
        reviews: 2105,
        image: "hotel3",
        tagline: "10 min from T3, free shuttle",
        nearestMetro: "Aerocity",
        description: "Business travellers' usual choice near the airport. Free shuttle to all IGI terminals, conference rooms on the first floor, and the multi-cuisine restaurant stays open 24 hours. There is a decent pool and gym as well. Note - prices go up quite a bit in the wedding season, book early.",
        amenities: ["Free WiFi", "Swimming Pool", "Gym", "Restaurant", "Airport Shuttle", "Room Service"]
    },
    {
        id: 4,
        name: "Green Leaf Residency",
        location: "Hauz Khas, New Delhi",
        price: 3499,
        rating: "4.4",
        reviews: 764,
        image: "hotel4",
        tagline: "Quiet property behind HKV",
        description: "A quiet property tucked behind Hauz Khas Village - you can walk to the cafes, the art galleries and Deer Park. Suits couples and younger travellers more than families; the vibe is closer to a homestay than a hotel. The garden at the back is genuinely nice in winter.",
        amenities: ["Free WiFi", "Restaurant", "Garden Area", "Room Service", "Free Parking"]
    },
    {
        id: 5,
        name: "Heritage Inn",
        location: "Chandni Chowk, Old Delhi",
        price: 1999,
        rating: "4.0",
        reviews: 1532,
        image: "hotel5",
        tagline: "Cheapest decent stay in Old Delhi",
        description: "Budget option for exploring Old Delhi on foot. Red Fort, Jama Masjid and Paranthe Wali Gali are all nearby, so you can cover the whole area without spending too much money on autos. Rooms are basic but clean.",
        amenities: ["Free WiFi", "Room Service", "Restaurant"]
    },
    {
        id: 6,
        name: "Hotel City Park",
        location: "Dwarka, New Delhi",
        price: 2499,
        rating: "4.1",
        reviews: 645,
        image: "hotel6",
        tagline: "Good for families, right on the metro line",
        nearestMetro: "Dwarka Sector 21",
        description: "Family hotel in Dwarka with proper parking and a kids play area. The metro is very close, which makes it easy to reach any part of Delhi. Spacious family rooms - nothing fancy, but reliable.",
        amenities: ["Free WiFi", "Free Parking", "Restaurant", "Kids Play Area", "Room Service"]
    }
];

const RATE_EXTRAS = { standard: 0, deluxe: 1000, suite: 2500 };

const COUPONS = {
    FIRST20: { percent: 20 },
    WEEKEND15: { percent: 15 },
    AERO500: { flat: 500, areaOnly: "Aerocity" }
};

const $ = (sel) => document.querySelector(sel);

let activeHotel = null;
let activeCoupon = null;

/*  header */

const siteNav = $("#site-nav");
$(".menu-toggle").addEventListener("click", () => siteNav.classList.toggle("open"));
siteNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") siteNav.classList.remove("open");
});



$("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = $("#destination").value.trim().toLowerCase();
    const note = $(".search-note");

    if (!query.includes("delhi")) {
        note.textContent = "We only have hotels in Delhi right now – try searching for Delhi.";
        note.hidden = false;
        return;
    }
    note.hidden = true;
    renderResults();
});

function renderResults() {
    $("#hotel-list").innerHTML = HOTELS.map((hotel) => `
        <article class="hotel-card">
            <img class="hotel-photo" src="images/${hotel.image}.jpg" alt="${hotel.name}">
            <div class="hotel-summary">
                <h3>${hotel.name}</h3>
                <p class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${hotel.location}</p>
                <p class="tagline">${hotel.tagline}</p>
            </div>
            <div class="hotel-cta">
                <p class="price">₹${hotel.price} <span>/ night</span></p>
                <a class="btn" href="#hotel-${hotel.id}">View Details</a>
            </div>
        </article>`).join("");

    $("#result-count").textContent = HOTELS.length + " properties found in Delhi";
    $("#results").hidden = false;
    $("#results").scrollIntoView({ behavior: "smooth" });
}

$(".area-grid").addEventListener("click", (e) => {
    if (!e.target.closest(".area-card")) return;
    $("#destination").value = "Delhi, India";
    renderResults();
});

/*  offers*/

document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        navigator.clipboard?.writeText(btn.dataset.code);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy Code"), 1500);
    });
});


function handleRoute() {
    const match = location.hash.match(/^#hotel-(\d+)$/);
    if (match) {
        openHotel(Number(match[1]));
    } else {
        $("#hotel-view").hidden = true;
        $("#search-view").hidden = false;
        document.title = "DelhiStay - Book Hotels in Delhi";
    }
}

function openHotel(id) {
    activeHotel = HOTELS.find((h) => h.id === id);
    if (!activeHotel) {
        location.hash = "";
        return;
    }

    $("#hotel-name").textContent = activeHotel.name;
    let locationText = activeHotel.location;
    if (activeHotel.nearestMetro) {
        locationText += " · nearest metro: " + activeHotel.nearestMetro;
    }
    $("#hotel-location").textContent = locationText;
    $("#hotel-rating").innerHTML = `${activeHotel.rating} <i class="fa-solid fa-star"></i>`;
    $("#hotel-reviews").textContent = activeHotel.reviews + " reviews";
    $("#hotel-desc").textContent = activeHotel.description;
    $("#hotel-price").textContent = activeHotel.price;
    $("#hotel-photo").src = "images/" + activeHotel.image + ".jpg";
    $("#hotel-photo").alt = activeHotel.name;

    let items = "";
    for (const amenity of activeHotel.amenities) {
        items += `<li><i class="fa-solid fa-check"></i> ${amenity}</li>`;
    }
    $("#hotel-amenities").innerHTML = items;

    if ($("#search-checkin").value) $("#checkin").value = $("#search-checkin").value;
    if ($("#search-checkout").value) $("#checkout").value = $("#search-checkout").value;
    $("#room-count").value = $("#search-rooms").value;
    $("#guest-count").value = $("#search-guests").value;

    resetBookingPanel();
    updateTotal();

    $("#search-view").hidden = true;
    $("#hotel-view").hidden = false;
    document.title = activeHotel.name + " - DelhiStay";
    window.scrollTo(0, 0);
}

window.addEventListener("hashchange", handleRoute);
handleRoute();

/*  booking */

const bookingForm = $("#booking-form");

const nightsBetween = (from, to) => (new Date(to) - new Date(from)) / 86400000;

function updateTotal() {
    if (!activeHotel) return { total: 0, discount: 0, nights: 0 };

    const nights = nightsBetween($("#checkin").value, $("#checkout").value);
    const nightly = activeHotel.price + RATE_EXTRAS[$("#room-type").value];
    const total = nights > 0 ? nights * nightly * $("#room-count").value : 0;

    let discount = 0;
    const coupon = COUPONS[activeCoupon];
    if (coupon) {
        discount = coupon.percent ? Math.round((total * coupon.percent) / 100) : coupon.flat;
        discount = Math.min(discount, total);
    }

    const discountLine = $("#discount-line");
    discountLine.hidden = !discount;
    discountLine.textContent = `Coupon discount: -₹${discount}`;
    $("#total-amount").textContent = `Total: ₹${total - discount}`;

    return { total, discount, nights };
}

for (const id of ["checkin", "checkout", "room-type", "room-count"]) {
    document.getElementById(id).addEventListener("change", updateTotal);
}

$("#apply-coupon").addEventListener("click", () => {
    const code = $("#coupon-code").value.trim().toUpperCase();
    const msg = $("#coupon-msg");
    const coupon = COUPONS[code];

    if (!coupon) {
        activeCoupon = null;
        msg.textContent = code ? "Invalid coupon code" : "Enter a coupon code first";
        msg.className = "coupon-msg error";
    } else if (coupon.areaOnly && !activeHotel.location.includes(coupon.areaOnly)) {
        activeCoupon = null;
        msg.textContent = `${code} is only valid for ${coupon.areaOnly} hotels`;
        msg.className = "coupon-msg error";
    } else {
        activeCoupon = code;
        msg.textContent = `${code} applied – ${coupon.percent ? coupon.percent + "% off" : "flat ₹" + coupon.flat + " off"}`;
        msg.className = "coupon-msg ok";
    }
    updateTotal();
});

bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const { total, discount, nights } = updateTotal();
    const formError = $("#form-error");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (nights <= 0) {
        formError.textContent = "Check-out must be after check-in.";
        formError.hidden = false;
        return;
    }
    if (new Date($("#checkin").value) < today) {
        formError.textContent = "Check-in date can't be in the past.";
        formError.hidden = false;
        return;
    }
    formError.hidden = true;

    $("#conf-ref").textContent = "DST" + Date.now().toString().slice(-6);
    $("#conf-hotel").textContent = activeHotel.name;
    $("#conf-room").textContent = `${$("#room-type").selectedOptions[0].text} × ${$("#room-count").value} · ${$("#guest-count").value} guests`;
    $("#conf-dates").textContent = `${$("#checkin").value} → ${$("#checkout").value} (${nights} night${nights > 1 ? "s" : ""})`;
    $("#conf-total").textContent = "₹" + (total - discount);
    $("#conf-email").textContent = $("#guest-email").value;

    $("#conf-discount-row").hidden = !discount;
    if (discount) $("#conf-discount").textContent = `${activeCoupon} (-₹${discount})`;

    bookingForm.hidden = true;
    $("#booking-confirm").hidden = false;
});

$("#book-again").addEventListener("click", () => {
    bookingForm.reset();
    resetBookingPanel();
    updateTotal();
});

function resetBookingPanel() {
    activeCoupon = null;
    $("#coupon-code").value = "";
    $("#coupon-msg").textContent = "";
    $("#discount-line").hidden = true;
    $("#form-error").hidden = true;
    bookingForm.hidden = false;
    $("#booking-confirm").hidden = true;
}
