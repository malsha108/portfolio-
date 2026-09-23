/* Theme toggle */
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const icon = btn.querySelector('i');
  function apply(theme){
    if(theme){ root.setAttribute('data-theme', theme); }
    else { root.removeAttribute('data-theme'); }
    const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    icon.className = isDark ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
  }
  let saved = null;
  try{ saved = localStorage.getItem('theme'); }catch(e){}
  apply(saved);
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    try{ localStorage.setItem('theme', next); }catch(e){}
  });
})();

/* Mobile nav */
(function(){
  const btn = document.getElementById('hamburgerBtn');
  const panel = document.getElementById('mobilePanel');
  btn.addEventListener('click', () => panel.classList.toggle('open'));
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => panel.classList.remove('open')));
})();

/* Scroll reveal */
(function(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.15});
  items.forEach(i=>io.observe(i));
})();

/* ---------------- Projects ---------------- */
const projects = [
  {
    tag: "01 · Desktop Application",
    name: "Hotel Management System",
    short: "A desktop-based hotel operations tool covering rooms, staff and guest flow end to end.",
    type: "Desktop Application",
    desc: "A Java Swing desktop application built to manage day-to-day hotel operations — from customer and staff records to room availability and pickup requests — backed by a MySQL database via JDBC.",
    tech: ["Java Swing","JDBC","MySQL","NetBeans"],
    features: ["Customer, employee, driver, room and department management","Room search and live room status","Check-in and check-out workflows","Pickup request handling"],
    github: "https://github.com/malsha108#:~:text=Public-,Hotel%2DManagement%2DSystem,-Public",
    thumb: `<img src="HHH.PNG" alt="Hotel Management System screenshot">`
  },
  {
    tag: "02 · UI/UX Case Study",
    name: "FoodHub",
    short: "A food delivery app concept focused on local, location-based restaurant discovery.",
    type: "Mobile App UI/UX",
    desc: "A modern food delivery mobile app home screen designed in Figma, focused on discovering local restaurants nearby, with category filters and rich restaurant cards.",
    tech: ["Figma","UI/UX Design","Clay Mockup"],
    features: ["Location-based restaurant discovery","Category filters — Burgers, Pizza, Rice, Drinks","Restaurant cards with ratings, delivery time and distance","3D iPhone mockup presentation"],
    github: "https://github.com/malsha108#:~:text=Public-,InternHub%2DUI%2DUX%2DCase%2DStudy,-Public",
    githubLabel: "View Prototype",
    thumb: `<img src="Untitled-edited.jpg" alt="FoodHub UI screenshot">`
  },
  {
    tag: "03 · UI/UX Case Study",
    name: "InternHub",
    short: "An internship discovery app concept for Sri Lankan HNDIT and university students.",
    type: "Mobile App UI/UX",
    desc: "A mobile app concept helping Sri Lankan students discover and explore internship opportunities, with an interactive Figma prototype linking search, job details and direct HR chat.",
    tech: ["Figma","Auto Layout","Component System"],
    features: ["Home screen with internship search &amp; filters".replace('&amp;','&'),"Job details with company info, salary and requirements","Direct chat screen with HR","Interactive prototype across 3 key screens"],
    github: "https://bit.ly/4dfm7OD",
    githubLabel: "View Prototype",
    thumb: `<img src="Untitled (1).png" alt="InternHub UI screenshot">`
  }
];

const PER_PAGE = 2;
let currentPage = 1;
const projGrid = document.getElementById('projGrid');
const projPagination = document.getElementById('projPagination');

function renderProjects(page){
  currentPage = page;
  const start = (page-1)*PER_PAGE;
  const pageItems = projects.slice(start, start+PER_PAGE);
  projGrid.innerHTML = pageItems.map((p, idx) => `
    <div class="proj-card reveal in">
      <div class="proj-thumb">${p.thumb}</div>
      <div class="proj-body">
        <span class="ptag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <div class="tech-row">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div>
        <div class="proj-actions">
          <a class="btn btn-ghost" href="${p.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> ${p.githubLabel || 'GitHub'}</a>
          <button class="btn btn-ghost details-btn" data-idx="${start+idx}">Details</button>
        </div>
      </div>
    </div>
  `).join('');
  const totalPages = Math.ceil(projects.length / PER_PAGE);
  let html = `<button class="page-btn nav" id="prevPageBtn" ${page===1?'disabled':''}><i class="fa-solid fa-arrow-left"></i> Previous</button>`;
  for(let i=1;i<=totalPages;i++){
    html += `<button class="page-btn ${i===page?'active':''}" data-page="${i}">${i}</button>`;
  }
  html += `<button class="page-btn nav" id="nextPageBtn" ${page===totalPages?'disabled':''}>Next <i class="fa-solid fa-arrow-right"></i></button>`;
  projPagination.innerHTML = html;

  projPagination.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click', ()=>renderProjects(parseInt(b.dataset.page))));
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ if(currentPage>1) renderProjects(currentPage-1); });
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ if(currentPage<totalPages) renderProjects(currentPage+1); });

  projGrid.querySelectorAll('.details-btn').forEach(b=>b.addEventListener('click', ()=>openProjectModal(parseInt(b.dataset.idx))));
}
renderProjects(1);

