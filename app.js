const STORAGE_KEYS = {
  adminPassword: 'school_admin_password',
  assistants: 'school_assistants',
  representatives: 'school_representatives',
  students: 'school_students',
  parents: 'school_parents',
  profile: 'school_profile',
  session: 'school_current_session'
};

const defaultProfile = {
  name: 'مدرسه مدرن شاهد ابوذر',
  shortName: 'شهد ابوذر'
};

const defaultStudents = [
  {
    id: 1,
    name: 'آرین رضایی',
    username: 'student1',
    password: 'student123',
    base: 'پایه نهم',
    className: 'نهم-ب',
    average: 18.9,
    status: 'فعال'
  },
  {
    id: 2,
    name: 'سارا محمدی',
    username: 'student2',
    password: 'student456',
    base: 'پایه دهم',
    className: 'دهم-الف',
    average: 17.7,
    status: 'فعال'
  },
  {
    id: 3,
    name: 'امیر نوری',
    username: 'student3',
    password: 'student789',
    base: 'پایه هشتم',
    className: 'هشتم-ب',
    average: 16.8,
    status: 'فعال'
  },
  {
    id: 4,
    name: 'نیلوفر حسینی',
    username: 'student4',
    password: 'student101',
    base: 'پایه یازدهم',
    className: 'یازدهم-الف',
    average: 19.3,
    status: 'فعال'
  }
];

const defaultParents = [
  {
    id: 1,
    name: 'پدر آرین',
    username: 'parent1',
    password: 'parent123',
    student: 'آرین رضایی',
    base: 'پایه نهم'
  },
  {
    id: 2,
    name: 'مادر سارا',
    username: 'parent2',
    password: 'parent456',
    student: 'سارا محمدی',
    base: 'پایه دهم'
  }
];

const defaultAssistants = [
  {
    id: 1,
    name: 'سارا قاسمی',
    username: 'assistant1',
    password: 'pass123',
    base: 'پایه نهم',
    permissions: ['scores', 'homework', 'events']
  },
  {
    id: 2,
    name: 'مهدی یوسفی',
    username: 'assistant2',
    password: 'pass456',
    base: 'پایه دهم',
    permissions: ['students', 'attendance', 'reports']
  }
];

const defaultRepresentatives = [
  {
    id: 1,
    name: 'رضا کاظمی',
    username: 'rep1',
    password: 'rep123',
    role: 'نماینده تکالیف',
    base: 'پایه نهم',
    className: 'نهم-ب',
    student: 'آرین رضایی'
  },
  {
    id: 2,
    name: 'الهه شریفی',
    username: 'rep2',
    password: 'rep456',
    role: 'نماینده انضباط',
    base: 'پایه دهم',
    className: 'دهم-الف',
    student: 'سارا محمدی'
  }
];

const roleConfig = {
  admin: {
    label: 'مدیر',
    title: 'پنل مدیر',
    nav: ['داشبورد', 'دسترسی‌ها', 'نمایندگان', 'نمرات و کلاس‌ها', 'رویدادها']
  },
  assistant: {
    label: 'دستیار',
    title: 'پنل دستیار',
    nav: ['داشبورد', 'دانش‌آموزان', 'تکالیف', 'گزارش‌ها']
  },
  representative: {
    label: 'نماینده',
    title: 'پنل نماینده',
    nav: ['داشبورد', 'ثبت وظیفه', 'ثبت نمره', 'انضباط']
  },
  parent: {
    label: 'والدین',
    title: 'پنل والدین',
    nav: ['داشبورد', 'تکالیف', 'امتحان‌ها', 'نمرات']
  },
  student: {
    label: 'دانش‌آموز',
    title: 'پنل دانش‌آموز',
    nav: ['داشبورد', 'کارنامه', 'تکالیف', 'پیام‌ها']
  }
};

