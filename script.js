const defaultSiteData = {
    title: "Lala Digital",
    bio: "Official VIP Hub & Digital Services",
    notice: "📢 অফিশিয়াল চ্যানেল ও সাপোর্টের জন্য নীচের বাটনগুলোতে যুক্ত থাকুন!",
    logo: "https://via.placeholder.com/150/00f3ff/8000ff?text=LALA",
    banner: "https://via.placeholder.com/600x200/111827/00f3ff?text=LALA+DIGITAL",
    password: "lala999",
    visitors: 0,
    buttons: [
        { title: "Official Telegram Channel", desc: "সব ধরণের আপডেট ও অফার পেতে জয়েন করুন", link: "https://t.me", type: "telegram" },
        { title: "WhatsApp Direct Chat", desc: "সরাসরি ২৪/৭ সাপোর্ট ও মেসেজিং", link: "https://wa.me/", type: "whatsapp" },
        { title: "TikTok Official Page", desc: "ভিডিও আপডেট দেখতে ফলো করুন", link: "https://tiktok.com", type: "tiktok" },
        { title: "Free Fire Main UID", desc: "UID: 123456789 (কপি করে গেম ওপেন হবে)", link: "123456789", type: "uid" }
    ]
};

let currentData = {};
let tempAdminButtons = [];
let clickAudio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');

function initSite() {
    currentData = JSON.parse(localStorage.getItem('lala_vip_site_data')) || defaultSiteData;
    currentData.visitors = (currentData.visitors || 0) + 1;
    localStorage.setItem('lala_vip_site_data', JSON.stringify(currentData));

    renderUI();
    initParticles();
    startClock();
}

function renderUI() {
    document.getElementById('page-title').innerText = currentData.title + " - VIP Hub";
    document.getElementById('site-title').innerText = currentData.title;
    document.getElementById('display-bio').innerText = currentData.bio;
    
    document.getElementById('display-logo').src = currentData.logo;
    document.getElementById('title-icon').src = currentData.logo;
    document.getElementById('favicon').href = currentData.logo;
    document.getElementById('display-banner').src = currentData.banner;

    const noticeEl = document.getElementById('display-notice');
    if (currentData.notice && currentData.notice.trim() !== "") {
        noticeEl.innerText = currentData.notice;
        noticeEl.style.display = "block";
    } else {
        noticeEl.style.display = "none";
    }

    const btnContainer = document.getElementById('buttons-container');
    btnContainer.innerHTML = "";

    if (currentData.buttons && currentData.buttons.length > 0) {
        currentData.buttons.forEach((btn) => {
            const card = document.createElement('div');
            
            // Icon & Color Logic based on Type
            let iconClass = "fa-solid fa-link";
            let brandClass = "";

            if(btn.type === 'whatsapp') { iconClass = "fa-brands fa-whatsapp"; brandClass = "whatsapp"; }
            else if(btn.type === 'telegram') { iconClass = "fa-brands fa-telegram"; brandClass = "telegram"; }
            else if(btn.type === 'tiktok') { iconClass = "fa-brands fa-tiktok"; brandClass = "tiktok"; }
            else if(btn.type === 'youtube') { iconClass = "fa-brands fa-youtube"; brandClass = "youtube"; }
            else if(btn.type === 'uid' || btn.type === 'guild') { iconClass = "fa-solid fa-gamepad"; brandClass = "freefire"; }

            card.className = `vip-card-btn ${brandClass}`;
            card.onclick = () => handleButtonClick(btn);

            card.innerHTML = `
                <div class="btn-icon-box"><i class="${iconClass}"></i></div>
                <div class="card-text-content">
                    <div class="card-title">${btn.title}</div>
                    <div class="card-desc">${btn.desc || ''}</div>
                </div>
            `;
            btnContainer.appendChild(card);
        });
    }
}

function handleButtonClick(btn) {
    playClickSound();
    if (btn.type === 'uid' || btn.type === 'guild') {
        navigator.clipboard.writeText(btn.link);
        showToast(`📋 ${btn.type.toUpperCase()} Copied: ${btn.link}`);
        setTimeout(() => {
            window.location.href = "intent://#Intent;scheme=freefire;package=com.dts.freefireth;end";
        }, 1000);
    } else {
        if (btn.link) window.open(btn.link, '_blank');
    }
}

function playClickSound() {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(() => {});
}

