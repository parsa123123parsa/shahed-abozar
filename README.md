const STORAGE_KEYS = {
  adminPassword: 'school_admin_password',
  session: 'school_current_session',
  assistants: 'school_assistants',
  representatives: 'school_representatives',
  students: 'school_students',
  parents: 'school_parents',
  schoolProfile: 'school_profile'
};

const DEFAULT_ADMIN_PASSWORD = 'admin123';

const defaultSchoolProfile = {
  name: 'سامانه مدرسه مدرن شاهد ابوذر',
  shortName: 'شهد ابوذر',
  motto: 'آموزش مؤثر و مدیریت شفاف'
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
  { id: 1, name: 'پدر آرین', username: 'parent1', password: 'parent123', student: 'آرین رضایی', base: 'پایه نهم' },
  { id: 2, name: 'مادر سارا', username: 'parent2', password: 'parent456', student: 'سارا محمدی', base: 'پایه دهم' }
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
  deputy: {
    label: 'معاون',
    title: 'پنل معاونت',
    nav: ['داشبورد', 'کلاس‌ها', 'تکالیف', 'گزارش‌ها']
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

const state = {
  adminPassword: readStorage(STORAGE_KEYS.adminPassword, DEFAULT_ADMIN_PASSWORD),
  session: readStorage(STORAGE_KEYS.session, null),
  assistants: readStorage(STORAGE_KEYS.assistants, defaultAssistants),
  representatives: readStorage(STORAGE_KEYS.representatives, defaultRepresentatives),
  students: readStorage(STORAGE_KEYS.students, defaultStudents),
  parents: readStorage(STORAGE_KEYS.parents, defaultParents),
  schoolProfile: readStorage(STORAGE_KEYS.schoolProfile, defaultSchoolProfile)
};

const app = {
  landingPage: document.getElementById('landingPage'),
  dashboard: document.getElementById('dashboardApp'),
  modal: document.getElementById('loginModal'),
  loginTitle: document.getElementById('loginTitle'),
  loginForm: document.getElementById('loginForm'),
  loginBaseWrapper: document.getElementById('baseFieldWrapper'),
  dashboardContent: document.getElementById('dashboardContent'),
  sidebarNav: document.getElementById('sidebarNav'),
  pageTitle: document.getElementById('pageTitle'),
  headerRoleLabel: document.getElementById('headerRoleLabel'),
  sidebarSchoolName: document.getElementById('sidebarSchoolName'),
  logoutBtn: document.getElementById('logoutBtn'),
  toastContainer: document.getElementById('toastContainer')
};

init();

function init() {
  bindRoleButtons();
  bindModalClose();
  bindLoginForm();
  bindLogout();
  renderSidebar();
  renderDashboard();
  setupAdminForm();
  setupAssistantForm();
  setupRepresentativeForm();
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
    button.addEventListener('click', () => {
      const role = button.dataset.roleTrigger;
      openLoginModal(role);
    });
  });
}

function bindModalClose() {
  document.querySelectorAll('[data-close-modal]').forEach((element) => {
    element.addEventListener('click', closeLoginModal);
  });
}

function bindLoginForm() {
  app.loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const role = app.loginForm.dataset.role;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const base = document.getElementById('baseField')?.value || '';

    const isValid = validateLogin(role, username, password, base);
    if (!isValid) {
      alert('اطلاعات ورود نامعتبر است. لطفاً مجدداً تلاش کنید.');
      return;
    }

    const roleMessage = {
      admin: 'در حال انتقال به پنل مدیریت ...',
      deputy: 'در حال انتقال به پنل معاونت ...',
      parent: 'در حال انتقال به پنل والدین ...',
      student: 'در حال انتقال به پنل دانش‌آموز ...'
    }[role];

    showToast(roleMessage);
    state.session = { role, username, base, name: resolveUserName(role, username) };
    writeStorage(STORAGE_KEYS.session, state.session);
    closeLoginModal();
    renderSidebar();
    renderDashboard();
  });
}

