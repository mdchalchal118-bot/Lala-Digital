// Default Configuration Data Structure
const defaultConfig = {
    siteTitle: "Lala Digital",
    siteSubtitle: "Official VIP Hub & Digital Services",
    logoUrl: "https://dummyimage.com/500x500/0a0c14/00f3ff.png&text=LALA+DIGITAL",
    bannerUrl: "https://dummyimage.com/1200x400/0a0c14/bc13fe.png&text=LALA+DIGITAL+VIP+HUB",
    noticeText: "অফিশিয়াল চ্যানেল ও সাপোর্টের জন্য নিচের বাটনগুলোতে যুক্ত থাকুন!",
    bgMusicUrl: "",
    adminPassword: "lala999",
    visitorCount: 128,
    buttons: [
        {
            type: "ff_guild",
            title: "Free Fire Guild ID",
            sub: "Guild ID: 987654321 (কপি করে গেম খুলুন)",
            value: "987654321",
            icon: "fas fa-shield-alt"
        },
        {
            type: "telegram",
            title: "Join Telegram Channel",
            sub: "অফিশিয়াল আপডেট পেতে যুক্ত থাকুন",
            url: "https://t.me",
            icon: "fab fa-telegram-plane"
        },
        {
            type: "youtube",
            title: "Subscribe YouTube",
            sub: "নতুন ভিডিও দেখতে সাবস্ক্রাইব করুন",
            url: "https://youtube.com",
            icon: "fab fa-youtube"
        }
    ]
};

// Global App State
let appData = JSON.parse(localStorage.getItem('lala_app_config')) || defaultConfig;
let titleClickCount = 0;
let titleClickTimer = null;
let audioPlayer = new Audio();

// Initialize Website Features
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    renderSiteUI();
    startBDClock();
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Visitor counter logic
    appData.visitorCount = (appData.visitorCount || 0) + 1;
    saveConfig();
});

// Render Main UI Components
function renderSiteUI() {
    // Dynamic Brand Title Rendering
    const titleText = appData.siteTitle || "Lala Digital";
    const parts = titleText.split(' ');
    
    if (parts.length >= 2) {
        document.getElementById('siteTitle').innerHTML = `
            <span class="brand-first">${parts[0]}</span> 
            <span class="brand-second">${parts.slice(1).join(' ')}</span>
        `;
    } else {
        document.getElementById('siteTitle').innerHTML = `<span class="brand-first">${titleText}</span>`;
    }

    document.getElementById('siteSubtitle').textContent = appData.siteSubtitle;
    document.getElementById('logoImg').src = appData.logoUrl;
    document.getElementById('bannerImg').src = appData.bannerUrl;
    document.getElementById('noticeText').textContent = appData.noticeText;

    const container = document.getElementById('buttonsContainer');
    container.innerHTML = '';

    appData.buttons.forEach((btn) => {
        const card = document.createElement('div');
        card.className = 'custom-btn-card';

        if (btn.type === 'ff_uid' || btn.type === 'ff_guild') {
            card.onclick = () => copyAndOpenGame(btn.value);
        } else {
            card.onclick = () => window.open(btn.url, '_blank');
        }

        card.innerHTML = `
            <div class="btn-icon-wrapper"><i class="${btn.icon || 'fas fa-link'}"></i></div>
            <div class="btn-content">
                <span class="btn-title">${btn.title}</span>
                <span class="btn-sub">${btn.sub}</span>
            </div>
            <i class="fas fa-chevron-right" style="font-size: 0.8rem; color: var(--text-muted);"></i>
        `;
        container.appendChild(card);
    });
}

