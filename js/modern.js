/**
 * HARSH DAIYA — AWARD-WINNING INTERACTIVE PORTFOLIO ENGINE (2026)
 * Real-time Telemetry, Risk Simulator, Click Sparks, 3D Tilt, Map Tooltips & AI Chat
 */

(function () {
  'use strict';

  // --- 1. STATE & AUDIO SYNTHESIZER ---
  const state = {
    theme: localStorage.getItem('hd-theme') || 'dark',
    soundEnabled: localStorage.getItem('hd-sound') === 'true',
    audioCtx: null,
    riskSimActive: true,
    riskAnomaly: false,
    visitedStatesCount: 23,
  };

  // Web Audio Synthesizer
  function initAudio() {
    if (!state.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }

      const now = state.audioCtx.currentTime;
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // --- 2. PRELOADER ANIMATION ---
  function markPageReady() {
    document.body.classList.add('page-ready');
    const preloader = document.getElementById('sitePreloader');
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      playSound('success');
    }
  }

  function initApp() {
    const preloader = document.getElementById('sitePreloader');
    if (preloader) {
      setTimeout(markPageReady, 1400);
    } else {
      markPageReady();
    }
    // Safety fallback: ensure page is marked ready even if timers stall
    setTimeout(markPageReady, 2200);

    // Apply Saved Theme
    applyTheme(state.theme);

    // Init Click Sparks
    initClickSparks();

    // Init Spotlight on Cards
    initSpotlightCards();

    // Init Scroll Reveal
    initScrollReveal();

    // Init Live Telemetry
    initLiveTelemetry();

    // Init Risk Engine Canvas Stream
    initRiskSimulator();

    // Init States Visited Tooltip & Filter
    initStatesMap();

    // Init AI Chatbot
    initChatbot();

    // Init Command Palette
    initCommandPalette();

    // Init Terminal
    initTerminal();

    // Init Sound Button
    updateSoundUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // --- 3. THEME CONTROLLER ---
  function applyTheme(theme) {
    state.theme = theme;
    localStorage.setItem('hd-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      themeBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }

  window.toggleTheme = function () {
    playSound('click');
    applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  };

  window.toggleSound = function () {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('hd-sound', state.soundEnabled);
    if (state.soundEnabled) initAudio();
    playSound('click');
    updateSoundUI();
  };

  function updateSoundUI() {
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.innerHTML = state.soundEnabled ? '🔊' : '🔇';
      soundBtn.setAttribute('title', state.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX');
    }
  }

  // --- 4. CLICK SPARKS PARTICLES (ThemeAwareClickSpark) ---
  function initClickSparks() {
    const canvas = document.getElementById('clickSparkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('click', (e) => {
      // Don't spark inside modal or inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      playSound('click');

      const count = 10;
      const colors = state.theme === 'dark' 
        ? ['#00F5A0', '#00D2FF', '#FFFFFF', '#8B5CF6']
        : ['#10B981', '#06B6D4', '#0F172A', '#8B5CF6'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.03 + 0.02
        });
      }
    });

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // subtle gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  // --- 5. SPOTLIGHT CARDS TRACKING ---
  function initSpotlightCards() {
    const cards = document.querySelectorAll('.bento-box, .metrics-card-wrapper, .simulator-box, .map-canvas-card, .contact-card-box, [data-spotlight]');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // --- SCROLL REVEAL (IntersectionObserver) ---
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // --- 6. LIVE TELEMETRY & CLOCK ---
  function initLiveTelemetry() {
    const clockEl = document.getElementById('telemetryClock');
    const latencyEl = document.getElementById('telemetryLatency');

    function updateClock() {
      const now = new Date();
      // Format to CST / Chicago Time
      const options = { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const timeStr = now.toLocaleTimeString('en-US', options);
      if (clockEl) {
        clockEl.textContent = `${timeStr} CST`;
      }
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Random slight latency fluctuation
    setInterval(() => {
      if (latencyEl) {
        const ms = Math.floor(Math.random() * 6) + 12;
        latencyEl.textContent = `${ms}MS`;
      }
    }, 4000);
  }

  // --- 7. REAL-TIME RISK SIMULATOR ENGINE ---
  function initRiskSimulator() {
    const canvas = document.getElementById('streamCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tpsEl = document.getElementById('simTps');
    const anomalyEl = document.getElementById('simAnomalyRate');
    const latencyEl = document.getElementById('simLatency');
    const logFeed = document.getElementById('simLogFeed');

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Nodes & Particles
    let particles = [];
    const nodeCount = 7;
    let nodes = [];

    function initNodes() {
      nodes = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: (w / (nodeCount + 1)) * (i + 1),
          y: h / 2 + (Math.sin(i * 1.5) * 45),
          radius: 6,
          label: ['Ingest', 'Auth', 'Kafka', 'Flink', 'FeatureStore', 'ML_Model', 'Decision'][i]
        });
      }
    }
    initNodes();

    let spawnRate = 4;
    function spawnParticle(isFraud = false) {
      particles.push({
        nodeIndex: 0,
        progress: 0,
        speed: Math.random() * 0.02 + 0.015,
        isFraud: isFraud,
        amount: (Math.random() * 450 + 10).toFixed(2),
        id: 'tx_' + Math.random().toString(36).substring(2, 7)
      });
    }

    // Animation Loop
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines between nodes
      ctx.strokeStyle = state.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
      }
      ctx.stroke();

      // Draw Nodes
      nodes.forEach((n, idx) => {
        ctx.fillStyle = state.riskAnomaly && idx === 5 ? '#F43F5E' : '#00F5A0';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = state.theme === 'dark' ? '#94A3B8' : '#64748B';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + 20);
      });

      // Spawn periodic normal transactions
      if (Math.random() < 0.25) {
        spawnParticle(state.riskAnomaly && Math.random() < 0.6);
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          p.progress = 0;
          p.nodeIndex++;
          if (p.nodeIndex >= nodes.length - 1) {
            // Completed evaluation, log decision
            logVerdict(p);
            particles.splice(i, 1);
            continue;
          }
        }

        const curr = nodes[p.nodeIndex];
        const next = nodes[p.nodeIndex + 1];
        if (!curr || !next) continue;

        const x = curr.x + (next.x - curr.x) * p.progress;
        const y = curr.y + (next.y - curr.y) * p.progress;

        ctx.fillStyle = p.isFraud ? '#F43F5E' : '#00D2FF';
        ctx.shadowColor = p.isFraud ? '#F43F5E' : '#00D2FF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(render);
    }
    render();

    function logVerdict(p) {
      if (!logFeed) return;
      const entry = document.createElement('div');
      entry.className = 'log-entry-row ' + (p.isFraud ? 'declined' : 'approved');

      const verdict = p.isFraud ? 'DECLINED' : 'APPROVED';
      const color = p.isFraud ? '#F43F5E' : 'var(--accent-emerald)';

      entry.innerHTML = `
        <span><strong style="color:var(--foreground);">${p.id}</strong> $${p.amount} · 14ms</span>
        <span style="color:${color}; font-weight:700; font-family:var(--font-mono); font-size:0.75rem;">${verdict}</span>
      `;

      logFeed.prepend(entry);
      if (logFeed.children.length > 8) {
        logFeed.removeChild(logFeed.lastChild);
      }
    }

    // Button Controls
    window.simTriggerBatch = function () {
      playSound('click');
      if (tpsEl) tpsEl.textContent = '52,430 TPS';
      for (let i = 0; i < 15; i++) {
        setTimeout(() => spawnParticle(false), i * 60);
      }
      setTimeout(() => {
        if (tpsEl) tpsEl.textContent = '42,180 TPS';
      }, 3000);
    };

    window.simInjectAttack = function () {
      playSound('alert');
      state.riskAnomaly = true;
      if (anomalyEl) anomalyEl.textContent = '4.82% (SPIKE)';
      if (latencyEl) latencyEl.textContent = '14MS (ACTIVE_DEFENSE)';

      for (let i = 0; i < 20; i++) {
        setTimeout(() => spawnParticle(true), i * 40);
      }

      setTimeout(() => {
        state.riskAnomaly = false;
        if (anomalyEl) anomalyEl.textContent = '0.01%';
        if (latencyEl) latencyEl.textContent = '16MS';
      }, 5000);
    };

    window.simReset = function () {
      playSound('click');
      state.riskAnomaly = false;
      particles = [];
      if (tpsEl) tpsEl.textContent = '42,180 TPS';
      if (anomalyEl) anomalyEl.textContent = '0.01%';
      if (latencyEl) latencyEl.textContent = '16MS';
      if (logFeed) logFeed.innerHTML = '';
    };
  }

  // --- 8. INTERACTIVE 23 VISITED US STATES MAP ---
  const stateHighlights = {
    'US-CA': { name: 'California', date: 'Visited', desc: 'Pacific Coast Highway, Yosemite National Park, Silicon Valley tech ecosystem.' },
    'US-CO': { name: 'Colorado', date: 'Visited', desc: 'Rocky Mountain National Park, Continental Divide, Denver & alpine passes.' },
    'US-FL': { name: 'Florida', date: 'Visited', desc: 'Everglades National Park, Miami coastal architecture, Key West overseas route.' },
    'US-IA': { name: 'Iowa', date: 'Visited', desc: 'Des Moines tech communities, Missouri River bluffs, Heartland heritage.' },
    'US-IL': { name: 'Illinois', date: 'Home Base', desc: 'Home base in Chicago — architecture river tours, Lake Michigan, Millennium Park, tech ecosystem.' },
    'US-KS': { name: 'Kansas', date: 'Visited', desc: 'Tallgrass Prairie National Preserve, historic Santa Fe Trail.' },
    'US-MI': { name: 'Michigan', date: 'Visited', desc: 'Great Lakes coastlines, Sleeping Bear Dunes, automotive & data tech hubs.' },
    'US-MN': { name: 'Minnesota', date: 'Visited', desc: 'Land of 10,000 Lakes, Minneapolis urban chain of lakes, North Shore trails.' },
    'US-MO': { name: 'Missouri', date: 'Visited', desc: 'St. Louis Gateway Arch, Kansas City jazz history & cultural landmarks.' },
    'US-NE': { name: 'Nebraska', date: 'Visited', desc: 'University of Nebraska MIS foundation, Heartland tech roots.' },
    'US-NY': { name: 'New York', date: 'Visited', desc: 'Manhattan skyline, Wall Street financial district, Central Park & Brooklyn.' },
    'US-OH': { name: 'Ohio', date: 'Visited', desc: 'Cuyahoga Valley National Park, Lake Erie coastlines, aerospace & tech innovation hubs.' },
    'US-SD': { name: 'South Dakota', date: 'Visited', desc: 'Badlands National Park, Black Hills, Mount Rushmore & Custer State Park.' },
    'US-TN': { name: 'Tennessee', date: 'Visited', desc: 'Great Smoky Mountains National Park, Nashville music scene & Memphis.' },
    'US-TX': { name: 'Texas', date: 'Visited', desc: 'Austin tech & fintech corridors, Dallas-Fort Worth, San Antonio River Walk.' },
    'US-NV': { name: 'Nevada', date: 'Visited', desc: 'Red Rock Canyon, Valley of Fire, Las Vegas technological conferences.' },
    'US-WI': { name: 'Wisconsin', date: 'Visited', desc: 'Lake Geneva, Milwaukee shoreline, scenic Northwoods trails.' },
    'US-WA': { name: 'Washington', date: 'Visited', desc: 'Olympic National Park, Mount Rainier alpine wilderness, Seattle & Puget Sound.' },
    'US-MA': { name: 'Massachusetts', date: 'Visited', desc: 'Boston historic Freedom Trail, Cambridge & MIT/Harvard innovation centers.' },
    'US-AZ': { name: 'Arizona', date: 'Visited', desc: 'Grand Canyon National Park, Sedona Red Rock canyons, Sonoran Desert.' },
    'US-UT': { name: 'Utah', date: 'Visited', desc: 'The Mighty 5: Zion, Bryce Canyon, Arches, Canyonlands & Capitol Reef.' },
    'US-WY': { name: 'Wyoming', date: 'Visited', desc: 'Yellowstone National Park (Old Faithful, Grand Prismatic), Grand Teton peaks.' },
    'US-MT': { name: 'Montana', date: 'Visited', desc: 'Glacier National Park (Going-to-the-Sun Road), Big Sky alpine wilderness.' },
  };

  function initStatesMap() {
    const mapContainer = document.getElementById('travelMapContainer');
    const tooltip = document.getElementById('stateTooltip');
    if (!mapContainer || !tooltip) return;

    const statePaths = mapContainer.querySelectorAll('.state-path');
    statePaths.forEach(path => {
      const stateId = path.getAttribute('id');
      const data = stateHighlights[stateId];

      if (data) {
        path.classList.add('visited');
      }

      path.addEventListener('mouseenter', (e) => {
        playSound('hover');
        const stateName = data ? data.name : path.getAttribute('data-name') || stateId;
        const status = data ? data.date : 'Wishlist / Next Adventure';
        const desc = data ? data.desc : 'Exploring future travel itineraries and national park explorations.';

        tooltip.innerHTML = `
          <div class="tooltip-state-name">${stateName}</div>
          <span class="tooltip-status-badge ${data ? 'visited' : ''}">${status}</span>
          <div class="tooltip-highlights">${desc}</div>
        `;
        tooltip.classList.add('visible');
      });

      path.addEventListener('mousemove', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      });

      path.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  window.filterStates = function (mode, evt) {
    playSound('click');
    const statePaths = document.querySelectorAll('.state-path');
    statePaths.forEach(path => {
      const isVisited = path.classList.contains('visited');
      if (mode === 'visited') {
        path.style.opacity = isVisited ? '1' : '0.15';
      } else if (mode === 'wishlist') {
        path.style.opacity = isVisited ? '0.2' : '1';
      } else {
        path.style.opacity = '1';
      }
    });

    const stateLabels = document.querySelectorAll('.state-label');
    stateLabels.forEach(lbl => {
      const isVisited = lbl.classList.contains('visited');
      if (mode === 'visited') {
        lbl.style.opacity = isVisited ? '1' : '0.15';
      } else if (mode === 'wishlist') {
        lbl.style.opacity = isVisited ? '0.2' : '1';
      } else {
        lbl.style.opacity = '1';
      }
    });

    const btns = document.querySelectorAll('.travel-filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    const e = evt || window.event;
    if (e && e.currentTarget) {
      e.currentTarget.classList.add('active');
    }
  };

  // --- 9. INTERACTIVE AI CHATBOT ASSISTANT ---
  const chatbotKnowledge = {
    skills: "Harsh specializes in AI & Agentic development (LangChain, LangGraph, autonomous multi-agent workflows), RAG architectures, Vector DBs (Pinecone, Milvus, ChromaDB), Distributed Systems, High-Throughput Risk Platforms, MLOps, Java, Go, Python, Apache Kafka, Apache Flink, Redis, and Kubernetes.",
    role: "Harsh Daiya is a Staff Software Engineer at PayPal, architecting real-time risk platform infrastructure protecting billions of dollars in daily commerce volume.",
    book: "Harsh authored 'The Future of Fintech: AI in Risk Management and Fraud Prevention', exploring how real-time AI and machine learning reshape financial security.",
    advisory: "Harsh advises early-stage fintech, health tech, and AI startups on architectural scalability, fraud defense, and team scaling. You can connect via the contact form or LinkedIn.",
    mentor: "Harsh is a top mentor on ADPList with 100+ guided sessions, helping engineers master system design and transition into Staff+ engineering roles.",
    travel: "Harsh has traveled to 23 US states so far! Highlights include Yellowstone (WY), Yosemite (CA), Mount Rainier (WA), Zion (UT), Grand Canyon (AZ), and Glacier National Park (MT).",
    contact: "You can schedule directly through Google Calendar or submit a direct message through the contact form below!"
  };

  function initChatbot() {
    const trigger = document.getElementById('chatTriggerPill');
    const drawer = document.getElementById('chatDrawer');
    const closeBtn = document.getElementById('chatCloseBtn');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const body = document.getElementById('chatBody');

    if (!trigger || !drawer) return;

    trigger.addEventListener('click', () => {
      drawer.classList.toggle('open');
      playSound('click');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        playSound('click');
      });
    }

    function appendMessage(text, isUser = false) {
      const msg = document.createElement('div');
      msg.className = `chat-bubble-item ${isUser ? 'user' : 'bot'}`;
      msg.textContent = text;
      body.appendChild(msg);
      body.scrollTop = body.scrollHeight;
    }

    window.askChatbot = function (promptKey) {
      playSound('click');
      const questionMap = {
        skills: "What are Harsh's core technical skills?",
        book: "Tell me about his published fintech book",
        role: "What is Harsh's role at PayPal?",
        advisory: "How does Harsh approach startup advisory & investing?",
        travel: "What US states has Harsh explored?",
        contact: "How can I book a call with Harsh?"
      };

      appendMessage(questionMap[promptKey] || promptKey, true);
      setTimeout(() => {
        appendMessage(chatbotKnowledge[promptKey] || "Harsh is a Staff Software Engineer at PayPal, author, and investor. Feel free to ask about his skills, experience, book, or schedule a meeting!");
        playSound('hover');
      }, 400);
    };

    function handleSend() {
      const q = input.value.trim().toLowerCase();
      if (!q) return;
      appendMessage(input.value, true);
      input.value = '';

      setTimeout(() => {
        if (q.includes('skill') || q.includes('stack') || q.includes('technolog') || q.includes('agent') || q.includes('rag') || q.includes('langchain') || q.includes('vector') || q.includes('llm')) {
          appendMessage(chatbotKnowledge.skills);
        } else if (q.includes('book') || q.includes('author') || q.includes('publish')) {
          appendMessage(chatbotKnowledge.book);
        } else if (q.includes('paypal') || q.includes('work') || q.includes('role') || q.includes('staff')) {
          appendMessage(chatbotKnowledge.role);
        } else if (q.includes('mentor') || q.includes('adplist')) {
          appendMessage(chatbotKnowledge.mentor);
        } else if (q.includes('travel') || q.includes('state') || q.includes('trip')) {
          appendMessage(chatbotKnowledge.travel);
        } else if (q.includes('meet') || q.includes('call') || q.includes('contact') || q.includes('email')) {
          appendMessage(chatbotKnowledge.contact);
        } else {
          appendMessage("Harsh is a Staff Software Engineer at PayPal, author of 'The Future of Fintech', mentor, and explorer. Try clicking one of the suggested prompts above or submit a message through the contact form!");
        }
        playSound('hover');
      }, 400);
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }

  // --- 10. INTERACTIVE TERMINAL (HD-CLI) ---
  function initTerminal() {
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');
    if (!input || !body) return;

    let cmdHistory = [];
    let histIndex = -1;

    const commands = {
      help: () => `Available commands:
  • bio          : Executive summary
  • role         : Current position & scope
  • skills       : Core architecture & tech stack
  • book         : Information on published book
  • travel       : 23 Visited US states
  • papers       : Academic publications & research
  • contact      : Direct links & booking options
  • theme        : Toggle dark / light theme
  • matrix       : Trigger digital rain animation
  • sudo hire    : Execute job offer script 🎉
  • clear        : Reset terminal output`,

      bio: () => `Harsh Daiya — Staff Software Engineer @ PayPal (Risk Platform)
12+ years pioneering high-velocity risk engines, distributed systems, and real-time fraud mitigation.
Author of "The Future of Fintech", angel investor, top ADPList mentor, and avid traveler across 23 US states.`,

      role: () => `Staff Software Engineer, Risk Platform @ PayPal
• Protects billions in daily commerce volume across global real-time flows.
• Low-latency distributed feature streaming (sub-25ms SLA) with Kafka, Flink, and Redis.
• Production AI/ML fraud decision engine integration.`,

      skills: () => `[AI & AGENTIC DEV]   : Autonomous Agents, LangChain, LangGraph, Multi-Agent Systems, Tool Calling
[RAG & VECTOR DBS]    : RAG Architecture, Pinecone, Milvus, ChromaDB, LlamaIndex, Semantic Search
[DISTRIBUTED SYSTEMS] : Java, Go, Python, Spring Boot, Microservices, gRPC, High Concurrency
[STREAMING & DATA]    : Apache Kafka, Apache Flink, Apache Spark, Redis, Cassandra, Elasticsearch
[RISK & MLOPS]        : Real-time Decision Engines, Feature Stores, PyTorch, Anomaly Detection
[INFRASTRUCTURE]      : Kubernetes, Docker, AWS, GCP, Terraform, CI/CD, Observability`,

      book: () => `"The Future of Fintech: AI in Risk Management and Fraud Prevention"
Author: Harsh Daiya
Comprehensive guide on leveraging AI, LLMs, and real-time graph reasoning to safeguard financial transactions.`,

      travel: () => `23 States Visited (46% of USA):
CA, CO, FL, IA, IL, KS, MI, MN, MO, NE, NY, OH, SD, TN, TX, NV, WI, WA, MA, AZ, UT, WY, MT.
Highlights: Yellowstone, Yosemite, Zion, Grand Canyon, Badlands, Glacier NP, Mount Rainier, Cuyahoga Valley.`,

      contact: () => `• Google Calendar : Direct 1:1 scheduling
• Message Form    : submit-form.com integration below
• LinkedIn        : linkedin.com/in/harshdaiya
• GitHub          : github.com/daiyaharsh90`,

      theme: () => {
        window.toggleTheme();
        return `Theme switched to: ${state.theme}`;
      },

      matrix: () => {
        triggerMatrixEffect();
        return `Initializing Matrix protocol... Terminal entered cyber stream.`;
      },

      'sudo hire': () => {
        triggerConfetti();
        return `ACCESS GRANTED! 🎉
Candidate Status: EXCEPTIONAL.
Match Confirmed: Resilient distributed systems & AI fintech leadership incoming!`;
      },

      clear: () => {
        body.innerHTML = '';
        return '';
      }
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        if (cmd) {
          cmdHistory.push(cmd);
          histIndex = cmdHistory.length;

          // Print Command Line
          const line = document.createElement('div');
          line.className = 'term-line';
          line.innerHTML = `<span class="term-prompt">harsh@macbook ~ %</span> ${input.value}`;
          body.appendChild(line);

          // Execute
          const outputText = commands[cmd] ? commands[cmd]() : `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
          if (outputText) {
            const outLine = document.createElement('div');
            outLine.className = 'term-line term-output';
            outLine.textContent = outputText;
            body.appendChild(outLine);
          }

          input.value = '';
          body.scrollTop = body.scrollHeight;
          playSound('click');
        }
      } else if (e.key === 'ArrowUp') {
        if (histIndex > 0) {
          histIndex--;
          input.value = cmdHistory[histIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (histIndex < cmdHistory.length - 1) {
          histIndex++;
          input.value = cmdHistory[histIndex];
        } else {
          histIndex = cmdHistory.length;
          input.value = '';
        }
      }
    });
  }

  // --- 11. COMMAND PALETTE (CMD+K) ---
  function initCommandPalette() {
    const modal = document.getElementById('cmdModalBackdrop');
    const input = document.getElementById('cmdSearchInput');
    const list = document.getElementById('cmdResultsList');

    let selectedIndex = 0;

    function getVisibleItems() {
      if (!list) return [];
      return Array.from(list.querySelectorAll('.cmd-k-item-row')).filter(item => {
        return window.getComputedStyle(item).display !== 'none';
      });
    }

    function updateSelection() {
      const visible = getVisibleItems();
      visible.forEach((item, idx) => {
        if (idx === selectedIndex) {
          item.classList.add('selected');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('selected');
        }
      });
    }

    window.openCommandPalette = function () {
      playSound('click');
      if (modal) {
        modal.classList.add('open');
        if (input) {
          input.value = '';
          input.focus();
        }
        if (list) {
          const items = list.querySelectorAll('.cmd-k-item-row');
          items.forEach(item => { item.style.display = 'flex'; item.classList.remove('selected'); });
        }
        selectedIndex = 0;
        updateSelection();
      }
    };

    window.closeCommandPalette = function () {
      if (modal) modal.classList.remove('open');
    };

    // Keyboard trigger (Cmd+K / Ctrl+K)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (modal && modal.classList.contains('open')) {
          window.closeCommandPalette();
        } else {
          window.openCommandPalette();
        }
      } else if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        window.closeCommandPalette();
      }
    });

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeCommandPalette();
      });
    }

    if (input && list) {
      input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        const items = list.querySelectorAll('.cmd-k-item-row');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          const action = (item.getAttribute('data-action') || '').toLowerCase();
          const matches = text.includes(query) || action.includes(query);
          item.style.display = matches ? 'flex' : 'none';
        });
        selectedIndex = 0;
        updateSelection();
      });

      input.addEventListener('keydown', (e) => {
        const visible = getVisibleItems();
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (visible.length > 0) {
            selectedIndex = (selectedIndex + 1) % visible.length;
            updateSelection();
            playSound('hover');
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (visible.length > 0) {
            selectedIndex = (selectedIndex - 1 + visible.length) % visible.length;
            updateSelection();
            playSound('hover');
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (visible.length > 0 && visible[selectedIndex]) {
            const action = visible[selectedIndex].getAttribute('data-action');
            if (action) {
              window.runPaletteAction(action);
            } else {
              visible[selectedIndex].click();
            }
          }
        }
      });
    }
  }

  window.runPaletteAction = function (action) {
    if (!action) return;
    playSound('click');
    window.closeCommandPalette();

    if (action === 'resume') {
      window.open('https://daiyaharsh90.github.io/pdfResume/Harsh_Daiya_Resume.pdf', '_blank');
    } else if (action === 'calendar') {
      const contactSec = document.getElementById('contact');
      if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'chat') {
      const drawer = document.getElementById('chatDrawer');
      if (drawer) drawer.classList.add('open');
    } else if (action === 'theme') {
      window.toggleTheme();
    } else if (action === 'sound') {
      window.toggleSound();
    } else if (action === 'matrix') {
      triggerMatrixEffect();
    } else if (action === 'confetti') {
      triggerConfetti();
    } else if (action.startsWith('#')) {
      const targetId = action.slice(1);
      const targetEl = document.getElementById(targetId) || document.querySelector(action);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try { history.pushState(null, null, action); } catch (e) {}
      } else {
        window.location.hash = action;
      }
    }
  };

  window.execCommand = window.runPaletteAction;

  // --- 12. CELEBRATION CONFETTI ENGINE ---
  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#00F5A0', '#00D2FF', '#8B5CF6', '#F59E0B', '#F43F5E', '#FFFFFF'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.5) * 16 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: Math.random() * 10 - 5,
        alpha: 1
      });
    }

    playSound('success');

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rSpeed;
        p.alpha -= 0.012;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      }

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animate();
  }

  // Matrix Rain Easter Egg
  function triggerMatrixEffect() {
    triggerConfetti();
    const term = document.getElementById('terminalBody');
    if (term) {
      let count = 0;
      const interval = setInterval(() => {
        const chars = '0101010101 HARSH DAIYA RISK PROTOCOL STREAM ACTIVE 010101';
        const line = document.createElement('div');
        line.style.color = '#00F5A0';
        line.style.fontFamily = 'monospace';
        line.style.fontSize = '0.75rem';
        line.textContent = chars.split('').sort(() => 0.5 - Math.random()).join('');
        term.appendChild(line);
        term.scrollTop = term.scrollHeight;
        count++;
        if (count > 20) clearInterval(interval);
      }, 100);
    }
  }

  // --- 13. CONTACT FORM SUBMISSION WITH BOTPOISON ---
  window.submitContactForm = async function (e) {
    e.preventDefault();
    playSound('click');

    const form = e.target;
    const submitBtn = document.getElementById('formSubmitBtn');
    const statusMsg = document.getElementById('formStatusMsg');

    if (submitBtn) {
      submitBtn.setAttribute('disabled', 'disabled');
      submitBtn.innerHTML = 'Sending message...';
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Resolve Botpoison challenge if loaded
    if (window.Botpoison) {
      try {
        const botpoison = new window.Botpoison({ publicKey: 'pk_a06bbe43-bfed-4818-8a65-bc84131df245' });
        const res = await botpoison.challenge();
        data._botpoison = res.solution;
      } catch (bpErr) {
        // Fallback gracefully
      }
    }

    try {
      const response = await fetch('https://submit-form.com/aX3ocUYg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = 'Message delivered! Harsh will be in touch shortly.';
        triggerConfetti();
        form.reset();
      } else {
        throw new Error('Submission error');
      }
    } catch (err) {
      statusMsg.className = 'form-status-msg error';
      statusMsg.textContent = 'Unable to send message via form. Please email directly or connect on LinkedIn!';
    } finally {
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.innerHTML = 'Send Message';
      }
    }
  };

  // --- 13. GOOGLE CALENDAR MODAL OVERLAY STABILITY ENFORCER ---
  (function initGoogleCalendarOverlayFix() {
    const enforceStyles = (node) => {
      if (node.nodeType !== 1) return;
      if (node.classList && node.classList.contains('hur54b')) {
        node.style.setProperty('background-color', 'rgba(0, 0, 0, 0.85)', 'important');
        node.style.setProperty('backdrop-filter', 'blur(12px)', 'important');
        node.style.setProperty('z-index', '100050', 'important');
      }
      if (node.matches && (node.matches('iframe.mmGMM') || node.matches('iframe[src*="calendar.google.com"]'))) {
        node.style.setProperty('background-color', '#ffffff', 'important');
        node.style.setProperty('background', '#ffffff', 'important');
        node.style.setProperty('color-scheme', 'light', 'important');
      }
      const iframes = node.querySelectorAll ? node.querySelectorAll('iframe.mmGMM, iframe[src*="calendar.google.com"]') : [];
      iframes.forEach(iframe => {
        iframe.style.setProperty('background-color', '#ffffff', 'important');
        iframe.style.setProperty('background', '#ffffff', 'important');
        iframe.style.setProperty('color-scheme', 'light', 'important');
      });
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const added of m.addedNodes) {
          enforceStyles(added);
        }
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  })();

})();