function validateLogin(role, username, password, base) {
  if (!role || !username || !password) return false;

  if (role === 'admin') {
    return username === 'admin' && password === state.adminPassword;
  }

  if (role === 'deputy') {
    const assistant = state.assistants.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(assistant);
  }

  if (role === 'parent') {
    const parent = state.parents.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(parent) && (!base || base === parent.base);
  }

  if (role === 'student') {
    const student = state.students.find(
      (item) => item.username === username && item.password === password
    );
    return Boolean(student) && (!base || base === student.base);
  }

  return false;
}

function resolveUserName(role, username) {
  if (role === 'admin') return 'مدیر سیستم';
  if (role === 'deputy') {
    const item = state.assistants.find((entry) => entry.username === username);
    return item ? item.name : username;
  }
  if (role === 'parent') {
    const item = state.parents.find((entry) => entry.username === username);
    return item ? item.name : username;
  }
  if (role === 'student') {
    const item = state.students.find((entry) => entry.username === username);
    return item ? item.name : username;
  }
  return username;
}

function openLoginModal(role) {
  app.loginForm.dataset.role = role;
  app.loginTitle.textContent = roleConfig[role].title;
  const showBase = role === 'parent' || role === 'student' || role === 'deputy';
  app.loginBaseWrapper.classList.toggle('hidden', !showBase);
  app.modal.classList.remove('hidden');
  app.modal.setAttribute('aria-hidden', 'false');
  app.loginForm.reset();
}

function closeLoginModal() {
  app.modal.classList.add('hidden');
  app.modal.setAttribute('aria-hidden', 'true');
  app.loginForm.removeAttribute('data-role');
  app.loginForm.reset();
}

function bindLogout() {
  app.logoutBtn.addEventListener('click', () => {
    state.session = null;
    writeStorage(STORAGE_KEYS.session, null);
    app.dashboard.classList.add('hidden');
    app.landingPage.style.display = 'block';
  });
}

function renderSidebar() {
  const session = state.session;
  if (!session) return;

  app.sidebarSchoolName.textContent = state.schoolProfile.shortName;
  const navItems = roleConfig[session.role].nav;
  app.sidebarNav.innerHTML = navItems
    .map((item, index) => `
      <button type="button" class="nav-item ${index === 0 ? 'active' : ''}" data-nav-item="${escapeHTML(item)}">
        ${item}
      </button>
    `)
    .join('');

  app.sidebarNav.querySelectorAll('[data-nav-item]').forEach((button) => {
    button.addEventListener('click', () => {
      app.sidebarNav.querySelectorAll('[data-nav-item]').forEach((node) => node.classList.remove('active'));
      button.classList.add('active');
      renderDashboard();
    });
  });
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
  app.headerRoleLabel.textContent = roleConfig[session.role].label;
  app.pageTitle.textContent = roleConfig[session.role].title;

  const activeNav = app.sidebarNav?.querySelector('.nav-item.active')?.dataset.navItem || 'داشبورد';
  const view = activeNav === 'داشبورد' ? 'overview' : activeNav;
  app.dashboardContent.innerHTML = buildDashboardContent(session.role, view, session.base);

  bindDynamicForms();
}

function buildDashboardContent(role, view, base) {
  if (role === 'admin') {
    if (view === 'دسترسی‌ها') return buildAccessPanel();
    if (view === 'نمایندگان') return buildRepresentativePanel();
    if (view === 'نمرات و کلاس‌ها') return buildGradesPanel();
    if (view === 'رویدادها') return buildEventsPanel();
    return buildAdminOverview();
  }

  if (role === 'deputy') {
    if (view === 'کلاس‌ها') return buildDeputyClassesPanel();
    if (view === 'تکالیف') return buildDeputyHomeworkPanel();
    if (view === 'گزارش‌ها') return buildReportsPanel();
    return buildDeputyOverview();
  }

  if (role === 'parent') {
    if (view === 'تکالیف') return buildParentHomeworksPanel();
    if (view === 'امتحان‌ها') return buildParentExamsPanel();
    if (view === 'نمرات') return buildParentGradesPanel();
    return buildParentOverview();
  }

  if (view === 'کارنامه') return buildStudentGradesPanel();
  if (view === 'تکالیف') return buildStudentHomeworksPanel();
  if (view === 'پیام‌ها') return buildStudentMessagesPanel();
  return buildStudentOverview();
}

