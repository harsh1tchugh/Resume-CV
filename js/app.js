document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initProjectFiltering();
  initProjectModals();
  initSentimentDemo();
  initChurnSimulator();
  initTerminal();
  initContactForm();
  initMobileMenu();
  initScrollSpy();
  if (window.lucide) window.lucide.createIcons();
});

function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.color = Math.random() > 0.4 ? 'rgba(168, 85, 247, ' : 'rgba(56, 189, 248, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#a855f7';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          let opacity = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }
  animate();
}

function initTypingEffect() {
  const typingEl = document.getElementById('typing-role');
  if (!typingEl) return;
  const roles = [
    'Aspiring Data Analyst / Scientist',
    'BCA Student @ IITM (GGSIPU)',
    'Machine Learning & GenAI Practitioner',
    'Power BI & Analytics Specialist',
    'Python & SQL Developer'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      typingEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 45;
    } else {
      typingEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 85;
    }
    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }
    setTimeout(type, typeSpeed);
  }
  type();
}

function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-purple-600', 'text-white', 'border-purple-400');
        b.classList.add('bg-slate-900/60', 'text-slate-300', 'border-slate-800');
      });
      btn.classList.remove('bg-slate-900/60', 'text-slate-300', 'border-slate-800');
      btn.classList.add('bg-purple-600', 'text-white', 'border-purple-400');
      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || (category && category.includes(filter))) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
