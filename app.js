const DEFAULT_AVATAR = "assets/avatar-default.svg";
const SETTINGS_KEY = "bookkeeping-settings";

function enableAutoRefresh() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("autoRefresh") !== "1") return;

  const interval = Number(params.get("interval")) || 2000;
  setInterval(() => {
    window.location.reload();
  }, interval);
}

function parseSimpleMdList(text) {
  const map = {};
  text.split("\n").forEach((line) => {
    const m = line.match(/^[-*]\s*([^:]+):\s*(.*)$/);
    if (m) map[m[1].trim()] = m[2].trim();
  });
  return map;
}

async function loadSettings() {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const text = await fetch("data/settings.md").then((r) => r.text());
  const parsed = parseSimpleMdList(text);
  return {
    name: parsed.name || "未命名用户",
    avatar: parsed.avatar || DEFAULT_AVATAR,
  };
}

function toBoolean(v) {
  return ["true", "yes", "1", "y"].includes(String(v).toLowerCase());
}

function parseItems(lines) {
  return lines
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .map((row) => {
      const [name = "", spec = "", quantity = ""] = row.split("|").map((s) => s.trim());
      return { name, spec, quantity };
    });
}

function parseRecordBlock(block) {
  const lines = block.split("\n");
  const titleLine = lines.shift() || "";
  const id = titleLine.replace(/^##\s*/, "").trim();
  const metaLines = [];
  const itemLines = [];
  let inItems = false;

  lines.forEach((line) => {
    if (/^###\s*items/i.test(line.trim())) {
      inItems = true;
      return;
    }
    if (inItems) {
      itemLines.push(line);
    } else {
      metaLines.push(line);
    }
  });

  const meta = parseSimpleMdList(metaLines.join("\n"));
  const receiptImage = meta.receiptImage || "receipt-image/receipt-placeholder.svg";

  return {
    id,
    date: meta.date || "",
    location: meta.location || "",
    amount: meta.amount || "0",
    note: meta.note || "",
    receiptImage,
    hasImage: toBoolean(meta.hasImage) || receiptImage !== "receipt-image/receipt-placeholder.svg",
    items: parseItems(itemLines),
  };
}

async function loadRecords() {
  const text = await fetch("data/records.md").then((r) => r.text());
  return text
    .split(/\n(?=##\s+)/g)
    .map((part) => part.trim())
    .filter((part) => part.startsWith("## "))
    .map(parseRecordBlock);
}

function renderUserCard(settings) {
  const el = document.getElementById("userCard");
  if (!el) return;
  el.innerHTML = `
    <img src="${settings.avatar || DEFAULT_AVATAR}" alt="头像" onerror="this.src='${DEFAULT_AVATAR}'" />
    <div>
      <div class="label">当前用户</div>
      <strong>${settings.name || "未命名用户"}</strong>
    </div>
  `;
}

function renderList(records) {
  const container = document.getElementById("recordsContainer");
  if (!container) return;

  if (!records.length) {
    container.innerHTML = "<p>暂无购物记录，请在 data/records.md 中添加。</p>";
    return;
  }

  const rows = records
    .map(
      (r) => `
      <a class="record-item" href="detail.html?id=${encodeURIComponent(r.id)}">
        <div>${r.date}</div>
        <div>${r.location}</div>
        <div>¥ ${r.amount}</div>
        <div>${r.note || "-"}</div>
        <div><span class="badge ${r.hasImage ? "" : "off"}">${r.hasImage ? "有" : "无"}</span></div>
      </a>
    `
    )
    .join("");

  container.innerHTML = `
    <div class="record-head">
      <div>时间</div>
      <div>地点</div>
      <div>金额</div>
      <div>备注</div>
      <div>图片</div>
    </div>
    ${rows}
  `;
}

function renderDetail(record) {
  const container = document.getElementById("detailContainer");
  if (!container) return;

  if (!record) {
    container.innerHTML = "<p>未找到该记录。</p>";
    return;
  }

  const itemRows = record.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.spec}</td>
        <td>${item.quantity}</td>
      </tr>
    `
    )
    .join("");

  container.innerHTML = `
    <h2>${record.location} - ${record.date}</h2>
    <p><strong>金额：</strong>¥ ${record.amount}</p>
    <p><strong>备注：</strong>${record.note || "-"}</p>
    <div class="detail-grid">
      <div>
        <h3>购物明细</h3>
        <table class="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>规格</th>
              <th>数量</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows || '<tr><td colspan="3">无明细</td></tr>'}
          </tbody>
        </table>
      </div>
      <div>
        <h3>小票图片</h3>
        <img class="receipt" src="${record.receiptImage}" alt="购物小票" onerror="this.src='receipt-image/receipt-placeholder.svg'" />
      </div>
    </div>
  `;
}

function toSettingsMd(settings) {
  return `# App Settings\n\n- name: ${settings.name || ""}\n- avatar: ${settings.avatar || DEFAULT_AVATAR}\n`;
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function setupSettingsPage(settings) {
  const form = document.getElementById("settingsForm");
  if (!form) return;

  const nameInput = document.getElementById("nameInput");
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");
  const exportBtn = document.getElementById("exportBtn");

  nameInput.value = settings.name || "";
  avatarInput.value = settings.avatar || "";
  avatarPreview.src = settings.avatar || DEFAULT_AVATAR;

  avatarInput.addEventListener("input", () => {
    avatarPreview.src = avatarInput.value || DEFAULT_AVATAR;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = {
      name: nameInput.value.trim(),
      avatar: avatarInput.value.trim() || DEFAULT_AVATAR,
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    alert("已保存到浏览器。\n如果要写回 .md 文件，请点击“导出 settings.md”。");
  });

  exportBtn.addEventListener("click", () => {
    const current = {
      name: nameInput.value.trim(),
      avatar: avatarInput.value.trim() || DEFAULT_AVATAR,
    };
    downloadFile("settings.md", toSettingsMd(current));
  });
}

async function init() {
  enableAutoRefresh();
  const page = document.body.dataset.page;
  const settings = await loadSettings();

  if (page === "list") {
    renderUserCard(settings);
    const records = await loadRecords();
    records.sort((a, b) => (a.date < b.date ? 1 : -1));
    renderList(records);
    return;
  }

  if (page === "detail") {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const records = await loadRecords();
    const target = records.find((x) => x.id === id);
    renderDetail(target);
    return;
  }

  if (page === "settings") {
    setupSettingsPage(settings);
  }
}

init().catch((err) => {
  console.error(err);
  alert("加载失败，请确认通过本地静态服务器访问，而不是 file:// 直接打开。");
});