function buildAdminOverview() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">دانش‌آموزان</span><strong>${state.students.length}</strong></div>
        <div class="summary-card"><span class="label">نمایندگان</span><strong>${state.representatives.length}</strong></div>
        <div class="summary-card"><span class="label">دستیاران</span><strong>${state.assistants.length}</strong></div>
        <div class="summary-card"><span class="label">کمپین‌ها</span><strong>۱۲</strong></div>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>خلاصه عملکرد</h3></div>
        <div class="card-grid">
          <div class="service-mini-card">
            <h4>نمرات و میزان پیشرفت</h4>
            <p>میانگین کلی کلاس‌ها در وضعیت مناسب و در حال رشد است.</p>
          </div>
          <div class="service-mini-card">
            <h4>تکالیف</h4>
            <p>۷۹٪ تکالیف ثبت‌شده در زمان مقرر بارگذاری شده‌اند.</p>
          </div>
          <div class="service-mini-card">
            <h4>رویدادها</h4>
            <p>برنامه‌ها و کمپین‌های مدرسه به‌صورت هماهنگ اجرا می‌شوند.</p>
          </div>
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

function buildAccessPanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>رمز عبور مدیر</h3></div>
        <form id="adminPasswordForm">
          <div class="form-grid">
            <label>
              <span>رمز عبور مدیر</span>
              <input id="adminPasswordInput" type="password" value="${escapeHTML(state.adminPassword)}" readonly />
            </label>
            <label>
              <span>وضعیت</span>
              <input type="text" value="برای همیشه حفظ می‌شود" readonly />
            </label>
          </div>
          <div class="form-actions">
            <button type="button" class="primary-button" id="passwordSetupBtn">ثبت اولین رمز عبور</button>
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
          <div class="form-actions">
            <button type="submit" class="primary-button">افزودن دستیار</button>
          </div>
        </form>
      </div>

      <div class="panel-card">
        <div class="section-title"><h3>لیست دستیاران</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>نام کاربری</th><th>پایه</th><th>دسترسی</th></tr></thead>
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

