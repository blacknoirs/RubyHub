/* ====== EDIT THIS FILE TO MANAGE YOUR SITE ====== */
window.SITE = {
  name: "Script Hub",
  discord: "",   // e.g. "https://discord.gg/yourinvite" (leave "" to hide)
};

// Add, remove or edit scripts here. "loadstring" is what users copy.
window.SCRIPTS = [
  {
    name: "GK Script",
    game: "Roblox football",
    tags: ["Football", "Goalkeeper"],
    version: "1.0",
    updated: "2026-11-19",
    description: "Goalkeeper helper that draws the ball's predicted path and can auto-tackle.",
    features: ["Ball trajectory line", "Auto-tackle", "Settings through _G config", "Keybinds"],
    loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/gk.lua"))()'
  },
  {
    name: "VFX Logger",
    game: "Any game",
    tags: ["Utility"],
    version: "1.0",
    updated: "2026-11-16",
    description: "Logs ability visual effects as they play and generates a replay script.",
    features: ["Logs ability VFX", "Generates a replay script"],
    loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/vfxlogger.lua"))()'
  }
];
