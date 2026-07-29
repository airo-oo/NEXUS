// ===============================================
// NEXUS EARTH
// ===============================================

function initEarth() {

    const container = document.getElementById("earth-container");
    if (!container) return;

    // -----------------------------------
    // Scene
    // -----------------------------------

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.appendChild(renderer.domElement);

    // -----------------------------------
    // Earth Group
    // -----------------------------------

    const earth = new THREE.Group();
    earth.rotation.z = THREE.MathUtils.degToRad(23.5);

    scene.add(earth);

    // =====================================
    // Earth Sphere
    // =====================================

    const body = new THREE.Mesh(

        new THREE.SphereGeometry(5, 96, 96),

        new THREE.MeshBasicMaterial({
            color: 0x051225,
            transparent: true,
            opacity: 0.96
        })

    );

    earth.add(body);

    // =====================================
    // Wireframe
    // =====================================

    const wire = new THREE.Mesh(

        new THREE.SphereGeometry(5.03, 28, 28),

        new THREE.MeshBasicMaterial({
            color: 0x0099ff,
            wireframe: true,
            transparent: true,
            opacity: 0.35
        })

    );

    earth.add(wire);

    // =====================================
    // Atmosphere (reduced — thin, subtle rim only)
    // =====================================

    const atmosphere = new THREE.Mesh(

        new THREE.SphereGeometry(5.14, 64, 64),

        new THREE.MeshBasicMaterial({
            color: 0x00d9ff,
            transparent: true,
            opacity: 0.025,
            side: THREE.BackSide
        })

    );

    atmosphere.scale.set(1.02, 1.02, 1.02);

    earth.add(atmosphere);

    // =====================================
    // Latitude / Longitude
    // =====================================

    function latLon(lat, lon, r) {

        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lon + 180) * Math.PI / 180;

        return new THREE.Vector3(
            -(r * Math.sin(phi) * Math.cos(theta)),
            r * Math.cos(phi),
            r * Math.sin(phi) * Math.sin(theta)
        );

    }

    // =====================================
    // Glow Texture
    // =====================================

    function makeGlowTexture() {

        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        const gradient = ctx.createRadialGradient(
            size / 2, size / 2, 0,
            size / 2, size / 2, size / 2
        );

        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgba(170,245,255,1)");
        gradient.addColorStop(0.55, "rgba(0,200,255,0.4)");
        gradient.addColorStop(1, "rgba(0,200,255,0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        return new THREE.CanvasTexture(canvas);

    }

    const glowTexture = makeGlowTexture();

    // =====================================
    // CONTINENT PARTICLES
    // =====================================

    const continentPoints = [];

    function addBlob(centerLat, centerLon, radius, density) {

        for (let i = 0; i < density; i++) {

            const angle = Math.random() * Math.PI * 2;
            const dist = radius * Math.sqrt(Math.random());

            const lat = centerLat + Math.cos(angle) * dist;
            const lon = centerLon + Math.sin(angle) * dist;

            const p = latLon(lat, lon, 5.06);

            continentPoints.push(p.x, p.y, p.z);

        }

    }

    // NORTH AMERICA
    addBlob(55, -105, 18, 700);
    addBlob(45, -90, 16, 600);
    addBlob(35, -115, 15, 500);
    addBlob(25, -100, 14, 400);
    addBlob(60, -75, 10, 250);

    // SOUTH AMERICA
    addBlob(-10, -60, 16, 500);
    addBlob(-25, -62, 15, 450);
    addBlob(-40, -67, 10, 250);

    // EUROPE
    addBlob(52, 10, 10, 450);
    addBlob(60, 20, 8, 250);

    // AFRICA
    addBlob(15, 20, 16, 700);
    addBlob(-10, 25, 15, 550);
    addBlob(-25, 30, 12, 350);

    // ASIA
    addBlob(45, 70, 18, 800);
    addBlob(35, 95, 20, 850);
    addBlob(30, 120, 18, 650);
    addBlob(55, 110, 16, 500);
    addBlob(20, 80, 12, 450);

    // INDIA
    addBlob(21, 78, 8, 260);

    // AUSTRALIA
    addBlob(-26, 134, 13, 500);

    // GREENLAND
    addBlob(72, -40, 8, 180);

    const continentGeometry = new THREE.BufferGeometry();

    continentGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(continentPoints, 3)
    );

    const continentMaterial = new THREE.PointsMaterial({
        map: glowTexture,
        color: 0x9df4ff,        // brighter, whiter cyan
        size: 0.1,              // bigger glow points
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const continents = new THREE.Points(continentGeometry, continentMaterial);

    earth.add(continents);

    // =====================================
    // ATMOSPHERE PARTICLES (reduced count + opacity)
    // =====================================

    const atmosphereGeometry = new THREE.BufferGeometry();
    const atmosphereVertices = [];

    for (let i = 0; i < 500; i++) {

        const radius = 5.35 + Math.random() * 0.6;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        atmosphereVertices.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );

    }

    atmosphereGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(atmosphereVertices, 3)
    );

    const atmosphereMaterial = new THREE.PointsMaterial({
        color: 0x00d9ff,
        size: 0.02,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const atmosphereParticles = new THREE.Points(atmosphereGeometry, atmosphereMaterial);

    earth.add(atmosphereParticles);

    // =====================================
    // LIGHTING
    // =====================================

    scene.add(new THREE.AmbientLight(0x88ddff, 2));

    // =====================================
    // ANIMATION
    // =====================================

    function animate() {

        requestAnimationFrame(animate);

        earth.rotation.y += 0.0018;
        atmosphereParticles.rotation.y -= 0.0005;

        atmosphereMaterial.opacity = 0.14 + Math.sin(performance.now() * 0.0012) * 0.04;
        continentMaterial.opacity = 0.9 + Math.sin(performance.now() * 0.002) * 0.1;

        renderer.render(scene, camera);

    }

    animate();

    // =====================================
    // RESIZE
    // =====================================

    window.addEventListener("resize", () => {

        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

    });

}
