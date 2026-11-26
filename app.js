
/* ===================== EDIT ME ===================== */

const OWNERS = [
    {
        id: "1544876770791129105",
        role: "Owner",
        fallback: {
            bio: "Founder of Ruby Hub."
        }
    },
    {
        id: "1287472260394782870",
        role: "Co-Owner",
        fallback: {
            bio: "Co-owner of Ruby Hub."
        }
    }
];

const SCRIPTS = [
    {
        name: "Example Script 1",
        game: "Universal",
        desc: "Replace this with what your script does.",
        code: 'loadstring(game:HttpGet("https://YOUR-HOST/script1.lua"))()'
    },
    {
        name: "Example Script 2",
        game: "Your Game",
        desc: "Another placeholder. Swap in your real loadstring.",
        code: 'loadstring(game:HttpGet("https://YOUR-HOST/script2.lua"))()'
    }
];

/* =================================================== */

const $ = s => document.querySelector(s);

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[c]));

let tt;

function toast(message) {
    const t = $("#toast");
    if (!t) return;

    t.textContent = message;
    t.classList.add("show");

    clearTimeout(tt);

    tt = setTimeout(() => {
        t.classList.remove("show");
    }, 1800);
}

/* ===================== SCRIPTS ===================== */

let filter = "All";

const games = [
    "All",
    ...new Set(SCRIPTS.map(s => s.game))
];

function renderScripts() {
    const q = $("#q");
    const chips = $("#chips");
    const grid = $("#grid");

    if (!q || !chips || !grid) return;

    const search = q.value.trim().toLowerCase();

    chips.innerHTML = games.map(g => `
        <button class="chip ${g === filter ? "on" : ""}"
            data-g="${esc(g)}">
            ${esc(g)}
        </button>
    `).join("");

    const results = SCRIPTS
        .map((s, i) => ({ s, i }))
        .filter(({ s }) =>
            (filter === "All" || s.game === filter) &&
            (s.name + s.game + s.desc).toLowerCase().includes(search)
        );

    grid.innerHTML = results.length
        ? results.map(({ s, i }) => `
            <article class="card">
                <div class="top">
                    <span class="tag">${esc(s.game)}</span>
                </div>

                <h3>${esc(s.name)}</h3>
                <p>${esc(s.desc)}</p>

                <div class="code">${esc(s.code)}</div>

                <button class="btn sm" data-i="${i}">
                    Copy script
                </button>
            </article>
        `).join("")
        : '<div class="empty">No scripts found.</div>';
}

$("#chips")?.addEventListener("click", e => {
    const b = e.target.closest("[data-g]");
    if (!b) return;

    filter = b.dataset.g;
    renderScripts();
});

$("#q")?.addEventListener("input", renderScripts);

$("#grid")?.addEventListener("click", async e => {
    const b = e.target.closest("[data-i]");
    if (!b) return;

    const script = SCRIPTS[Number(b.dataset.i)];
    if (!script) return;

    try {
        await navigator.clipboard.writeText(script.code);
        toast("Copied to clipboard");
    } catch {
        toast("Copy failed, select it manually");
    }
});

if ($("#count")) {
    $("#count").textContent = SCRIPTS.length;
}

/* ===================== DISCORD OWNERS ===================== */

const fetchJ = async (url, ms = 10000) => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
        controller.abort();
    }, ms);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } finally {
        clearTimeout(timer);
    }
};

function defAv(id) {
    try {
        const index = Number((BigInt(id) >> 22n) % 6n);
        return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
    } catch {
        return "https://cdn.discordapp.com/embed/avatars/0.png";
    }
}

function getAvatar(id, hash) {
    if (!hash) return defAv(id);

    if (hash.startsWith("http")) return hash;

    const extension = hash.startsWith("a_") ? "gif" : "png";

    return `https://cdn.discordapp.com/avatars/${id}/${hash}.${extension}?size=256`;
}

function normalizeColor(color) {
    if (typeof color === "number") {
        return "#" + color.toString(16).padStart(6, "0");
    }

    if (typeof color === "string" && color) {
        return color.startsWith("#") ? color : "#" + color;
    }

    return "";
}

