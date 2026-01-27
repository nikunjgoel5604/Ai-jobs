const backendUrl = "http://localhost:5000/api";

const fetchData = async (endpoint, options = {}) => {
    try {
        const res = await fetch(`${backendUrl}/${endpoint}`, options);
        if (!res.ok) {
            let errorMsg = `Failed to fetch data from ${endpoint}. Status: ${res.status}`;
            try {
                const errorData = await res.json();
                errorMsg += `. Message: ${errorData.error}`;
            } catch (e) {
                // Error response was not JSON.
            }
            throw new Error(errorMsg);
        }
        return res.json();
    } catch (err) {
        console.error(`Error in fetchData for ${endpoint}:`, err);
        return null;
    }
};

const chartColors = {
    primaryAccent: '#c23c49ff',            // Pink
    secondaryHighlight: '#538d4fff',       // Beige
    tertiarySoft: '#cec546ff',         // Light Gray
    gridLines: 'rgba(252, 241, 239, 0.1)', // Lightest color, transparent
    textColor: '#fcf1ef',            // Lightest color
    backgroundColor: '#000000'       // New Background
};
// --- DYNAMIC BACKGROUND SCRIPT (CORRECTED) ---
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById("bg");
  if (!canvas) return; // Exit if canvas isn't on the page

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
const colors = ["#c2505cff", "#9fcd9aff", "#f4ec7eff", "#ffffff"];
  function initParticles() {
    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 1.2,
            dy: (Math.random() - 0.5) * 1.2
        });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x - p.radius < 0 || p.x + p.radius > canvas.width) p.dx *= -1;
      if (p.y - p.radius < 0 || p.y + p.radius > canvas.height) p.dy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          ctx.beginPath();
ctx.strokeStyle = "rgba(121, 150, 173, 0.2)";
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  
  initParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Re-initialize particles on resize
  });
});