// ================= MAIN SCRIPT =================
// NEXUS Earth Experience Controller


// Wait until everything is loaded
window.addEventListener("load", () => {

    console.log("NEXUS System Initialised");

    // Start all systems
    if(typeof initEarth === "function"){
        initEarth();
    }

    if(typeof initStars === "function"){
        initStars();
    }

    if(typeof initUI === "function"){
        initUI();
    }

    if(typeof initAnimations === "function"){
        initAnimations();
    }

    if(typeof initNetwork === "function"){
        initNetwork();
    }

});