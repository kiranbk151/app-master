const menuConfig = {
  "co-cw": [
    { label: "Home", section: "home" },
    {
      label: "Workcode",
      children: [
        { label: "New", section: "workcode-new" },
        { label: "View", section: "workcode-view" },
      ],
    },
    {
      label: "CBR",
      children: [
        { label: "New", section: "cbr-new" },
        { label: "View", section: "cbr-view" },
      ],
    },
    {
      label: "Indent",
      children: [
        { label: "Generate", section: "indent-generate" },
        { label: "View", section: "indent-view" },
      ],
    },
    { label: "Masters", section: "masters" },
    { label: "Adjustments", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
  "co-ao": [
    { label: "Home", section: "home" },
    { label: "Pending Indents", section: "indent-view" },
    { label: "Approved Indents", section: "indent-view" },
    { label: "Rejected Indents", section: "indent-view" },
    { label: "Adjusted CBR", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
  cao: [
    { label: "Home", section: "home" },
    { label: "Pending Indents", section: "indent-view" },
    { label: "Approved Indents", section: "indent-view" },
    { label: "Rejected Indents", section: "indent-view" },
    { label: "Adjusted CBR", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
  "ro-cw": [
    { label: "Home", section: "home" },
    { label: "Pending Indents", section: "indent-view" },
    { label: "Approved Indents", section: "indent-view" },
    { label: "Rejected Indents", section: "indent-view" },
    { label: "Part Released Indents", section: "indent-view" },
    { label: "Cleared Indents", section: "indent-view" },
    { label: "Adjusted CBR", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
  gm: [
    { label: "Home", section: "home" },
    { label: "Pending Indents", section: "indent-view" },
    { label: "Approved Indents", section: "indent-view" },
    { label: "Rejected Indents", section: "indent-view" },
    { label: "Part Released Indents", section: "indent-view" },
    { label: "Cleared Indents", section: "indent-view" },
    { label: "Adjusted CBR", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
  md: [
    { label: "Home", section: "home" },
    { label: "Pending Indents", section: "indent-view" },
    { label: "Approved Indents", section: "indent-view" },
    { label: "Rejected Indents", section: "indent-view" },
    { label: "Part Released Indents", section: "indent-view" },
    { label: "Cleared Indents", section: "indent-view" },
    { label: "Adjusted CBR", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
  master: [
    { label: "Home", section: "home" },
    { label: "Workcode", section: "workcode-new" },
    { label: "CBR", section: "cbr-new" },
    { label: "Indent", section: "indent-generate" },
    { label: "Masters", section: "masters" },
    { label: "Adjustments", section: "adjustments" },
    { label: "Reports", section: "reports" },
    { label: "Support", section: "support" },
  ],
};

const menu = document.getElementById("menu");
const roleSelect = document.getElementById("role");
const panels = document.querySelectorAll(".panel");
const pageTitle = document.getElementById("page-title");
const toast = document.getElementById("toast");

const workcodeNo = document.getElementById("workcode-no");
const cbrNo = document.getElementById("cbr-no");
const raBillAmount = document.getElementById("ra-bill-amount");
const raLakhs = document.getElementById("ra-lakhs");
const raWords = document.getElementById("ra-words");
const totalStat = document.getElementById("total-stat");
const totalNigam = document.getElementById("total-nigam");
const chequeAmount = document.getElementById("cheque-amount");
const indentGenerateBody = document.getElementById("indent-generate-body");
const indentViewBody = document.getElementById("indent-view-body");

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
};

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
};

const setActiveSection = (sectionId, label) => {
  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.section === sectionId);
  });
  pageTitle.textContent = label;
};

const renderMenu = (role) => {
  menu.innerHTML = "";
  const items = menuConfig[role] || [];
  items.forEach((item, index) => {
    if (item.children) {
      const wrapper = document.createElement("div");
      const button = document.createElement("button");
      button.textContent = item.label;
      button.classList.add("menu-parent");
      wrapper.appendChild(button);
      const submenu = document.createElement("div");
      submenu.classList.add("submenu");
      item.children.forEach((child) => {
        const childButton = document.createElement("button");
        childButton.textContent = child.label;
        childButton.addEventListener("click", () => {
          setActiveSection(child.section, `${item.label} • ${child.label}`);
          setActiveButton(childButton);
        });
        submenu.appendChild(childButton);
      });
      wrapper.appendChild(submenu);
      menu.appendChild(wrapper);
    } else {
      const button = document.createElement("button");
      button.textContent = item.label;
      button.addEventListener("click", () => {
        setActiveSection(item.section, item.label);
        setActiveButton(button);
      });
      menu.appendChild(button);
      if (index === 0) setActiveButton(button);
    }
  });
};

const setActiveButton = (activeButton) => {
  menu.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
};

const generateWorkcode = () => {
  const random = Math.floor(10000 + Math.random() * 90000);
  workcodeNo.value = `WC-${random}`;
};

const generateCbrNo = () => {
  const now = new Date();
  cbrNo.value = `CBR-${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

const numberToWords = (num) => {
  if (!Number.isFinite(num) || num <= 0) return "Zero rupees only";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const twoDigits = (n) => (n < 20 ? ones[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`);
  const threeDigits = (n) => {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return `${h ? `${ones[h]} Hundred ` : ""}${r ? twoDigits(r) : ""}`.trim();
  };
  let n = Math.floor(num);
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${threeDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
  if (n) parts.push(threeDigits(n));
  return `${parts.join(" ")} rupees only`;
};

const sumInputs = (selector) => Array.from(document.querySelectorAll(selector)).reduce((acc, input) => acc + (parseFloat(input.value) || 0), 0);

const updateCbrCalculations = () => {
  if (!raBillAmount) return;
  const ra = parseFloat(raBillAmount.value) || 0;
  const stat = sumInputs(".stat-input");
  const nigam = sumInputs(".nigam-input");
  const cheque = ra - (stat + nigam);

  if (totalStat) totalStat.value = stat.toFixed(2);
  if (totalNigam) totalNigam.value = nigam.toFixed(2);
  if (chequeAmount) chequeAmount.value = cheque.toFixed(2);
  if (raLakhs) raLakhs.value = (ra / 100000).toFixed(2);
  if (raWords) raWords.textContent = `Amount in words: ${numberToWords(ra)}`;
};

const renderWorkcodeList = (rows) => {
  const body = document.getElementById("workcode-list-body");
  if (!body) return;
  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.workcode_no}</td>
      <td>${row.name_of_work}</td>
      <td>${row.project}</td>
      <td>${row.contractor}</td>
      <td><span class="status success">Saved</span></td>
      <td><button class="ghost small">Edit</button></td>
    </tr>`).join("");
};

const renderCbrList = (rows) => {
  const body = document.getElementById("cbr-list-body");
  if (!body) return;
  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.cbr_no}</td>
      <td>${row.workcode_no}</td>
      <td>₹ ${Number(row.ra_bill_amount || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
      <td><span class="status info">${row.status || 'Pending AO'}</span></td>
      <td><button class="ghost small">View</button></td>
    </tr>`).join("");
};

const loadData = async () => {
  try {
    const workcodes = await api('/api/workcodes');
    renderWorkcodeList(workcodes);
  } catch (error) {
    showToast('Workcode API unavailable');
  }

  try {
    const cbrs = await api('/api/cbrs');
    renderCbrList(cbrs);
  } catch (error) {
    showToast('CBR API unavailable');
  }

  try {
    const indents = await api('/api/indents');
    renderIndentTables(indents);
  } catch (error) {
    showToast('Indent API unavailable');
  }
};

const rowClassByStatus = (status = '') => {
  if (status.includes('Approved')) return 'row-approved';
  if (status.includes('Rejected')) return 'row-rejected';
  return 'row-pending';
};

const renderIndentTables = (rows) => {
  if (indentGenerateBody) {
    indentGenerateBody.innerHTML = rows.map((row) => `\n      <tr>\n        <td>${row.indent_no}</td>\n        <td>${row.indent_date}</td>\n        <td>${row.zone}</td>\n        <td>${row.division}</td>\n        <td><span class="status info">${row.status}</span></td>\n        <td><button class="primary small send-indent-row" data-id="${row.indent_no}">Send</button></td>\n      </tr>`).join('');
  }

  if (indentViewBody) {
    indentViewBody.innerHTML = rows.map((row, idx) => `\n      <tr class="${rowClassByStatus(row.status)}">\n        <td>${idx + 1}</td>\n        <td>${row.indent_no}</td>\n        <td>${row.indent_date}</td>\n        <td>${row.zone}</td>\n        <td>${row.division}</td>\n        <td>${row.subdivision}</td>\n        <td>${row.status}</td>\n      </tr>`).join('');
  }
};

roleSelect.addEventListener("change", (event) => {
  renderMenu(event.target.value);
  setActiveSection("home", "Home Dashboard");
});

const workcodeForm = document.getElementById("workcode-form");
workcodeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    workcode_no: workcodeNo.value,
    financial_year: document.getElementById('wc-fin-year')?.value,
    name_of_work: document.getElementById('wc-name-work')?.value || '',
    contractor: document.getElementById('wc-contractor')?.value || '',
    project: document.getElementById('wc-project')?.value || ''
  };
  try {
    const saved = await api('/api/workcodes', { method: 'POST', body: JSON.stringify(payload) });
    showToast(`New workcode has been created. ${saved.workcode_no}`);
    generateWorkcode();
    await loadData();
    workcodeForm.reset();
    generateWorkcode();
  } catch (error) {
    showToast('Failed to save workcode');
  }
});

const cbrForm = document.getElementById("cbr-form");
cbrForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    cbr_no: cbrNo.value,
    workcode_no: document.getElementById('cbr-workcode-search')?.value || '',
    ra_bill_no: document.getElementById('cbr-ra-bill-no')?.value || '',
    ra_bill_amount: parseFloat(raBillAmount?.value) || 0,
    total_stat: parseFloat(totalStat?.value) || 0,
    total_nigam: parseFloat(totalNigam?.value) || 0,
    cheque_amount: parseFloat(chequeAmount?.value) || 0
  };

  try {
    const saved = await api('/api/cbrs', { method: 'POST', body: JSON.stringify(payload) });
    showToast(`New CBR No has been created. ${saved.cbr_no}`);
    cbrForm.reset();
    generateCbrNo();
    updateCbrCalculations();
    await loadData();
  } catch (error) {
    showToast('Failed to save CBR');
  }
});

