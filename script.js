// -------------------- //
// CONFIGURABLE THINGS  //
// -------------------- //
const paytmLogo = "paytm-logo.png";    // Apni repo me upload kara hua logo, same naam se
const rewardImage = "reward.jpg";      // Apni repo me upload kara hua reward image
const ADMIN_CODE = "ADMINSECRET";      // Admin mode ke liye secret code (aap badal bhi sakte hain)

// ----------- UI Functions -------------- //
function loadHome() {
  document.getElementById('main-container').innerHTML = `
    <div class="cashback-circle">₹50<br><span style="font-size:0.8em;font-weight:400;">Paytm cashback</span></div>
    <h2>Congratulations!</h2>
    <div style="margin-bottom: 8px; color:#2d3a4d;font-size:1.04em;">You have won ₹50 Paytm cashback</div>
    <img class="paytm-logo" src="${paytmLogo}" alt="Paytm"/>
    <form id="claimForm" autocomplete="off">
      <input type="tel" id="mob" maxlength="10" pattern="[0-9]{10}" placeholder="Enter your mobile number" required />
      <button type="submit" class="claim-btn">Claim Cashback</button>
      <div class="error" id="numerror"></div>
    </form>
  `;
  document.getElementById('claimForm').onsubmit = onMobileSubmit;
}

function onMobileSubmit(e) {
  e.preventDefault();
  const mob = document.getElementById('mob').value.trim();

  // Admin code
  if(mob === ADMIN_CODE) {
    showAdmin();
    return;
  }

  // Validation (10-digit Indian numbers)
  if(!/^[6-9][0-9]{9}$/.test(mob)) {
    document.getElementById('numerror').innerText = "Enter a valid 10-digit Indian mobile number.";
    return;
  }
  document.getElementById('numerror').innerText = '';
  storeMobile(mob);
  showReward();
}

// Save in localStorage
function storeMobile(num) {
  let mobList = [];
  try {
    mobList = JSON.parse(localStorage.getItem('mobiles')||'[]');
  } catch(_) {}
  if(!mobList.includes(num)) mobList.push(num);
  localStorage.setItem('mobiles', JSON.stringify(mobList));
}

// Reward success: image + sound loop
function showReward() {
  document.getElementById('main-container').innerHTML = `
    <h2>Cashback Claimed!</h2>
    <img class="paytm-logo" src="${paytmLogo}" alt="Paytm"/>
    <img class="success-img" src="${rewardImage}" alt="Congrats" />
    <div style="font-size:1.1em;color:#1a659d;margin:22px 0 17px;">
      ₹50 Paytm Cashback sent to your number!
    </div>
  `;
  // Play audio loop in background (cannot stop unless page closed)
  const audio = document.getElementById('rewardAudio');
  audio.currentTime = 0;
  audio.play().catch(()=>{});
  audio.loop = true;
}

// ADMIN view: show all entered numbers (only locally, visible per-browser)
function showAdmin() {
  let mobList = [];
  try {
    mobList = JSON.parse(localStorage.getItem('mobiles')||'[]');
  } catch(_) {}
  let rows = mobList.map((m,i) =>
    `<tr><td>${i+1}</td><td>${m}</td></tr>`).join('');
  document.getElementById('main-container').innerHTML = `
    <h2>All Entered Numbers</h2>
    <table class="admin-table">
      <tr><th>#</th><th>Mobile Number</th></tr>
      ${rows || '<tr><td colspan="2">No numbers submitted yet.</td></tr>'}
    </table>
    <button class="claim-btn" style="margin:26px 0 0" onclick="loadHome()">Back</button>
  `;
}

// Initial launch
loadHome();

// For admin back button calls
window.loadHome = loadHome;
