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

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
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
      if (index === 0) {
        setActiveButton(button);
      }
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

roleSelect.addEventListener("change", (event) => {
  renderMenu(event.target.value);
  setActiveSection("home", "Home Dashboard");
});

const workcodeForm = document.getElementById("workcode-form");
workcodeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast(`New workcode has been created. ${workcodeNo.value}`);
  generateWorkcode();
});

const cbrForm = document.getElementById("cbr-form");
cbrForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast(`New CBR No has been created. ${cbrNo.value}`);
  generateCbrNo();
});

const indentForm = document.getElementById("indent-form");
indentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Indents generated successfully.");
});

renderMenu(roleSelect.value);
setActiveSection("home", "Home Dashboard");
generateWorkcode();
generateCbrNo();