// Live BD Clock
function startBDClock() {
    setInterval(() => {
        const options = { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
        document.getElementById('bdClock').textContent = `BD Time: ${timeStr}`;
    }, 1000);
}

// Copy & Toast Utility
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function copyAndOpenGame(val) {
    navigator.clipboard.writeText(val);
    showToast(`Copied: ${val} (Opening Game...)`);
    setTimeout(() => {
        window.location.href = "freefire://";
    }, 1000);
}

// Bio Generator Tool Logic
function updateBioPreview() {
    const input = document.getElementById('bioInput').value;
    document.getElementById('bioPreviewText').textContent = input ? input : 'Preview: [FF0000]Your Text';
}

function applyColor(code) {
    const input = document.getElementById('bioInput');
    input.value = `${code}${input.value}`;
    updateBioPreview();
}

function copyBioCode() {
    const text = document.getElementById('bioInput').value;
    if(!text) return showToast('Please enter text first!');
    navigator.clipboard.writeText(text);
    showToast('FF Bio Code Copied!');
}

// Secret Admin Panel Activation (Click Title 4 Times)
function handleTitleClick() {
    titleClickCount++;
    clearTimeout(titleClickTimer);
    titleClickTimer = setTimeout(() => { titleClickCount = 0; }, 1500);

    if (titleClickCount >= 4) {
        titleClickCount = 0;
        const pass = prompt('Enter VIP Admin Password:');
        if (pass === appData.adminPassword) {
            openAdminPanel();
        } else if (pass !== null) {
            alert('Incorrect Password!');
        }
    }
}

function openAdminPanel() {
    document.getElementById('adminSiteTitle').value = appData.siteTitle;
    document.getElementById('adminSiteSubtitle').value = appData.siteSubtitle;
    document.getElementById('adminLogoUrl').value = appData.logoUrl;
    document.getElementById('adminBannerUrl').value = appData.bannerUrl;
    document.getElementById('adminNoticeText').value = appData.noticeText;
    document.getElementById('adminMusicUrl').value = appData.bgMusicUrl || '';
    document.getElementById('visitorCount').textContent = appData.visitorCount;

    renderAdminButtons();
    document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
}

function switchAdminTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// Dynamic Admin Button Editing
function renderAdminButtons() {
    const list = document.getElementById('adminButtonsList');
    list.innerHTML = '';

    appData.buttons.forEach((btn, i) => {
        const item = document.createElement('div');
        item.className = 'admin-btn-row';
        item.innerHTML = `
            <button class="btn-delete" onclick="removeButton(${i})">&times;</button>
            <input type="text" value="${btn.title}" placeholder="Button Title" onchange="appData.buttons[${i}].title = this.value">
            <input type="text" value="${btn.sub}" placeholder="Subtitle" onchange="appData.buttons[${i}].sub = this.value">
            <input type="text" value="${btn.url || btn.value || ''}" placeholder="Link URL or Value" onchange="appData.buttons[${i}].url = this.value; appData.buttons[${i}].value = this.value;">
        `;
        list.appendChild(item);
    });
}

function addNewButtonField() {
    appData.buttons.push({ title: "New Button", sub: "Click here", url: "#", icon: "fas fa-link" });
    renderAdminButtons();
}

function removeButton(i) {
    appData.buttons.splice(i, 1);
    renderAdminButtons();
}

function saveAdminSettings() {
    appData.siteTitle = document.getElementById('adminSiteTitle').value;
    appData.siteSubtitle = document.getElementById('adminSiteSubtitle').value;
    appData.logoUrl = document.getElementById('adminLogoUrl').value;
    appData.bannerUrl = document.getElementById('adminBannerUrl').value;
    appData.noticeText = document.getElementById('adminNoticeText').value;
    appData.bgMusicUrl = document.getElementById('adminMusicUrl').value;

    const newPass = document.getElementById('adminNewPassword').value;
    if (newPass) appData.adminPassword = newPass;

    saveConfig();
    renderSiteUI();
    closeAdminPanel();
    showToast('Settings Saved Successfully!');
}

function saveConfig() {
    localStorage.setItem('lala_app_config', JSON.stringify(appData));
}

// Background Particle Canvas Logic
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? '#00f3ff' : '#bc13fe',
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
