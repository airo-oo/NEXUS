// ===============================================
// NEXUS NETWORK
// ===============================================

function initNetwork() {

    const container = document.querySelector(".network-container");
    const svg = document.querySelector(".network-lines");

    if (!container || !svg) return;

    svg.setAttribute("viewBox", "0 0 700 450");
svg.innerHTML = "";

    // ------------------------------------------
    // Position Nodes
    // ------------------------------------------

    const center = document.querySelector(".center");

    const nodes = [
        document.querySelector(".n1"),
        document.querySelector(".n2"),
        document.querySelector(".n3"),
        document.querySelector(".n4"),
        document.querySelector(".n5"),
        document.querySelector(".n6")
    ];

    // Network center
const cx = container.clientWidth / 2;
const cy = container.clientHeight / 2;

// Distance of outer nodes from center
const radius = 195;

    const centerSize = 140;

center.style.left = (cx - centerSize / 2) + "px";
center.style.top = (cy - centerSize / 2) + "px";

    const angles = [
    -90,   // Top
    -30,   // Top Right
    30,    // Bottom Right
    90,    // Bottom
    150,   // Bottom Left
    210    // Top Left
];

nodes.forEach((node, index) => {

    const angle = angles[index] * Math.PI / 180;

       const nodeSize = 90;

const x = cx + Math.cos(angle) * radius - nodeSize / 2;
const y = cy + Math.sin(angle) * radius - nodeSize / 2;

        node.style.left = x + "px";
        node.style.top = y + "px";

        // Create Line
        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", cx);
line.setAttribute("y1", cy);
line.setAttribute("x2", x + nodeSize / 2);
line.setAttribute("y2", y + nodeSize / 2);

        line.setAttribute("stroke", "#00E5FF");
        line.setAttribute("stroke-width", "1.5");
        line.setAttribute("opacity", ".35");

        svg.appendChild(line);

    });

    // ------------------------------------------
    // Floating Animation
    // ------------------------------------------

    let t = 0;

    function animate() {

        t += 0.01;

        nodes.forEach((node, i) => {

            const offset = Math.sin(t + i) * 8;

            node.style.transform =
                `translateY(${offset}px)`;

        });

        center.style.transform =
            `translateY(${Math.sin(t * .7) * 5}px)`;

        requestAnimationFrame(animate);

    }

    animate();

}