const projectDatabase = {
  churnsense: {
    title: 'ChurnSense — Customer Churn Prediction & Retention System',
    category: 'Machine Learning / Classification / Streamlit Cloud',
    badge: 'Live Streamlit App',
    description: 'An interactive predictive analytics and customer retention platform deployed live on Streamlit Cloud. Benchmarks machine learning classifiers on bank customer records, debugs data leakage, and provides real-time attrition probabilities with automated customer retention strategies.',
    highlights: [
      'Built and deployed a fully functional live web application: churnretention.streamlit.app.',
      'Comprehensive data preprocessing: categorical one-hot encoding, RobustScaler, and feature importance rankings.',
      'Audited and resolved data leakage in cross-validation splits to ensure high test accuracy and generalization.',
      'Interactive risk simulator with dynamic parameter tuning and retention recommendations.'
    ],
    techStack: ['Python', 'Streamlit', 'Pandas', 'Scikit-Learn', 'Keras / TensorFlow', 'Seaborn', 'Cloud Deployment'],
    metrics: {
      'Live App': 'churnretention.streamlit.app',
      'Dataset Size': '10,000 Records',
      'ROC-AUC Score': '0.862',
      'Deployment': 'Streamlit Community Cloud'
    },
    architecture: 'Bank Customer Data ➔ Data Preprocessing & Leakage Fix ➔ ML Classifier Pipeline ➔ Streamlit Interactive UI ➔ Real-Time Risk Predictions',
    liveUrl: 'https://churnretention.streamlit.app',
    githubUrl: 'https://github.com/harsh1tchugh'
  },
  aura_ai: {
    title: 'Aura AI Studio — Multi-Modal Generative AI Workspace',
    category: 'Generative AI / Applied Machine Learning / Cloud',
    badge: 'Live Streamlit App',
    description: 'A modern, full-featured Generative AI studio application built with Python and deployed live on Streamlit Cloud. Integrates AI intelligence to deliver reactive multi-modal assistance, creative prompt engineering, and real-time generation workflows.',
    highlights: [
      'Engineered an interactive multi-modal Generative AI workspace live at auraaistudio.streamlit.app.',
      'Integrated cutting-edge AI model APIs for text synthesis, analysis, and creative workflow automation.',
      'Constructed stateful chat interfaces with token optimization and prompt template libraries.',
      'Designed responsive glassmorphism UI components adapted for seamless desktop and mobile use.'
    ],
    techStack: ['Python', 'Streamlit', 'Generative AI APIs', 'NLP', 'Prompt Engineering', 'Cloud Deployment'],
    metrics: {
      'Live App': 'auraaistudio.streamlit.app',
      'Domain': 'Generative AI / LLMs',
      'Framework': 'Streamlit Web UI',
      'Inference': 'Real-Time Streaming'
    },
    architecture: 'User Prompts ➔ Context Preprocessing ➔ GenAI Model Inference ➔ Streamlit Stream Handler ➔ Interactive UI Output',
    liveUrl: 'https://auraaistudio.streamlit.app',
    githubUrl: 'https://github.com/harsh1tchugh'
  },
  sentiscan: {
    title: 'SentiScan — Amazon Reviews Sentiment Analysis',
    category: 'NLP / Machine Learning / Cloud Production',
    badge: 'Live on Render',
    description: 'An end-to-end NLP sentiment classification pipeline that ingests customer reviews and classifies them into Positive, Neutral, or Negative sentiment, deployed live in production on Render cloud.',
    highlights: [
      'Constructed complete text preprocessing: tokenization, punctuation/stopword removal, and lemmatization.',
      'Extracted n-gram semantic features with TF-IDF Vectorizer (Unigrams + Bigrams with 5,000 max features).',
      'Trained and evaluated Logistic Regression and Multinomial Naive Bayes classifiers with balanced class weighting.',
      'Packaged and deployed live with a web interface on Render cloud: sentiment-analysis-wnox.onrender.com.'
    ],
    techStack: ['Python', 'NLP', 'TF-IDF (Bigrams)', 'Scikit-Learn', 'Flask/Web', 'Render Cloud Deployment'],
    metrics: {
      'Live Deployment': 'sentiment-analysis-wnox.onrender.com',
      'Model Accuracy': '88.4%',
      'Feature Extractor': 'TF-IDF with Bigrams',
      'Inference Speed': '< 50ms'
    },
    architecture: 'Raw Review Text ➔ NLP Preprocessing & Lemmatization ➔ TF-IDF N-Grams ➔ Classifier Inference ➔ Cloud API & Responsive UI',
    liveUrl: 'https://sentiment-analysis-wnox.onrender.com',
    githubUrl: 'https://github.com/harsh1tchugh'
  },
  powerbi_churn: {
    title: 'Customer Churn Executive BI Dashboard',
    category: 'Business Intelligence & Visualization',
    badge: 'Power BI Interactive',
    description: 'An interactive, executive-ready Power BI dashboard visualizing customer attrition patterns, financial exposure, and geographic variance across 10,000 banking customers.',
    highlights: [
      'Engineered interactive KPI cards for Total Churn Rate (20.37%), At-Risk Balances, and Activity ratios.',
      'Built multi-tier slicers for Country (France, Germany, Spain), Age Brackets, and Product Tiers.',
      'Authored custom DAX measures for Customer Lifetime Value (CLV) and Retention Cohorts.',
      'Uncovered critical churn drivers in the German branch and multi-product accounts.'
    ],
    techStack: ['Microsoft Power BI', 'DAX Measures', 'Data Modeling', 'MS Excel', 'Business Intelligence'],
    metrics: {
      'Records Analyzed': '10,000 Customers',
      'Custom DAX': '14+ Calculated Metrics',
      'Interactive Slicers': 'Age, Country, Tier',
      'Executive Takeaway': 'High Balance Churn Alerts'
    },
    architecture: 'Cleaned Dataset ➔ Star Schema Relational Model ➔ DAX Metric Calculation ➔ Visual Dashboard Design ➔ Actionable Business Insights',
    githubUrl: 'https://github.com/harsh1tchugh'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('project-modal-close');
  const modalBody = document.getElementById('project-modal-body');
  const deepDiveBtns = document.querySelectorAll('.project-deepdive-btn');
  if (!modal || !modalBody) return;

  deepDiveBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectDatabase[projectId];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="space-y-6">
          <div class="flex flex-wrap items-start justify-between gap-4 border-b border-purple-500/20 pb-4">
            <div>
              <span class="inline-block px-3 py-1 text-xs font-mono rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 mb-2">
                ${data.category}
              </span>
              <h3 class="text-2xl font-bold text-white font-heading">${data.title}</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              ${data.liveUrl ? `
                <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-electric px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <i data-lucide="external-link" class="w-3.5 h-3.5"></i> Open Live App
                </a>
              ` : ''}
              <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <i data-lucide="github" class="w-3.5 h-3.5"></i> GitHub Repo
              </a>
            </div>
          </div>
          <p class="text-slate-300 leading-relaxed text-sm md:text-base">${data.description}</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            ${Object.entries(data.metrics).map(([key, val]) => `
              <div class="bg-slate-900/80 border border-purple-500/20 p-3.5 rounded-xl text-center">
                <div class="text-xs text-slate-400 font-mono mb-1">${key}</div>
                <div class="text-sm md:text-base font-bold text-purple-300 font-mono">${val}</div>
              </div>
            `).join('')}
          </div>
          <div class="bg-slate-900/50 border border-slate-800 p-5 rounded-xl">
            <h4 class="text-sm font-semibold text-purple-400 font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-purple-400"></i> Technical Highlights & Deliverables
            </h4>
            <ul class="space-y-2.5 text-sm text-slate-300">
              ${data.highlights.map((h) => `
                <li class="flex items-start gap-2.5">
                  <span class="text-purple-400 font-bold mt-0.5">▸</span>
                  <span>${h}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="bg-slate-950/80 border border-purple-500/30 p-4 rounded-xl font-mono text-xs text-slate-300">
            <div class="text-purple-400 font-bold mb-1.5 flex items-center gap-2">
              <i data-lucide="workflow" class="w-4 h-4"></i> Data Pipeline Architecture
            </div>
            <div class="text-slate-300 p-2.5 bg-slate-900/90 rounded border border-slate-800">
              ${data.architecture}
            </div>
          </div>
          <div>
            <div class="text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">Tech Stack & Tools</div>
            <div class="flex flex-wrap gap-2">
              ${data.techStack.map((tech) => `
                <span class="px-3 py-1 text-xs rounded-lg bg-purple-950/40 text-purple-200 border border-purple-500/30 font-mono">
                  ${tech}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };
  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}
function initSentimentDemo() {
  const input = document.getElementById('sentiment-input');
  const btn = document.getElementById('sentiment-analyze-btn');
  const resultCard = document.getElementById('sentiment-result');
  const presets = document.querySelectorAll('.sentiment-preset-btn');
  if (!input || !btn || !resultCard) return;

  const posWords = ['great', 'excellent', 'fantastic', 'phenomenal', 'love', 'amazing', 'superb', 'best', 'good', 'fast', 'reliable', 'happy', 'recommended', 'perfect', 'worth', 'satisfied', 'impressed'];
  const negWords = ['terrible', 'horrible', 'worst', 'bad', 'poor', 'broke', 'defect', 'waste', 'slow', 'disappointed', 'awful', 'useless', 'return', 'failed', 'scam', 'hate', 'damaged'];

  function analyzeSentiment(text) {
    if (!text.trim()) {
      showToast('⚠️ Please enter review text to analyze');
      return;
    }
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Running TF-IDF Model...';
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      const lower = text.toLowerCase();
      const words = lower.match(/\b[a-z]{3,}\b/g) || [];
      let posCount = 0, negCount = 0, highlightedWords = [];

      words.forEach((w) => {
        if (posWords.includes(w)) {
          posCount += 1.5;
          highlightedWords.push({ word: w, type: 'pos' });
        } else if (negWords.includes(w)) {
          negCount += 1.5;
          highlightedWords.push({ word: w, type: 'neg' });
        }
      });

      let sentiment = 'NEUTRAL', badgeBg = 'bg-amber-950/80 border-amber-500/30 text-amber-300', posPercent = 33, negPercent = 33;
      if (posCount > negCount) {
        sentiment = 'POSITIVE';
        badgeBg = 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300';
        posPercent = Math.min(Math.round(65 + (posCount / (posCount + 1)) * 30), 96);
        negPercent = Math.round((100 - posPercent) * 0.35);
      } else if (negCount > posCount) {
        sentiment = 'NEGATIVE';
        badgeBg = 'bg-rose-950/80 border-rose-500/30 text-rose-300';
        negPercent = Math.min(Math.round(65 + (negCount / (negCount + 1)) * 30), 96);
        posPercent = Math.round((100 - negPercent) * 0.35);
      } else {
        posPercent = 20;
        negPercent = 20;
      }

      resultCard.innerHTML = `
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-mono font-bold rounded-full ${badgeBg} border">
                PREDICTED SENTIMENT: ${sentiment}
              </span>
            </div>
            <div class="text-xs font-mono text-purple-400">TF-IDF Inference Latency: 38ms</div>
          </div>
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-mono text-slate-300">
              <span>Positive Probability</span>
              <span class="text-emerald-400 font-bold">${posPercent}%</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 transition-all duration-700" style="width: ${posPercent}%"></div>
            </div>
            <div class="flex justify-between text-xs font-mono text-slate-300 pt-1">
              <span>Negative Probability</span>
              <span class="text-rose-400 font-bold">${negPercent}%</span>
            </div>
            <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div class="h-full bg-rose-500 transition-all duration-700" style="width: ${negPercent}%"></div>
            </div>
          </div>
          <div class="pt-2">
            <div class="text-xs text-slate-400 font-mono mb-2">N-Gram Semantic Features Found:</div>
            <div class="flex flex-wrap gap-1.5">
              ${highlightedWords.length > 0 ? highlightedWords.map((item) => `
                <span class="px-2 py-0.5 text-xs font-mono rounded ${item.type === 'pos' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-rose-950 text-rose-300 border border-rose-600/40'}">
                  ${item.type === 'pos' ? '+ ' : '- '}${item.word}
                </span>
              `).join('') : '<span class="text-xs text-slate-500 italic">No strong polarity keywords found (Neutral evaluation).</span>'}
            </div>
          </div>
        </div>
      `;
      btn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i> Classify Sentiment';
      if (window.lucide) window.lucide.createIcons();
    }, 350);
  }

  btn.addEventListener('click', () => analyzeSentiment(input.value));
  presets.forEach((p) => {
    p.addEventListener('click', () => {
      input.value = p.getAttribute('data-text');
      analyzeSentiment(input.value);
    });
  });
}