function buildRepresentativePanel() {
  const studentOptions = state.students.map((student) => student.name).join('\n');
  const htmlTemplate = `
<div class="rep-card">
  <h3>ثبت وظیفه یا امتحان با نماینده</h3>
  <form>
    <label>نام دانش‌آموز
      <input type="text" name="student" placeholder="نام دانش‌آموز" required />
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
</div>
  `;

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
            <label><span>دانش‌آموز</span>
              <input list="studentList" name="student" placeholder="نام دانش‌آموز" />
              <datalist id="studentList">${state.students.map((student) => `<option value="${student.name}"></option>`).join('')}</datalist>
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
        <div class="code-box"><pre>${escapeHTML(htmlTemplate)}</pre></div>
      </div>
    </div>
  `;
}

function buildGradesPanel() {
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

function buildEventsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>رویدادها و کمپین‌ها</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>کمپین سلامت</h4><p>بررسی بهداشت و تغذیه برای دانش‌آموزان در هفته جاری اجرا می‌شود.</p></div>
          <div class="service-mini-card"><h4>رویداد ورزشی</h4><p>مسابقات آموزشی و ورزشی برای پایه‌های مختلف برنامه‌ریزی شده است.</p></div>
          <div class="service-mini-card"><h4>جلسه اولیا</h4><p>جلسه هماهنگی با والدین برای بررسی پیشرفت تحصیلی برگزار می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildDeputyOverview() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">کلاس‌ها</span><strong>۱۴</strong></div>
        <div class="summary-card"><span class="label">دانش‌آموزان</span><strong>۳۵۰</strong></div>
        <div class="summary-card"><span class="label">تکالیف</span><strong>۱۸۲</strong></div>
        <div class="summary-card"><span class="label">گزارش‌ها</span><strong>۶</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>فعالیت معاونت</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>پیگیری نمرات</h4><p>نمرات کلاس‌های تحت پوشش به‌صورت روزانه بررسی می‌شوند.</p></div>
          <div class="service-mini-card"><h4>نظارت بر تکالیف</h4><p>تکالیف و امتحانات به‌صورت منظم پیگیری می‌شوند.</p></div>
          <div class="service-mini-card"><h4>اطلاع‌رسانی</h4><p>پیام‌های مهم به والدین و دانش‌آموزان ارسال می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildDeputyClassesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>کلاس‌های تحت پوشش</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>کلاس</th><th>پایه</th><th>میانگین</th><th>وضعیت</th></tr></thead>
            <tbody>
              <tr><td>نهم-ب</td><td>پایه نهم</td><td>۱۸.۲</td><td><span class="chip good">خوب</span></td></tr>
              <tr><td>دهم-الف</td><td>پایه دهم</td><td>۱۷.۶</td><td><span class="chip warn">قابل‌پیگیری</span></td></tr>
              <tr><td>هشتم-ب</td><td>پایه هشتم</td><td>۱۶.۹</td><td><span class="chip warn">متوسط</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildDeputyHomeworkPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>ثبت تکالیف و بررسی‌ها</h3></div>
        <div class="form-card">
          <div class="form-grid">
            <label><span>عنوان تکلیف</span><input type="text" value="مطالعه فصل سوم" /></label>
            <label><span>پایه</span><select><option>پایه نهم</option><option>پایه دهم</option></select></label>
            <label style="grid-column: 1 / -1;"><span>توضیح</span><textarea>دانش‌آموزان خلاصه درس و تمرین‌های خانه را تا پایان هفته ارسال کنند.</textarea></label>
          </div>
          <div class="form-actions"><button class="primary-button">ثبت تغییرات</button></div>
        </div>
      </div>
    </div>
  `;
}

function buildReportsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>گزارش‌های آموزشی</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>حضور و غیاب</h4><p>میزان غیبت هفته جاری: ۶.۸٪</p></div>
          <div class="service-mini-card"><h4>میانگین پایه</h4><p>میانگین پایه دهم: ۱۷.۹</p></div>
          <div class="service-mini-card"><h4>تکالیف</h4><p>۷۹٪ تکالیف با موفقیت ارسال شده‌اند.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildParentOverview() {
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
          <div class="service-mini-card"><h4>کارنامه</h4><p>روند پیشرفت به‌صورت مداوم در حال بهبود است.</p></div>
          <div class="service-mini-card"><h4>تکالیف</h4><p>تکالیف در زمان مقرر انجام شده‌اند.</p></div>
          <div class="service-mini-card"><h4>رویدادها</h4><p>جلسه اولیا و مربیان در هفته آینده برگزار می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildParentHomeworksPanel() {
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

function buildParentExamsPanel() {
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

function buildParentGradesPanel() {
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

function buildStudentOverview() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">میانگین کلی</span><strong>۱۸.۴</strong></div>
        <div class="summary-card"><span class="label">تکالیف</span><strong>۴</strong></div>
        <div class="summary-card"><span class="label">پیام‌ها</span><strong>۲</strong></div>
        <div class="summary-card"><span class="label">نمره روز</span><strong>۱۹</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>کارنامه کوتاه</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>ریاضی</h4><p>۱۹ از ۲۰</p></div>
          <div class="service-mini-card"><h4>علوم</h4><p>۱۸ از ۲۰</p></div>
          <div class="service-mini-card"><h4>ادبیات</h4><p>۱۷ از ۲۰</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildStudentGradesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>کارنامه من</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>درس</th><th>نمره</th><th>وضعیت</th><th>توضیح</th></tr></thead>
            <tbody>
              <tr><td>ریاضی</td><td>۱۹</td><td><span class="chip good">عالی</span></td><td>عملکرد بسیار خوب</td></tr>
              <tr><td>علوم</td><td>۱۸</td><td><span class="chip good">خوب</span></td><td>پیشرفت مطلوب</td></tr>
              <tr><td>ادبیات</td><td>۱۷</td><td><span class="chip warn">قابل‌قبول</span></td><td>نیاز به تمرین</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function buildStudentHomeworksPanel() {
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

function buildStudentMessagesPanel() {
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

function bindDynamicForms() {
  const passwordSetupBtn = document.getElementById('passwordSetupBtn');
  if (passwordSetupBtn) {
    passwordSetupBtn.addEventListener('click', () => {
      const nextPassword = prompt('رمز عبور جدید مدیر را وارد کنید:');
      if (!nextPassword || !nextPassword.trim()) {
        alert('رمز عبور نمی‌تواند خالی باشد.');
        return;
      }
      state.adminPassword = nextPassword.trim();
      writeStorage(STORAGE_KEYS.adminPassword, state.adminPassword);
      showToast('رمز عبور مدیر ثبت و برای همیشه ذخیره شد.');
      renderDashboard();
    });
  }

  const assistantForm = document.getElementById('assistantForm');
  if (assistantForm) {
    assistantForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(assistantForm);
      const assistant = {
        id: Date.now(),
        name: String(formData.get('name') || '').trim(),
        username: String(formData.get('username') || '').trim(),
        password: String(formData.get('password') || '').trim(),
        base: String(formData.get('base') || '').trim(),
        permissions: ['scores', 'homework', 'events']
      };

      if (!assistant.name || !assistant.username || !assistant.password || !assistant.base) {
        alert('لطفاً اطلاعات دستیار را کامل وارد کنید.');
        return;
      }

      state.assistants.push(assistant);
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
      const representative = {
        id: Date.now(),
        name: String(formData.get('name') || '').trim(),
        username: String(formData.get('username') || '').trim(),
        password: String(formData.get('password') || '').trim(),
        role: String(formData.get('role') || '').trim(),
        base: String(formData.get('base') || '').trim(),
        student: String(formData.get('student') || '').trim()
      };

      if (!representative.name || !representative.username || !representative.password || !representative.student) {
        alert('لطفاً اطلاعات نماینده را کامل وارد کنید.');
        return;
      }

      state.representatives.push(representative);
      writeStorage(STORAGE_KEYS.representatives, state.representatives);
      representativeForm.reset();
      renderDashboard();
      showToast('نماینده با موفقیت ثبت شد.');
    });
  }
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  app.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2400);
}

window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem(STORAGE_KEYS.adminPassword)) {
    writeStorage(STORAGE_KEYS.adminPassword, DEFAULT_ADMIN_PASSWORD);
  }
  if (!localStorage.getItem(STORAGE_KEYS.assistants)) {
    writeStorage(STORAGE_KEYS.assistants, defaultAssistants);
  }
  if (!localStorage.getItem(STORAGE_KEYS.representatives)) {
    writeStorage(STORAGE_KEYS.representatives, defaultRepresentatives);
  }
  if (!localStorage.getItem(STORAGE_KEYS.students)) {
    writeStorage(STORAGE_KEYS.students, defaultStudents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.parents)) {
    writeStorage(STORAGE_KEYS.parents, defaultParents);
  }
  if (!localStorage.getItem(STORAGE_KEYS.schoolProfile)) {
    writeStorage(STORAGE_KEYS.schoolProfile, defaultSchoolProfile);
  }
});