const app = {
  landingPage: document.getElementById('landingPage'),
  dashboard: document.getElementById('dashboardApp'),
  modal: document.getElementById('loginModal'),
  loginTitle: document.getElementById('loginTitle'),
  loginForm: document.getElementById('loginForm'),
  baseFieldWrapper: document.getElementById('baseFieldWrapper'),
  sidebarNav: document.getElementById('sidebarNav'),
  pageTitle: document.getElementById('pageTitle'),
  headerRoleLabel: document.getElementById('headerRoleLabel'),
  sidebarSchoolName: document.getElementById('sidebarSchoolName'),
  logoutBtn: document.getElementById('logoutBtn'),
  dashboardContent: document.getElementById('dashboardContent'),
  toastContainer: document.getElementById('toastContainer')
};

const state = {
  adminPassword: readStorage(STORAGE_KEYS.adminPassword, 'admin123'),
  assistants: readStorage(STORAGE_KEYS.assistants, defaultAssistants),
  representatives: readStorage(STORAGE_KEYS.representatives, defaultRepresentatives),
  students: readStorage(STORAGE_KEYS.students, defaultStudents),
  parents: readStorage(STORAGE_KEYS.parents, defaultParents),
  profile: readStorage(STORAGE_KEYS.profile, defaultProfile),
  session: readStorage(STORAGE_KEYS.session, null)
};

window.addEventListener('DOMContentLoaded', init);

function init() {
  ensureStorage();
  bindRoleButtons();
  bindModalClose();
  bindLoginForm();
  bindLogout();
  renderDashboard();
}

function ensureStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.adminPassword)) {
    writeStorage(STORAGE_KEYS.adminPassword, state.adminPassword);
  }
  if (!localStorage.getItem(STORAGE_KEYS.assistants)) {
    writeStorage(STORAGE_KEYS.assistants, state.assistants);
  }
  if (!localStorage.getItem(STORAGE_KEYS.representatives)) {
    writeStorage(STORAGE_KEYS.representatives, state.representatives);
  }
  if (!localStorage.getItem(STORAGE_KEYS.students)) {
    writeStorage(STORAGE_KEYS.students, state.students);
  }
  if (!localStorage.getItem(STORAGE_KEYS.parents)) {
    writeStorage(STORAGE_KEYS.parents, state.parents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.profile)) {
    writeStorage(STORAGE_KEYS.profile, state.profile);
  }
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bindRoleButtons() {
  document.querySelectorAll('[data-role-trigger]').forEach((button) => {
    button.addEventListener('click', () => openLoginModal(button.dataset.roleTrigger));
  });
}

function bindModalClose() {
  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeLoginModal);
  });
}

function bindLoginForm() {
  app.loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const role = app.loginForm.dataset.role;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const base = document.getElementById('baseField')?.value || '';

    if (!role || !username || !password) {
      alert('لطفاً نام کاربری و رمز عبور را وارد کنید.');
      return;
    }

    if (!validateLogin(role, username, password, base)) {
      alert('اطلاعات ورود معتبر نیست.');
      return;
    }

    const notices = {
      admin: 'در حال انتقال به پنل مدیریت ...',
      assistant: 'در حال انتقال به پنل دستیار ...',
      representative: 'در حال انتقال به پنل نماینده ...',
      parent: 'در حال انتقال به پنل والدین ...',
      student: 'در حال انتقال به پنل دانش‌آموز ...'
    };

    showToast(notices[role] || 'در حال ورود ...');

    state.session = {
      role,
      username,
      base,
      name: resolveDisplayName(role, username)
    };
    writeStorage(STORAGE_KEYS.session, state.session);
    closeLoginModal();
    renderDashboard();
  });
}

function bindLogout() {
  app.logoutBtn.addEventListener('click', () => {
    state.session = null;
    writeStorage(STORAGE_KEYS.session, null);
    renderDashboard();
  });
}

function validateLogin(role, username, password, base) {
  if (role === 'admin') {
    return username === 'admin' && password === state.adminPassword;
  }

  if (role === 'assistant') {
    const assistant = state.assistants.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(assistant) && (!base || assistant.base === base);
  }

  if (role === 'representative') {
    const rep = state.representatives.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(rep) && (!base || rep.base === base);
  }

  if (role === 'parent') {
    const parent = state.parents.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(parent) && (!base || parent.base === base);
  }

  if (role === 'student') {
    const student = state.students.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(student) && (!base || student.base === base);
  }

  return false;
}