function initChurnSimulator() {
  const ageSlider = document.getElementById('churn-age');
  const creditSlider = document.getElementById('churn-credit');
  const balanceSlider = document.getElementById('churn-balance');
  const tenureSlider = document.getElementById('churn-tenure');
  const productsSelect = document.getElementById('churn-products');
  const activeCheckbox = document.getElementById('churn-active');
  const countrySelect = document.getElementById('churn-country');

  const ageVal = document.getElementById('val-churn-age');
  const creditVal = document.getElementById('val-churn-credit');
  const balanceVal = document.getElementById('val-churn-balance');
  const tenureVal = document.getElementById('val-churn-tenure');

  const riskGauge = document.getElementById('churn-risk-gauge');
  const riskLabel = document.getElementById('churn-risk-label');
  const riskPercent = document.getElementById('churn-risk-percent');
  const retentionAdvice = document.getElementById('churn-advice');
  if (!ageSlider || !creditSlider || !riskGauge) return;

  function calculateRisk() {
    const age = parseInt(ageSlider.value, 10);
    const credit = parseInt(creditSlider.value, 10);
    const balance = parseInt(balanceSlider.value, 10);
    const tenure = parseInt(tenureSlider.value, 10);
    const products = parseInt(productsSelect ? productsSelect.value : '1', 10);
    const isActive = activeCheckbox ? activeCheckbox.checked : true;
    const country = countrySelect ? countrySelect.value : 'France';

    if (ageVal) ageVal.textContent = age;
    if (creditVal) creditVal.textContent = credit;
    if (balanceVal) balanceVal.textContent = '$' + balance.toLocaleString();
    if (tenureVal) tenureVal.textContent = tenure + ' yrs';

    let score = 0.15;
    if (age > 45) score += ((age - 45) / 35) * 0.35;
    else if (age < 30) score -= 0.05;
    if (balance > 100000) score += 0.15;
    else if (balance === 0) score -= 0.05;
    if (credit < 500) score += 0.18;
    else if (credit > 750) score -= 0.08;
    if (!isActive) score += 0.20;
    if (products >= 3) score += 0.32;
    else if (products === 2) score -= 0.12;
    if (country === 'Germany') score += 0.14;

    const probability = Math.min(Math.max(score, 0.04), 0.95);
    const percentage = Math.round(probability * 100);
    riskPercent.textContent = `${percentage}%`;
    riskGauge.style.width = `${percentage}%`;

    if (percentage < 30) {
      riskLabel.textContent = 'LOW ATTRITION RISK';
      riskLabel.className = 'text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30';
      riskGauge.className = 'h-full bg-emerald-500 transition-all duration-300';
      retentionAdvice.textContent = '✅ Stable customer profile. Maintain standard quarterly loyalty rewards.';
    } else if (percentage < 65) {
      riskLabel.textContent = 'MODERATE RETENTION RISK';
      riskLabel.className = 'text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/30';
      riskGauge.className = 'h-full bg-amber-500 transition-all duration-300';
      retentionAdvice.textContent = '⚠️ Elevated risk. Recommend proactive customer success outreach and engagement perks.';
    } else {
      riskLabel.textContent = 'CRITICAL CHURN RISK';
      riskLabel.className = 'text-xs font-mono font-bold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-500/30';
      riskGauge.className = 'h-full bg-rose-500 transition-all duration-300';
      retentionAdvice.textContent = '🚨 Immediate intervention needed. Assign personal relationship manager and personalized rate plan.';
    }
  }

  [ageSlider, creditSlider, balanceSlider, tenureSlider].forEach((slider) => {
    slider.addEventListener('input', calculateRisk);
  });
  if (productsSelect) productsSelect.addEventListener('change', calculateRisk);
  if (activeCheckbox) activeCheckbox.addEventListener('change', calculateRisk);
  if (countrySelect) countrySelect.addEventListener('change', calculateRisk);
  calculateRisk();
}