/* Modal */
const modalBackdrop = document.getElementById('projModalBackdrop');
const modalContent = document.getElementById('modalContent');
function openProjectModal(idx){
  const p = projects[idx];
  modalContent.innerHTML = `
    <span class="ptag">${p.tag}</span>
    <h3>${p.name}</h3>
    <div class="modal-type">${p.type}</div>
    <p style="color:var(--text-dim); font-size:14.5px;">${p.desc}</p>
    <div class="tech-row">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div>
    <div class="feat-label">Key Features</div>
    <ul class="feat-list">${p.features.map(f=>`<li><i class="fa-solid fa-circle-check"></i>${f}</li>`).join('')}</ul>
    <div style="margin-top:24px;">
      <a class="btn btn-primary" href="${p.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> ${p.githubLabel || 'GitHub Repository'}</a>
    </div>
  `;
  modalBackdrop.classList.add('open');
}
function closeModal(){ modalBackdrop.classList.remove('open'); }
document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e)=>{ if(e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

/* ---------------- Certifications ---------------- */
const certs = [
  {icon:"fa-solid fa-certificate", title:"Diploma in Information Technology", org:"Oxford Training College", year:"2022", link:"CamScanner 09-22-2026 20.41.pdf"},
  {icon:"fa-solid fa-award", title:"National Vocational Qualification Level 4", org:"VTA", year:"2025", link:"CamScanner 09-22-2026 20.42.pdf"},
  {icon:"fa-solid fa-globe", title:"Web Design for Beginners", org:"University of Moratuwa", year:"2025", link:"Web_Design_for_Beginners_E-Certificate.pdf"},
  {icon:"fa-solid fa-vial", title:"Testing for Beginners", org:"Simplilearn", year:"2026", link:"10729326_11074990_1789397150166.pdf"},
  {icon:"fa-brands fa-python", title:"Python for Beginners", org:"University of Moratuwa", year:"2023", link:"Python_for_Beginners_E-Certificate.pdf"},
  {icon:"fa-brands fa-figma", title:"Figma for Beginners", org:"Simplilearn", year:"2026", link:"10760704_11074990_1789919127004.pdf"}
];
const certGrid = document.getElementById('certGrid');
const certToggleBtn = document.getElementById('certToggleBtn');
let certsExpanded = false;
function renderCerts(){
  const visible = certsExpanded ? certs : certs.slice(0,3);
  certGrid.innerHTML = visible.map(c => `
    <div class="cert-card reveal in">
      <div class="cert-icon"><i class="${c.icon}"></i></div>
      <h3>${c.title}</h3>
      <div class="cert-org">${c.org}</div>
      <span class="cert-year">${c.year}</span>
      <a class="btn btn-ghost" href="${c.link}" target="_blank" rel="noopener"><i class="fa-regular fa-file-lines"></i> View Certificate</a>
    </div>
  `).join('');
  certToggleBtn.textContent = certsExpanded ? 'View Less' : 'View More';
}
certToggleBtn.addEventListener('click', () => { certsExpanded = !certsExpanded; renderCerts(); });
renderCerts();

/* ---------------- Contact form validation ---------------- */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
function setError(fieldId, msg){
  const field = document.getElementById(fieldId);
  field.classList.toggle('error', !!msg);
  field.querySelector('.err-msg').textContent = msg || '';
}
form.addEventListener('submit', function(e){
  e.preventDefault();
  let valid = true;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if(!name){ setError('f-name','Please enter your name.'); valid=false; } else setError('f-name','');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!email){ setError('f-email','Please enter your email.'); valid=false; }
  else if(!emailOk){ setError('f-email','Please enter a valid email.'); valid=false; }
  else setError('f-email','');
  if(!subject){ setError('f-subject','Please add a subject.'); valid=false; } else setError('f-subject','');
  if(!message || message.length < 10){ setError('f-message','Message should be at least 10 characters.'); valid=false; } else setError('f-message','');

  if(!valid){ formStatus.style.color = '#D9534F'; formStatus.textContent = 'Please fix the highlighted fields.'; return; }

  formStatus.style.color = 'var(--accent)';
  formStatus.textContent = 'Message ready — connect a mail service to send it directly.';
  form.reset();
});