function resolveDisplayName(role, username) {
  if (role === 'admin') return 'مدیر سیستم';
  if (role === 'assistant') {
    const found = state.assistants.find((item) => item.username === username);
    return found ? found.name : username;
  }
  if (role === 'representative') {
    const found = state.representatives.find((item) => item.username === username);
    return found ? found.name : username;
  }
  if (role === 'parent') {
    const found = state.parents.find((item) => item.username === username);
    return found ? found.name : username;
  }
  if (role === 'student') {
    const found = state.students.find((item) => item.username === username);
    return found ? found.name : username;
  }
  return username;
}

function openLoginModal(role) {
  app.loginForm.dataset.role = role;
  app.loginTitle.textContent = roleConfig[role].title;
  const needsBase = ['assistant', 'representative', 'parent', 'student'].includes(role);
  app.baseFieldWrapper.classList.toggle('hidden', !needsBase);
  app.modal.classList.remove('hidden');
  app.modal.setAttribute('aria-hidden', 'false');
}

function closeLoginModal() {
  app.modal.classList.add('hidden');
  app.modal.setAttribute('aria-hidden', 'true');
  app.loginForm.reset();
  app.loginForm.removeAttribute('data-role');
}

function renderDashboard() {
  const session = readStorage(STORAGE_KEYS.session, null) || state.session;

  if (!session) {
    app.dashboard.classList.add('hidden');
    app.landingPage.style.display = 'block';
    return;
  }

  app.landingPage.style.display = 'none';
  app.dashboard.classList.remove('hidden');

  app.sidebarSchoolName.textContent = state.profile.shortName;
  app.headerRoleLabel.textContent = roleConfig[session.role].label;
  app.pageTitle.textContent = roleConfig[session.role].title;

  const navItems = roleConfig[session.role].nav;
  app.sidebarNav.innerHTML = navItems
    .map((item, idx) => `
      <button type="button" class="nav-item ${idx === 0 ? 'active' : ''}" data-nav-item="${escapeHtml(item)}">
        ${item}
      </button>
    `)
    .join('');

  const activeItem = app.sidebarNav.querySelector('.nav-item.active')?.dataset.navItem || 'داشبورد';
  const sectionView = activeItem === 'داشبورد' ? 'overview' : activeItem;
  app.dashboardContent.innerHTML = buildDashboardContent(session.role, sectionView);

  bindSidebarClicks();
  bindDynamicActions();
}

function bindSidebarClicks() {
  app.sidebarNav.querySelectorAll('[data-nav-item]').forEach((button) => {
    button.addEventListener('click', () => {
      app.sidebarNav.querySelectorAll('[data-nav-item]').forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      renderDashboard();
    });
  });
}

function buildDashboardContent(role, section) {
  if (role === 'admin') {
    if (section === 'دسترسی‌ها') return adminAccessPanel();
    if (section === 'نمایندگان') return adminRepresentativesPanel();
    if (section === 'نمرات و کلاس‌ها') return adminGradesPanel();
    if (section === 'رویدادها') return adminEventsPanel();
    return adminOverviewPanel();
  }

  if (role === 'assistant') {
    if (section === 'دانش‌آموزان') return assistantStudentsPanel();
    if (section === 'تکالیف') return assistantTasksPanel();
    if (section === 'گزارش‌ها') return assistantReportsPanel();
    return assistantOverviewPanel();
  }

  if (role === 'representative') {
    if (section === 'ثبت وظیفه') return representativeHomeworkPanel();
    if (section === 'ثبت نمره') return representativeScorePanel();
    if (section === 'انضباط') return representativeDisciplinePanel();
    return representativeOverviewPanel();
  }

  if (role === 'parent') {
    if (section === 'تکالیف') return parentHomeworksPanel();
    if (section === 'امتحان‌ها') return parentExamsPanel();
    if (section === 'نمرات') return parentGradesPanel();
    return parentOverviewPanel();
  }

  if (role === 'student') {
    if (section === 'کارنامه') return studentGradesPanel();
    if (section === 'تکالیف') return studentHomeworkPanel();
    if (section === 'پیام‌ها') return studentMessagesPanel();
    return studentOverviewPanel();
  }

  return '<div class="panel-card"><h3>در حال آماده‌سازی...</h3></div>';
}