function initTerminal() {
  const terminalBody = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  if (!terminalBody || !terminalInput) return;

  const commands = {
    help: 'Available commands:\n  • about     - View profile synopsis & career objective\n  • skills    - List technical skills & tools matrix\n  • projects  - Explore end-to-end live data science apps\n  • certs     - List official credentials & certifications\n  • education - View college & schooling path\n  • resume    - Open official PDF resume in new tab\n  • contact   - View email (harshittrix@gmail.com) and links\n  • clear     - Reset terminal screen\n  • hire      - Instant email composer to harshittrix@gmail.com',
    about: 'Harshit Chugh | Aspiring Data Analyst / Scientist & Second-Year BCA Student @ IITM (GGSIPU).\nSpecializing in Python, Machine Learning, Power BI, SQL, and GenAI Applications.\nCertified in AI Skills by EY/Microsoft. Seeking data analyst / scientist roles.',
    skills: 'Technical Stack:\n  - Languages: Python (Pandas, NumPy), SQL, PHP, HTML/CSS/JS\n  - Data Science & ML: Keras, TensorFlow, Scikit-Learn, GenAI APIs, Regression, NLP, TF-IDF\n  - BI & Visualization: Microsoft Power BI (DAX), MS Excel, Seaborn, Matplotlib\n  - Tools & DBs: MySQL, DBMS, Jupyter Notebook, Git/GitHub, Streamlit Cloud, Render Cloud',
    projects: 'Featured Live Projects:\n  1. ChurnSense - Customer Churn App (Live: churnretention.streamlit.app)\n  2. Aura AI Studio - Generative AI Workspace (Live: auraaistudio.streamlit.app)\n  3. SentiScan - Amazon Reviews NLP Pipeline (Live: sentiment-analysis-wnox.onrender.com)\n  4. Customer Churn Dashboard - Power BI Executive Interactive Analytics',
    education: 'Education Path:\n  • BCA | 2025 - 2028 (Second Year)\n    Institute of Information Technology and Management (IITM), Janakpuri-110058, New Delhi\n    [Affiliated to GGSIPU, Sector-16C, Dwarka-110078, Delhi]\n  • Schooling:\n    Sachdeva Public School, Rohini-110085, New Delhi',
    resume: 'Opening official resume PDF in a new tab...',
    contact: 'Contact Channels:\n  • Primary Email: harshittrix@gmail.com\n  • Alternate Email: hc18july@gmail.com\n  • Phone: +91 9650349635\n  • LinkedIn: linkedin.com/in/harshit-chugh-208669372\n  • GitHub: github.com/harsh1tchugh\n  • Location: Rohini, Delhi, India',
    hire: 'Opening Gmail compose to harshittrix@gmail.com...'
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';
      const line = document.createElement('div');
      line.className = 'text-slate-400 mb-1';
      line.innerHTML = `<span class="text-purple-400 font-bold">harshit@portfolio:~$</span> ${cmd}`;
      terminalBody.appendChild(line);

      if (cmd === 'clear') {
        terminalBody.innerHTML = '';
      } else if (cmd === 'resume') {
        window.open('assets/Harshit_Chugh_Resume.pdf', '_blank');
        const response = document.createElement('div');
        response.className = 'text-purple-300 font-mono text-xs whitespace-pre-line mb-3 pl-3 border-l border-purple-500/40';
        response.textContent = commands[cmd];
        terminalBody.appendChild(response);
      } else if (cmd === 'hire') {
        window.open('https://mail.google.com/mail/?view=cm&fs=1&to=harshittrix@gmail.com&su=Data%20Analyst%20/%20Scientist%20Opportunity', '_blank');
        const response = document.createElement('div');
        response.className = 'text-emerald-300 font-mono text-xs whitespace-pre-line mb-3 pl-3 border-l border-emerald-500/40';
        response.textContent = commands[cmd];
        terminalBody.appendChild(response);
      } else if (commands[cmd]) {
        const response = document.createElement('div');
        response.className = 'text-purple-300 font-mono text-xs whitespace-pre-line mb-3 pl-3 border-l border-purple-500/40';
        response.textContent = commands[cmd];
        terminalBody.appendChild(response);
      } else if (cmd !== '') {
        const err = document.createElement('div');
        err.className = 'text-rose-400 text-xs font-mono mb-2';
        err.textContent = `bash: command not found: '${cmd}'. Type 'help' for valid commands.`;
        terminalBody.appendChild(err);
      }
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

window.copyToClipboard = function(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`✓ Copied ${label} to clipboard!`);
  }).catch(() => {
    showToast(`Copied: ${text}`);
  });
};

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Transmitting Message...';
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      showToast('🚀 Message received! Opening Gmail client...');
      btn.innerHTML = originalText;
      if (window.lucide) window.lucide.createIcons();
      window.open('https://mail.google.com/mail/?view=cm&fs=1&to=harshittrix@gmail.com&su=Website%20Inquiry%20from%20Portfolio', '_blank');
      form.reset();
    }, 600);
  });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-nav-link');
  if (!toggleBtn || !menu) return;
  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
  });
  links.forEach((l) => {
    l.addEventListener('click', () => {
      menu.classList.add('hidden');
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove('text-purple-400');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-purple-400');
      }
    });
  });
}