if (raBillAmount) {
  raBillAmount.addEventListener("input", updateCbrCalculations);
  document.querySelectorAll(".stat-input, .nigam-input").forEach((input) => {
    input.addEventListener("input", updateCbrCalculations);
  });
}

const indentForm = document.getElementById("indent-form");
indentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const created = await api('/api/indents', { method: 'POST', body: JSON.stringify({}) });
    showToast(`Indent generated: ${created.indent_no}`);
    await loadData();
  } catch (error) {
    showToast('Failed to generate indent');
  }
});

const sendIndentBtn = document.getElementById('send-indent-btn');
if (sendIndentBtn) {
  sendIndentBtn.addEventListener('click', async () => {
    const indents = await api('/api/indents');
    if (!indents.length) return showToast('No indent to send');
    const indent = indents[0];
    await api('/api/indents/action', {
      method: 'POST',
      body: JSON.stringify({ indent_no: indent.indent_no, current_role: indent.current_role, action: 'approve' })
    });
    showToast('Sent to next level in flow');
    await loadData();
  });
}

const actionBtn = document.getElementById('indent-action-btn');
if (actionBtn) {
  actionBtn.addEventListener('click', async () => {
    const indentNo = document.getElementById('indent-action-no')?.value;
    const role = document.getElementById('indent-action-role')?.value;
    const action = document.getElementById('indent-action-type')?.value;
    if (!indentNo) return showToast('Enter indent no');
    try {
      const res = await api('/api/indents/action', {
        method: 'POST',
        body: JSON.stringify({ indent_no: indentNo, current_role: role, action })
      });
      showToast(`Updated: ${res.status}`);
      await loadData();
    } catch (error) {
      showToast('Indent action failed');
    }
  });
}

renderMenu(roleSelect.value);
setActiveSection("home", "Home Dashboard");
generateWorkcode();
generateCbrNo();
updateCbrCalculations();
loadData();