function adminOverviewPanel() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">دانش‌آموزان</span><strong>${state.students.length}</strong></div>
        <div class="summary-card"><span class="label">دستیاران</span><strong>${state.assistants.length}</strong></div>
        <div class="summary-card"><span class="label">نمایندگان</span><strong>${state.representatives.length}</strong></div>
        <div class="summary-card"><span class="label">کمپین‌ها</span><strong>۱۲</strong></div>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>خلاصه عملکرد</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>نمرات و پیشرفت</h4><p>میانگین کلاس‌ها در وضعیت مطلوب و در حال رشد است.</p></div>
          <div class="service-mini-card"><h4>تکالیف</h4><p>۷۹٪ تکالیف تا زمان مقرر ثبت شده‌اند.</p></div>
          <div class="service-mini-card"><h4>رویدادها</h4><p>برنامه‌های مدرسه هماهنگ شده و برای والدین اعلان ارسال شده است.</p></div>
        </div>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>لیست دانش‌آموزان</h3></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>نام</th><th>پایه</th><th>کلاس</th><th>میانگین</th><th>وضعیت</th></tr>
            </thead>
            <tbody>
              ${state.students.map((student) => `
                <tr>
                  <td>${student.name}</td>
                  <td>${student.base}</td>
                  <td>${student.className}</td>
                  <td>${student.average}</td>
                  <td><span class="chip good">${student.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function adminAccessPanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>رمز عبور مدیر</h3></div>
        <form id="adminPasswordForm">
          <div class="form-grid">
            <label>
              <span>رمز عبور</span>
              <input id="adminPasswordInput" type="password" value="${escapeHtml(state.adminPassword)}" />
            </label>
            <label>
              <span>وضعیت</span>
              <input type="text" value="برای همیشه حفظ می‌شود" readonly />
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">ثبت رمز عبور</button>
          </div>
        </form>
      </div>

      <div class="form-card">
        <div class="section-title"><h3>افزودن دستیار</h3></div>
        <form id="assistantForm">
          <div class="form-grid">
            <label><span>نام کامل</span><input name="name" type="text" placeholder="نام کامل" /></label>
            <label><span>نام کاربری</span><input name="username" type="text" placeholder="نام کاربری" /></label>
            <label><span>رمز عبور</span><input name="password" type="password" placeholder="رمز عبور" /></label>
            <label><span>پایه</span>
              <select name="base">
                <option value="">انتخاب پایه</option>
                <option>پایه هفتم</option>
                <option>پایه هشتم</option>
                <option>پایه نهم</option>
                <option>پایه دهم</option>
                <option>پایه یازدهم</option>
                <option>پایه دوازدهم</option>
              </select>
            </label>
          </div>

          <div class="permission-list">
            <label class="permission-item"><input type="checkbox" name="permission" value="scores" checked /> نمرات</label>
            <label class="permission-item"><input type="checkbox" name="permission" value="homework" checked /> تکالیف</label>
            <label class="permission-item"><input type="checkbox" name="permission" value="exams" /> امتحانات</label>
            <label class="permission-item"><input type="checkbox" name="permission" value="discipline" /> انضباط</label>
            <label class="permission-item"><input type="checkbox" name="permission" value="attendance" /> حضور و غیاب</label>
            <label class="permission-item"><input type="checkbox" name="permission" value="reports" /> گزارش‌ها</label>
          </div>

          <div class="form-actions">
            <button type="submit" class="primary-button">افزودن دستیار</button>
          </div>
        </form>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>لیست دستیاران</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>نام کاربری</th><th>پایه</th><th>دسترسی‌ها</th></tr></thead>
            <tbody>
              ${state.assistants.map((assistant) => `
                <tr>
                  <td>${assistant.name}</td>
                  <td>${assistant.username}</td>
                  <td>${assistant.base}</td>
                  <td>${(assistant.permissions || []).join('، ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function adminRepresentativesPanel() {
  const teacherTemplate = `
<div class="rep-demo">
  <form class="rep-form">
    <label>نام دانش‌آموز
      <input type="text" placeholder="نام دانش‌آموز" />
    </label>
    <label>نوع ثبت
      <select>
        <option>تکلیف</option>
        <option>امتحان</option>
        <option>انضباط</option>
      </select>
    </label>
    <label>دلیل
      <textarea placeholder="دلیل ثبت"></textarea>
    </label>
    <button type="submit">ثبت</button>
  </form>
</div>`;

  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>افزودن نماینده</h3></div>
        <form id="representativeForm">
          <div class="form-grid">
            <label><span>نام نماینده</span><input name="name" type="text" placeholder="نام نماینده" /></label>
            <label><span>نام کاربری</span><input name="username" type="text" placeholder="نام کاربری" /></label>
            <label><span>رمز عبور</span><input name="password" type="password" placeholder="رمز عبور" /></label>
            <label><span>نقش</span>
              <select name="role">
                <option>نماینده تکالیف</option>
                <option>نماینده امتحانات</option>
                <option>نماینده انضباط</option>
                <option>نماینده صف</option>
                <option>نماینده آب‌وخورد</option>
              </select>
            </label>
            <label><span>پایه</span>
              <select name="base">
                <option>پایه هفتم</option>
                <option>پایه هشتم</option>
                <option>پایه نهم</option>
                <option>پایه دهم</option>
                <option>پایه یازدهم</option>
                <option>پایه دوازدهم</option>
              </select>
            </label>
            <label>
              <span>دانش‌آموز</span>
              <input list="studentList" name="student" placeholder="نام دانش‌آموز" />
              <datalist id="studentList">
                ${state.students.map((student) => `<option value="${student.name}"></option>`).join('')}
              </datalist>
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">افزودن نماینده</button>
          </div>
        </form>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>لیست نمایندگان</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>نقش</th><th>پایه</th><th>دانش‌آموز</th><th>نام کاربری</th></tr></thead>
            <tbody>
              ${state.representatives.map((rep) => `
                <tr>
                  <td>${rep.name}</td>
                  <td>${rep.role}</td>
                  <td>${rep.base}</td>
                  <td>${rep.student}</td>
                  <td>${rep.username}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>کد HTML نمونه برای نماینده</h3></div>
        <div class="code-box"><pre>${escapeHtml(teacherTemplate)}</pre></div>
      </div>
    </div>
  `;
}

function adminGradesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>نمرات و کلاس‌ها</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>پایه</th><th>کلاس</th><th>نمره</th><th>وضعیت</th></tr></thead>
            <tbody>
              ${state.students.map((student) => `
                <tr>
                  <td>${student.name}</td>
                  <td>${student.base}</td>
                  <td>${student.className}</td>
                  <td>${student.average}</td>
                  <td><span class="chip ${student.average >= 17 ? 'good' : 'warn'}">${student.average >= 17 ? 'خوب' : 'نیازمند پیگیری'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function adminEventsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>رویدادها و کمپین‌ها</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>کمپین سلامت</h4><p>بررسی بهداشت و تغذیه در هفته جاری انجام می‌شود.</p></div>
          <div class="service-mini-card"><h4>ورزش و نشاط</h4><p>برنامه مسابقات ورزشی و گروهی برای پایه‌ها آماده است.</p></div>
          <div class="service-mini-card"><h4>جلسه اولیا</h4><p>جلسه هماهنگی و بررسی پیشرفت در هفته آینده برگذار می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function assistantOverviewPanel() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">دانش‌آموزان</span><strong>${state.students.length}</strong></div>
        <div class="summary-card"><span class="label">تکالیف امروز</span><strong>۲۶</strong></div>
        <div class="summary-card"><span class="label">گزارش‌ها</span><strong>۶</strong></div>
        <div class="summary-card"><span class="label">امتحانات</span><strong>۹</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>خلاصه دستیار</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>نمرات</h4><p>ثبت نمرات و بازبینی‌ها به‌صورت روزانه انجام می‌شود.</p></div>
          <div class="service-mini-card"><h4>تکالیف</h4><p>پیگیری تحویل تکالیف و ثبت وضعیت هر دانش‌آموز.</p></div>
          <div class="service-mini-card"><h4>گزارش</h4><p>گزارش‌های کوتاه و دقیق جهت مدیر و معاون ارسال می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function assistantStudentsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>لیست دانش‌آموزان</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>پایه</th><th>کلاس</th><th>میانگین</th><th>وضعیت</th></tr></thead>
            <tbody>
              ${state.students.map((student) => `
                <tr>
                  <td>${student.name}</td>
                  <td>${student.base}</td>
                  <td>${student.className}</td>
                  <td>${student.average}</td>
                  <td><span class="chip good">${student.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function assistantTasksPanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>ثبت تکلیف</h3></div>
        <form>
          <div class="form-grid">
            <label><span>عنوان</span><input type="text" value="تمرین فصل سوم" /></label>
            <label><span>دانش‌آموز</span><input type="text" value="آرین رضایی" /></label>
            <label style="grid-column: 1 / -1;"><span>توضیح</span><textarea>دانش‌آموز باید خلاصه درس و تمرین خانه را تا پایان هفته ارسال کند.</textarea></label>
          </div>
          <div class="form-actions"><button type="button" class="primary-button">ثبت</button></div>
        </form>
      </div>
    </div>
  `;
}

function assistantReportsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>گزارش‌های دستیار</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>حضور و غیاب</h4><p>نرخ غیبت هفته جاری: ۶.۸٪</p></div>
          <div class="service-mini-card"><h4>تکالیف</h4><p>تکالیف ارسال‌شده: ۲۹ مورد</p></div>
          <div class="service-mini-card"><h4>نمرات</h4><p>میانگین نمرات: ۱۸.۱</p></div>
        </div>
      </div>
    </div>
  `;
}

function representativeOverviewPanel() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">کلاس</span><strong>نهم-ب</strong></div>
        <div class="summary-card"><span class="label">تکالیف</span><strong>۱۲</strong></div>
        <div class="summary-card"><span class="label">ثبت نمره</span><strong>۸</strong></div>
        <div class="summary-card"><span class="label">انضباط</span><strong>۱۹</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>نماینده کلاس</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>ثبت تکلیف</h4><p>کاربر می‌تواند وظایف و تکالیف هر دانش‌آموز را ثبت کند.</p></div>
          <div class="service-mini-card"><h4>ثبت نمره</h4><p>ثبت نمره برای امتحان‌ها و ارزیابی‌ها با دلیل.</p></div>
          <div class="service-mini-card"><h4>انضباط</h4><p>ثبت امتیاز مثبت یا منفی با ذکر دلیل برای رفتارهای کلاسی.</p></div>
        </div>
      </div>
    </div>
  `;
}

function representativeHomeworkPanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>ثبت وظیفه برای دانش‌آموز</h3></div>
        <form>
          <div class="form-grid">
            <label><span>نام دانش‌آموز</span><input type="text" value="آرین رضایی" /></label>
            <label><span>عنوان وظیفه</span><input type="text" value="تکلیف علوم" /></label>
            <label style="grid-column: 1 / -1;"><span>توضیح</span><textarea>دانش‌آموز باید پاسخ تمرین‌ها را به صورت کامل و در زمان مقرر ارسال کند.</textarea></label>
          </div>
          <div class="form-actions"><button type="button" class="primary-button">ثبت وظیفه</button></div>
        </form>
      </div>
    </div>
  `;
}

function representativeScorePanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>ثبت نمره</h3></div>
        <form>
          <div class="form-grid">
            <label><span>نام دانش‌آموز</span><input type="text" value="سارا محمدی" /></label>
            <label><span>نمره</span><input type="number" value="18" /></label>
            <label style="grid-column: 1 / -1;"><span>دلیل</span><textarea>به‌خاطر عملکرد مناسب و پاسخ‌گویی دقیق در آزمون.</textarea></label>
          </div>
          <div class="form-actions"><button type="button" class="primary-button">ثبت نمره</button></div>
        </form>
      </div>
    </div>
  `;
}

function representativeDisciplinePanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>ثبت انضباط</h3></div>
        <form>
          <div class="form-grid">
            <label><span>نام دانش‌آموز</span><input type="text" value="امیر نوری" /></label>
            <label><span>نوع ثبت</span>
              <select>
                <option>ثبت امتیاز مثبت</option>
                <option>ثبت امتیاز منفی</option>
              </select>
            </label>
            <label style="grid-column: 1 / -1;"><span>دلیل</span><textarea>حضور فعال در درس و رعایت نظم کلاس.</textarea></label>
          </div>
          <div class="form-actions"><button type="button" class="primary-button">ثبت انضباط</button></div>
        </form>
      </div>
    </div>
  `;
}

function parentOverviewPanel() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">تکالیف</span><strong>۳</strong></div>
        <div class="summary-card"><span class="label">میانگین</span><strong>۱۸.۱</strong></div>
        <div class="summary-card"><span class="label">امتحان‌ها</span><strong>۲</strong></div>
        <div class="summary-card"><span class="label">پیام‌ها</span><strong>۴</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>خلاصه وضعیت فرزند</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>نمرات</h4><p>روند نمرات در مسیر افزایش است و وضعیت مناسبی دارد.</p></div>
          <div class="service-mini-card"><h4>تکالیف</h4><p>تکالیف به‌صورت منظم انجام شده‌اند.</p></div>
          <div class="service-mini-card"><h4>رویدادها</h4><p>جلسه اولیا و مربیان در هفته آینده برگزار می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function parentHomeworksPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>تکالیف فرزند</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>عنوان</th><th>پایه</th><th>تاریخ</th><th>وضعیت</th></tr></thead>
            <tbody>
              <tr><td>تکلیف علوم</td><td>پایه نهم</td><td>۱۴۰۳/۰۱/۲۶</td><td><span class="chip good">تکمیل‌شده</span></td></tr>
              <tr><td>تکلیف ادبیات</td><td>پایه نهم</td><td>۱۴۰۳/۰۱/۲۸</td><td><span class="chip warn">در انتظار بررسی</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function parentExamsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>امتحان‌ها</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>درس</th><th>تاریخ</th><th>سطح</th><th>وضعیت</th></tr></thead>
            <tbody>
              <tr><td>ریاضی</td><td>۱۴۰۳/۰۱/۲۴</td><td>کمی</td><td><span class="chip good">ثبت شده</span></td></tr>
              <tr><td>زیست</td><td>۱۴۰۳/۰۱/۲۹</td><td>پیشرفته</td><td><span class="chip warn">در حال برنامه‌ریزی</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function parentGradesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>نمرات فرزند</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>درس</th><th>نمره</th><th>میانگین</th><th>توضیح</th></tr></thead>
            <tbody>
              <tr><td>ریاضی</td><td>۱۹</td><td>۱۸.۴</td><td>بسیار خوب</td></tr>
              <tr><td>علوم</td><td>۱۸</td><td>۱۷.۸</td><td>پیشرفت مناسب</td></tr>
              <tr><td>ادبیات</td><td>۱۷</td><td>۱۷.۱</td><td>قابل‌قبول</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function studentOverviewPanel() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">میانگین کلی</span><strong>۱۸.۴</strong></div>
        <div class="summary-card"><span class="label">تکالیف</span><strong>۴</strong></div>
        <div class="summary-card"><span class="label">پیام‌ها</span><strong>۲</strong></div>
        <div class="summary-card"><span class="label">نمره روز</span><strong>۱۹</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>کارنامه کلی</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>ریاضی</h4><p>۱۹ از ۲۰</p></div>
          <div class="service-mini-card"><h4>علوم</h4><p>۱۸ از ۲۰</p></div>
          <div class="service-mini-card"><h4>ادبیات</h4><p>۱۷ از ۲۰</p></div>
        </div>
      </div>
    </div>
  `;
}

function studentGradesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>کارنامه من</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>درس</th><th>نمره</th><th>وضعیت</th><th>توضیح</th></tr></thead>
            <tbody>
              <tr><td>ریاضی</td><td>۱۹</td><td><span class="chip good">عالی</span></td><td>عملکرد بسیار خوب</td></tr>
              <tr><td>علوم</td><td>۱۸</td><td><span class="chip good">خوب</span></td><td>پیشرفت مناسب</td></tr>
              <tr><td>ادبیات</td><td>۱۷</td><td><span class="chip warn">قابل‌قبول</span></td><td>نیاز به تمرین</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function studentHomeworkPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>تکالیف من</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>عنوان</th><th>تاریخ</th><th>وضعیت</th></tr></thead>
            <tbody>
              <tr><td>تمرین صفحه ۵۱</td><td>۱۴۰۳/۰۱/۲۲</td><td><span class="chip good">ارسال‌شده</span></td></tr>
              <tr><td>تحقیق علوم</td><td>۱۴۰۳/۰۱/۲۵</td><td><span class="chip warn">در حال انجام</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function studentMessagesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>پیام‌های مدرسه</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>پیام مدیر</h4><p>جلسه تحلیل پیشرفت تحصیلی در روز سه‌شنبه برگزار می‌شود.</p></div>
          <div class="service-mini-card"><h4>پیام کلاس</h4><p>تکلیف آزمایشگاه تا پایان هفته ارسال شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function bindDynamicActions() {
  const adminPasswordForm = document.getElementById('adminPasswordForm');
  if (adminPasswordForm) {
    adminPasswordForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = document.getElementById('adminPasswordInput').value.trim();
      if (!value) {
        alert('رمز عبور نمی‌تواند خالی باشد.');
        return;
      }
      state.adminPassword = value;
      writeStorage(STORAGE_KEYS.adminPassword, value);
      showToast('رمز عبور مدیر ثبت شد و برای همیشه حفظ می‌شود.');
      renderDashboard();
    });
  }

  const assistantForm = document.getElementById('assistantForm');
  if (assistantForm) {
    assistantForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(assistantForm);
      const permissions = [...(formData.getAll('permission') || [])].map(String);
      const newAssistant = {
        id: Date.now(),
        name: String(formData.get('name') || '').trim(),
        username: String(formData.get('username') || '').trim(),
        password: String(formData.get('password') || '').trim(),
        base: String(formData.get('base') || '').trim(),
        permissions: permissions.length ? permissions : ['scores', 'homework']
      };

      if (!newAssistant.name || !newAssistant.username || !newAssistant.password || !newAssistant.base) {
        alert('لطفاً همه فیلدهای دستیار را کامل کنید.');
        return;
      }

      state.assistants.push(newAssistant);
      writeStorage(STORAGE_KEYS.assistants, state.assistants);
      assistantForm.reset();
      renderDashboard();
      showToast('دستیار با موفقیت اضافه شد.');
    });
  }

  const representativeForm = document.getElementById('representativeForm');
  if (representativeForm) {
    representativeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(representativeForm);
      const newRepresentative = {
        id: Date.now(),
        name: String(formData.get('name') || '').trim(),
        username: String(formData.get('username') || '').trim(),
        password: String(formData.get('password') || '').trim(),
        role: String(formData.get('role') || '').trim(),
        base: String(formData.get('base') || '').trim(),
        student: String(formData.get('student') || '').trim()
      };

      if (!newRepresentative.name || !newRepresentative.username || !newRepresentative.password || !newRepresentative.student) {
        alert('لطفاً اطلاعات نماینده را کامل وارد کنید.');
        return;
      }

      state.representatives.push(newRepresentative);
      writeStorage(STORAGE_KEYS.representatives, state.representatives);
      representativeForm.reset();
      renderDashboard();
      showToast('نماینده با موفقیت اضافه شد.');
    });
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  app.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.addEventListener('beforeunload', () => {
  writeStorage(STORAGE_KEYS.session, state.session);
});