/* ===================== GRUX API ===================== */

async function getOwner(o) {
    const d = {
        name: "Discord User",
        username: "",
        avatar: defAv(o.id),
        banner: "",
        color: "",
        bio: o.fallback?.bio || "",
        status: "offline",
        activity: ""
    };

    try {
        const result = await fetchJ(
            `https://grux.audibert.dev/user/${encodeURIComponent(o.id)}`
        );

        const data = result.data || result;
        const profile = data.profile || {};
        const user = data.user || profile;

        d.name =
            profile.display_name ||
            user.global_name ||
            user.display_name ||
            user.username ||
            d.name;

        d.username =
            profile.username ||
            user.username ||
            "";

        d.avatar =
            profile.avatar_url ||
            profile.avatar ||
            user.avatar_url ||
            getAvatar(o.id, user.avatar);

        d.banner =
            profile.banner_url ||
            profile.banner ||
            user.banner_url ||
            "";

        d.color = normalizeColor(
            profile.accent_color ||
            user.accent_color ||
            ""
        );

        d.bio =
            profile.bio ||
            o.fallback?.bio ||
            "";

        d.status =
            data.discord_status ||
            data.status ||
            "offline";

        const activities = data.activities || [];

        const custom = activities.find(a => a.type === 4);

        if (custom?.state) {
            d.activity = custom.state;
        }

    } catch (error) {
        console.warn(`Grux API failed for ${o.id}:`, error);
    }

    return d;
}

/* ===================== OWNER CARDS ===================== */

function card(o, d) {
    const bg = d.banner
        ? `background-image:url('${esc(d.banner)}')`
        : d.color
            ? `background:${esc(d.color)}`
            : "";

    return `
        <article class="pcard" data-r>
            <div class="banner" style="${bg}"></div>

            <div class="pbody">

                <div class="avwrap">
                    <img
                        src="${esc(d.avatar)}"
                        alt=""
                        referrerpolicy="no-referrer"
                        onerror="this.onerror=null;this.src='${defAv(o.id)}'"
                    >

                    <span
                        class="dot ${esc(d.status)}"
                        title="${esc(d.status)}">
                    </span>
                </div>

                <div class="pname">
                    <h3>${esc(d.name)}</h3>
                    <span class="role">${esc(o.role)}</span>
                </div>

                ${d.username
                    ? `<div class="uname">@${esc(d.username)}</div>`
                    : ""}

                ${d.activity
                    ? `<div class="act">${esc(d.activity)}</div>`
                    : ""}

                <p class="bio">${esc(d.bio)}</p>

                <a
                    class="btn sm"
                    href="https://discord.com/users/${encodeURIComponent(o.id)}"
                    target="_blank"
                    rel="noopener noreferrer">
                    View on Discord
                </a>

            </div>
        </article>
    `;
}

/* ===================== LOAD TEAM ===================== */

async function loadTeam() {
    const box = $("#team");

    if (!box) {
        console.error("Team container #team was not found.");
        return;
    }

    box.innerHTML = OWNERS.map((o, i) => `
        <div id="owner-${i}">
            ${card(o, {
                name: "Loading...",
                username: "",
                avatar: defAv(o.id),
                banner: "",
                color: "",
                bio: o.fallback?.bio || "",
                status: "offline",
                activity: ""
            })}
        </div>
    `).join("");

    await Promise.all(
        OWNERS.map(async (o, i) => {
            const d = await getOwner(o);
            const el = document.getElementById(`owner-${i}`);

            if (!el) return;

            el.innerHTML = card(o, d);

            const profile = el.firstElementChild;

            if (profile) {
                profile.classList.add("in");
            }
        })
    );
}

/* ===================== EFFECTS ===================== */

document.addEventListener("pointermove", e => {
    const c = e.target.closest(".card, .pcard");

    if (!c) return;

    const r = c.getBoundingClientRect();

    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
});

const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

function observe() {
    document.querySelectorAll("[data-r]:not(.in)").forEach(el => {
        io.observe(el);
    });
}

/* ===================== INITIALIZE ===================== */

function initialize() {
    renderScripts();
    loadTeam();
    observe();

    setTimeout(observe, 100);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