function showToast(msg) {
    const toast = document.getElementById('toast-notify');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Secret Trigger for Admin
let clickCounter = 0;
let clickTimer;

document.getElementById('secret-trigger').addEventListener('click', () => {
    clickCounter++;
    clearTimeout(clickTimer);

    if (clickCounter === 4) {
        clickCounter = 0;
        const enteredPass = prompt("🔑 Enter VIP Admin Password:");
        if (enteredPass === (currentData.password || "lala999")) {
            openAdminModal();
        } else if (enteredPass !== null) {
            alert("❌ Incorrect Password!");
        }
    }
    clickTimer = setTimeout(() => { clickCounter = 0; }, 1200);
});

function openAdminModal() {
    document.getElementById('admin-visitor-count').innerText = currentData.visitors || 1;
    document.getElementById('admin-title').value = currentData.title || "";
    document.getElementById('admin-bio').value = currentData.bio || "";
    document.getElementById('admin-notice').value = currentData.notice || "";
    document.getElementById('admin-logo').value = currentData.logo || "";
    document.getElementById('admin-banner').value = currentData.banner || "";
    document.getElementById('admin-new-pass').value = currentData.password || "lala999";

    tempAdminButtons = currentData.buttons ? JSON.parse(JSON.stringify(currentData.buttons)) : [];
    renderAdminButtons();
    document.getElementById('admin-modal').style.display = "flex";
}

function closeAdmin() {
    document.getElementById('admin-modal').style.display = "none";
}

// Refresh Prevent Engine inside Admin Panel
window.addEventListener('beforeunload', (e) => {
    if (document.getElementById('admin-modal').style.display === "flex") {
        e.preventDefault();
        e.returnValue = '';
    }
});

function switchTab(tabName, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

function renderAdminButtons() {
    const list = document.getElementById('admin-buttons-list');
    list.innerHTML = "";

    tempAdminButtons.forEach((btn, index) => {
        const item = document.createElement('div');
        item.className = "button-item-row";
        item.innerHTML = `
            <button type="button" class="btn-del" onclick="deleteAdminButton(${index})">🗑️ Delete</button>
            <label>Button Title</label>
            <input type="text" value="${btn.title}" oninput="tempAdminButtons[${index}].title = this.value">
            
            <label>Subtitle / Description</label>
            <input type="text" value="${btn.desc || ''}" oninput="tempAdminButtons[${index}].desc = this.value">
            
            <label>Link / UID Number</label>
            <input type="text" value="${btn.link}" oninput="tempAdminButtons[${index}].link = this.value">
            
            <label>Type / App Icon</label>
            <select style="width:100%; padding:8px; background:#070910; color:#fff; border:1px solid #bc13fe; border-radius:6px; margin-top:4px;" onchange="tempAdminButtons[${index}].type = this.value">
                <option value="link" ${btn.type === 'link' ? 'selected' : ''}>Standard URL Link</option>
                <option value="whatsapp" ${btn.type === 'whatsapp' ? 'selected' : ''}>WhatsApp (Green App Theme)</option>
                <option value="telegram" ${btn.type === 'telegram' ? 'selected' : ''}>Telegram (Blue App Theme)</option>
                <option value="tiktok" ${btn.type === 'tiktok' ? 'selected' : ''}>TikTok (Red/Black Theme)</option>
                <option value="youtube" ${btn.type === 'youtube' ? 'selected' : ''}>YouTube (Red Theme)</option>
                <option value="uid" ${btn.type === 'uid' ? 'selected' : ''}>Free Fire UID (Copy & Launch)</option>
                <option value="guild" ${btn.type === 'guild' ? 'selected' : ''}>Guild ID (Copy & Launch)</option>
            </select>
        `;
        list.appendChild(item);
    });
}

function addNewButtonField() {
    tempAdminButtons.push({ title: "New VIP Button", desc: "Short description here", link: "", type: "link" });
    renderAdminButtons();
}

function deleteAdminButton(index) {
    tempAdminButtons.splice(index, 1);
    renderAdminButtons();
}

function saveAdminSettings() {
    currentData.title = document.getElementById('admin-title').value;
    currentData.bio = document.getElementById('admin-bio').value;
    currentData.notice = document.getElementById('admin-notice').value;
    currentData.logo = document.getElementById('admin-logo').value;
    currentData.banner = document.getElementById('admin-banner').value;
    currentData.password = document.getElementById('admin-new-pass').value || "lala999";
    currentData.buttons = tempAdminButtons;

    localStorage.setItem('lala_vip_site_data', JSON.stringify(currentData));
    renderUI();
    closeAdmin();
    showToast("💾 VIP Dashboard Saved & Live!");
}

function applyColor(colorCode) {
    const input = document.getElementById('ff-bio-input');
    input.value = colorCode + input.value;
    updateFFPreview();
}

document.getElementById('ff-bio-input').addEventListener('input', updateFFPreview);

function updateFFPreview() {
    const val = document.getElementById('ff-bio-input').value;
    document.getElementById('ff-bio-result').innerText = "Preview: " + (val || "Your Text");
}

function copyFFBio() {
    const text = document.getElementById('ff-bio-input').value;
    if (text) {
        navigator.clipboard.writeText(text);
        showToast("📋 FF Bio Code Copied!");
    }
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('server-time').innerText = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka' });
    }, 1000);
}

const audioBtn = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

audioBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        audioBtn.innerText = "🎵 Music: OFF";
    } else {
        bgMusic.play().catch(() => alert("Click again to allow audio"));
        audioBtn.innerText = "🎵 Music: ON";
    }
    isPlaying = !isPlaying;
});

function exportBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentData));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = "lala_digital_backup.json";
    a.click();
}

function importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            currentData = JSON.parse(evt.target.result);
            localStorage.setItem('lala_vip_site_data', JSON.stringify(currentData));
            renderUI();
            closeAdmin();
            showToast("📥 Backup Restored Successfully!");
        } catch (err) {
            alert("Invalid Backup File!");
        }
    };
    reader.readAsText(file);
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "rgba(0, 243, 255, 0.5)";
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;

            if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
            if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
        });
    }
    animate();
}

window.onload = initSite;
