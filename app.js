const STORAGE_KEYS = {
  adminPassword: 'school_admin_password',
  admins: 'school_admins',
  assistants: 'school_assistants',
  representatives: 'school_representatives',
  students: 'school_students',
  parents: 'school_parents',
  schoolProfile: 'school_profile',
  session: 'school_current_session'
};

const defaultSchoolProfile = {
  name: 'مدرسه مدرن شاهد ابوذر',
  shortName: 'شهد ابوذر',
  motto: 'آموزش مؤثر و مدیریت شفاف',
  stats: {
    students: 1200,
    classes: 48,
    teachers: 21,
    events: 32
  }
};

const defaultStudents = [
  { id: 1, name: 'آرین رضایی', grade: 'پایه نهم', className: 'نهم-ب', average: 18.5, status: 'فعال' },
  { id: 2, name: 'سارا محمدی', grade: 'پایه دهم', className: 'دهم-الف', average: 17.9, status: 'فعال' },
  { id: 3, name: 'امیر نوری', grade: 'پایه هشتم', className: 'هشتم-ب', average: 16.8, status: 'فعال' },
  { id: 4, name: 'نیلوفر حسینی', grade: 'پایه یازدهم', className: 'یازدهم-الف', average: 19.2, status: 'فعال' }
];

const defaultAssistants = [
  { id: 1, name: 'سارا قاسمی', username: 'assistant1', password: 'pass123', permissions: ['scores', 'homework', 'events'], base: 'پایه نهم' },
  { id: 2, name: 'مهدی یوسفی', username: 'assistant2', password: 'pass456', permissions: ['students', 'attendance', 'reports'], base: 'پایه دهم' }
];

const defaultRepresentatives = [
  { id: 1, name: 'رضا کاظمی', username: 'rep1', password: 'rep123', role: 'نماینده تکالیف', className: 'نهم-ب', student: 'آرین رضایی' },
  { id: 2, name: 'الهه شریفی', username: 'rep2', password: 'rep456', role: 'نماینده انضباط', className: 'دهم-الف', student: 'سارا محمدی' }
];

const initialState = {
  schoolProfile: readStorage(STORAGE_KEYS.schoolProfile, defaultSchoolProfile),
  assistants: readStorage(STORAGE_KEYS.assistants, defaultAssistants),
  representatives: readStorage(STORAGE_KEYS.representatives, defaultRepresentatives),
  students: readStorage(STORAGE_KEYS.students, defaultStudents),
  adminPassword: readStorage(STORAGE_KEYS.adminPassword, ''),
  session: readStorage(STORAGE_KEYS.session, null)
};

const state = { ...initialState };

const app = {
  body: document.body,
  modal: document.getElementById('loginModal'),
  dashboard: document.getElementById('dashboardApp'),
  loginForm: document.getElementById('loginForm'),
  loginTitle: document.getElementById('loginTitle'),
  baseFieldWrapper: document.getElementById('baseFieldWrapper'),
  dashboardContent: document.getElementById('dashboardContent'),
  sidebarNav: document.getElementById('sidebarNav'),
  pageTitle: document.getElementById('pageTitle'),
  headerRoleLabel: document.getElementById('headerRoleLabel'),
  sidebarSchoolName: document.getElementById('sidebarSchoolName'),
  logoutBtn: document.getElementById('logoutBtn')
};

const roleConfig = {
  admin: {
    label: 'مدیر',
    title: 'پنل مدیر',
    nav: ['داشبورد', 'مدیران و دسترسی', 'نمایندگان', 'کلاس‌ها و نمرات', 'رویدادها'],
    needsBase: false
  },
  deputy: {
    label: 'معاون',
    title: 'پنل معاونت',
    nav: ['داشبورد', 'کلاس‌ها', 'امور آموزشی', 'گزارش‌ها'],
    needsBase: true
  },
  parent: {
    label: 'والدین',
    title: 'پنل والدین',
    nav: ['داشبورد', 'تکالیف', 'آزمون‌ها', 'گزارش نمرات'],
    needsBase: true
  },
  student: {
    label: 'دانش‌آموز',
    title: 'پنل دانش‌آموز',
    nav: ['داشبورد', 'کارنامه', 'تکالیف', 'پیام‌ها'],
    needsBase: true
  }
};

const defaultAdminUsername = 'admin';
const defaultAdminPassword = 'admin123';

bindRoleButtons();
bindModalClose();
bindLoginForm();
renderSidebar();
renderDashboard();
wireLogout();

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
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

    if (!role) return;

    const loginAllowed = verifyLogin(role, username, password, base);
    if (!loginAllowed) {
      alert('اطلاعات ورود نامعتبر است. لطفاً مجدداً تلاش کنید.');
      return;
    }

    const message = role === 'admin'
      ? 'در حال انتقال به پنل مدیریت ...'
      : role === 'deputy'
        ? 'در حال انتقال به پنل معاونت ...'
        : role === 'parent'
          ? 'در حال انتقال به پنل والدین ...'
          : 'در حال انتقال به پنل دانش‌آموز ...';

    alert(message);
    state.session = { role, username, base };
    writeStorage(STORAGE_KEYS.session, state.session);
    closeLoginModal();
    renderDashboard();
  });
}

function verifyLogin(role, username, password, base) {
  if (role === 'admin') {
    const hasExplicitPassword = Boolean(state.adminPassword);
    const existingPassword = hasExplicitPassword ? state.adminPassword : defaultAdminPassword;

    if (username === defaultAdminUsername && password === existingPassword) {
      if (!state.adminPassword) {
        state.adminPassword = existingPassword;
        writeStorage(STORAGE_KEYS.adminPassword, state.adminPassword);
      }
      return true;
    }

    return false;
  }

  if (role === 'parent') {
    const parent = state.parents?.find((item) => item.username === username && item.password === password);
    if (parent) {
      return true;
    }
  }

  if (role === 'student') {
    const student = state.students.find((item) => item.name === username || item.id === Number(username));
    if (student && password === 'student123') {
      return true;
    }
  }

  if (role === 'deputy') {
    const assistant = state.assistants.find((item) => item.username === username && item.password === password);
    if (assistant) {
      return true;
    }
  }

  return false;
}

function openLoginModal(role) {
  app.loginForm.dataset.role = role;
  app.loginTitle.textContent = roleConfig[role].title;
  const showBase = roleConfig[role].needsBase;
  app.baseFieldWrapper.classList.toggle('hidden', !showBase);
  app.modal.classList.remove('hidden');
  app.modal.setAttribute('aria-hidden', 'false');
}

function closeLoginModal() {
  app.modal.classList.add('hidden');
  app.modal.setAttribute('aria-hidden', 'true');
  app.loginForm.reset();
  app.loginForm.removeAttribute('data-role');
}

function wireLogout() {
  app.logoutBtn.addEventListener('click', () => {
    state.session = null;
    writeStorage(STORAGE_KEYS.session, null);
    app.dashboard.classList.add('hidden');
    document.querySelector('.site-shell').style.display = 'block';
  });
}

function renderSidebar() {
  app.sidebarSchoolName.textContent = state.schoolProfile.shortName;
  const session = state.session;
  if (!session) return;
  const role = session.role;
  const nav = roleConfig[role]?.nav ?? [];
  app.sidebarNav.innerHTML = nav
    .map((item, index) => {
      const className = index === 0 ? 'nav-item active' : 'nav-item';
      return `<button type="button" class="${className}" data-nav-item="${item}">${item}</button>`;
    })
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
  const session = readStorage(STORAGE_KEYS.session, null);
  if (!session) {
    app.dashboard.classList.add('hidden');
    document.querySelector('.site-shell').style.display = 'block';
    return;
  }

  document.querySelector('.site-shell').style.display = 'none';
  app.dashboard.classList.remove('hidden');
  app.headerRoleLabel.textContent = roleConfig[session.role].label;
  app.pageTitle.textContent = roleConfig[session.role].title;

  const activeNav = app.sidebarNav.querySelector('.nav-item.active')?.dataset.navItem || 'داشبورد';
  const view = activeNav === 'داشبورد' ? 'overview' : activeNav;
  app.dashboardContent.innerHTML = buildDashboardContent(session.role, view, session.base);
}

function buildDashboardContent(role, view, base) {
  if (role === 'admin') {
    if (view === 'مدیران و دسترسی') return buildAdminAccessPanel();
    if (view === 'نمایندگان') return buildRepresentativePanel();
    if (view === 'کلاس‌ها و نمرات') return buildGradesPanel();
    if (view === 'رویدادها') return buildEventsPanel();
    return buildAdminOverview();
  }

  if (role === 'deputy') {
    if (view === 'کلاس‌ها') return buildDeputyClassPanel();
    if (view === 'امور آموزشی') return buildTeachingPanel();
    if (view === 'گزارش‌ها') return buildReportsPanel();
    return buildDeputyOverview();
  }

  if (role === 'parent') {
    if (view === 'تکالیف') return buildParentAssignmentsPanel();
    if (view === 'آزمون‌ها') return buildParentExamPanel();
    if (view === 'گزارش نمرات') return buildParentGradesPanel();
    return buildParentOverview();
  }

  if (view === 'کارنامه') return buildStudentGradesPanel();
  if (view === 'تکالیف') return buildStudentAssignmentsPanel();
  if (view === 'پیام‌ها') return buildStudentMessagesPanel();
  return buildStudentOverview();
}

function buildAdminOverview() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">تعداد دانش‌آموزان</span><strong>${state.students.length}</strong></div>
        <div class="summary-card"><span class="label">نمایندگان</span><strong>${state.representatives.length}</strong></div>
        <div class="summary-card"><span class="label">دستیاران</span><strong>${state.assistants.length}</strong></div>
        <div class="summary-card"><span class="label">کمپین‌ها</span><strong>۱۲</strong></div>
      </div>

      <div class="panel-card">
        <div class="section-title">
          <h3>خلاصه عملکرد</h3>
        </div>
        <div class="card-grid">
          <div class="service-mini-card">
            <h4>نمرات</h4>
            <p>میانگین کلی کلاس‌ها در حال ارتقا است و سه کلاس در وضعیت ممتاز قرار دارند.</p>
          </div>
          <div class="service-mini-card">
            <h4>تکالیف</h4>
            <p>۷۹ درصد تکالیف ثبت شده در زمان مقرر ارائه شده‌اند.</p>
          </div>
          <div class="service-mini-card">
            <h4>رویدادها</h4>
            <p>برنامه‌های مدرسه هماهنگ شده‌اند و اعلان‌ها برای والدین ارسال شده است.</p>
          </div>
        </div>
      </div>

      <div class="panel-card">
        <div class="section-title">
          <h3>لیست دانش‌آموزان</h3>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>پایه</th><th>کلاس</th><th>میانگین</th><th>وضعیت</th></tr></thead>
            <tbody>
              ${state.students.map(student => `
                <tr>
                  <td>${student.name}</td>
                  <td>${student.grade}</td>
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

function buildAdminAccessPanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title">
          <h3>تنظیم رمز عبور مدیر</h3>
        </div>
        <form id="adminPasswordForm">
          <div class="form-grid">
            <label>
              <span>رمز عبور مدیر</span>
              <input id="adminPasswordInput" type="password" value="${state.adminPassword || defaultAdminPassword}" placeholder="رمز عبور" />
            </label>
            <label>
              <span>وضعیت</span>
              <input type="text" value="${state.adminPassword ? 'قفل شده و دائمی' : 'در حال تنظیم اولیه'}" readonly />
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">ثبت رمز عبور</button>
          </div>
        </form>
      </div>

      <div class="form-card">
        <div class="section-title">
          <h3>افزودن دستیار</h3>
        </div>
        <form id="assistantForm">
          <div class="form-grid">
            <label><span>نام کامل</span><input name="name" type="text" placeholder="نام کامل" /></label>
            <label><span>نام کاربری</span><input name="username" type="text" placeholder="نام کاربری" /></label>
            <label><span>رمز عبور</span><input name="password" type="password" placeholder="رمز عبور" /></label>
            <label><span>پایه</span><select name="base"><option value="">انتخاب پایه</option>..." /></select></label>
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">افزودن دستیار</button>
          </div>
        </form>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>نام</th><th>نام کاربری</th><th>پایه</th><th>دسترسی‌ها</th></tr></thead>
          <tbody>
            ${state.assistants.map((assistant) => `
              <tr>
                <td>${assistant.name}</td>
                <td>${assistant.username}</td>
                <td>${assistant.base}</td>
                <td>${(assistant.permissions || []).join('، ') || 'بدون دسترسی'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildRepresentativePanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title">
          <h3>افزودن نماینده</h3>
        </div>
        <form id="representativeForm">
          <div class="form-grid">
            <label><span>نام نماینده</span><input name="name" type="text" placeholder="نام نماینده" /></label>
            <label><span>نام کاربری</span><input name="username" type="text" placeholder="نام کاربری" /></label>
            <label><span>رمز عبور</span><input name="password" type="password" placeholder="رمز عبور" /></label>
            <label><span>نقش</span><select name="role"><option>نماینده تکالیف</option><option>نماینده امتحانات</option><option>نماینده انضباط</option><option>نماینده صف</option><option>نماینده آب‌وخورد</option></select></label>
            <label><span>کلاس</span><select name="className"><option value="نهم-ب">نهم-ب</option><option value="دهم-الف">دهم-الف</option><option value="هشتم-ب">هشتم-ب</option></select></label>
            <label><span>دانش‌آموز</span><input name="student" type="text" placeholder="نام دانش‌آموز" /></label>
          </div>
          <div class="form-actions">
            <button type="submit" class="primary-button">ثبت نماینده</button>
          </div>
        </form>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>نام</th><th>نقش</th><th>کلاس</th><th>دانش‌آموز</th><th>نام کاربری</th></tr></thead>
          <tbody>
            ${state.representatives.map((rep) => `
              <tr>
                <td>${rep.name}</td>
                <td>${rep.role}</td>
                <td>${rep.className}</td>
                <td>${rep.student}</td>
                <td>${rep.username}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildGradesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>نمرات پایه‌ها</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>نام</th><th>پایه</th><th>کلاس</th><th>نمره</th><th>وضعیت</th></tr></thead>
            <tbody>
              ${state.students.map((student) => `
                <tr>
                  <td>${student.name}</td>
                  <td>${student.grade}</td>
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
          <div class="service-mini-card"><h4>کمپین سلامت</h4><p>برنامه بررسی بهداشت و تغذیه در گام دوم این هفته اجرا می‌شود.</p></div>
          <div class="service-mini-card"><h4>مراسم ورزشی</h4><p>رویداد مسابقات کانونی برای پایه‌های هفتم تا دهم در ششمین روز برنامه‌ریزی شده است.</p></div>
          <div class="service-mini-card"><h4>جلسه والدین</h4><p>جلسه هماهنگی برنامه درسی و پیگیری رشد دانش‌آموزان برگزار می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildDeputyOverview() {
  return buildGeneralOverview('معاون');
}

function buildGeneralOverview(roleName) {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">کلاس‌های تحت پوشش</span><strong>۱۴</strong></div>
        <div class="summary-card"><span class="label">دانش‌آموزان مرتبط</span><strong>۳۵۰</strong></div>
        <div class="summary-card"><span class="label">تکالیف ثبت‌شده</span><strong>۱۸۲</strong></div>
        <div class="summary-card"><span class="label">گزارش‌های روزانه</span><strong>۶</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>فعالیت ${roleName}</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>پیگیری نمرات</h4><p>وضعیت نمرات در کلاس‌های مرتبط به‌صورت روزانه کنترل می‌شود.</p></div>
          <div class="service-mini-card"><h4>نظارت بر تکالیف</h4><p>ثبت تکالیف و انجام وظایف آموزشی به‌روزرسانی می‌شود.</p></div>
          <div class="service-mini-card"><h4>اطلاع‌رسانی</h4><p>پیام‌های مهم به والدین و دانش‌آموزان در زمان مناسب ارسال می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildDeputyClassPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>مدیریت کلاس‌ها</h3></div>
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

function buildTeachingPanel() {
  return `
    <div class="dashboard-grid">
      <div class="form-card">
        <div class="section-title"><h3>ثبت تکالیف و بررسی</h3></div>
        <div class="form-grid">
          <label><span>عنوان تکلیف</span><input type="text" value="مطالعه فصل سوم" /></label>
          <label><span>پایه</span><select><option>پایه نهم</option><option>پایه دهم</option></select></label>
          <label><span>توضیح</span><textarea>دانش‌آموزان باید خلاصه درس و پاسخ تمرین‌ها را تا پایان هفته ارسال کنند.</textarea></label>
        </div>
        <div class="form-actions"><button class="primary-button">ثبت تغییرات</button></div>
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
          <div class="service-mini-card"><h4>گزارش حضور و غیاب</h4><p>میزان غیبت هفته جاری: ۶.۸٪</p></div>
          <div class="service-mini-card"><h4>گزارش نمرات</h4><p>میانگین پایه دهم: ۱۷.۹</p></div>
          <div class="service-mini-card"><h4>گزارش تکالیف</h4><p>۷۹٪ تکالیف به‌عنوان کامل ثبت شده‌اند.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildParentOverview() {
  return `
    <div class="dashboard-grid">
      <div class="summary-row">
        <div class="summary-card"><span class="label">تکالیف پیگیری</span><strong>۳</strong></div>
        <div class="summary-card"><span class="label">میانگین نمره</span><strong>۱۸.۱</strong></div>
        <div class="summary-card"><span class="label">امتحانات</span><strong>۲</strong></div>
        <div class="summary-card"><span class="label">پیام‌ها</span><strong>۴</strong></div>
      </div>
      <div class="panel-card">
        <div class="section-title"><h3>خلاصه وضعيت فرزند</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>تکالیف</h4><p>همه تکالیف تا به‌حال ثبت و تکمیل شده‌اند.</p></div>
          <div class="service-mini-card"><h4>نمرات</h4><p>روند نمرات در مسیر افزایش است و وضعیت مناسبی دارد.</p></div>
          <div class="service-mini-card"><h4>رویدادها</h4><p>جلسه اولیا و مربیان در هفته آینده برگزار می‌شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildParentAssignmentsPanel() {
  return `
    <div class="dashboard-grid">
      <div class="table-wrap">
        <table>
          <thead><tr><th>عنوان</th><th>پایه</th><th>تاریخ تحویل</th><th>وضعیت</th></tr></thead>
          <tbody>
            <tr><td>تکلیف علوم</td><td>پایه نهم</td><td>۱۴۰۳/۰۱/۲۶</td><td><span class="chip good">تکمیل‌شده</span></td></tr>
            <tr><td>تکلیف ادبیات</td><td>پایه نهم</td><td>۱۴۰۳/۰۱/۲۸</td><td><span class="chip warn">در انتظار بررسی</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildParentExamPanel() {
  return `
    <div class="dashboard-grid">
      <div class="table-wrap">
        <table>
          <thead><tr><th>نام درس</th><th>تاریخ</th><th>سطح آزمون</th><th>وضعیت</th></tr></thead>
          <tbody>
            <tr><td>ریاضی</td><td>۱۴۰۳/۰۱/۲۴</td><td>کمی</td><td><span class="chip good">ثبت شده</span></td></tr>
            <tr><td>زیست</td><td>۱۴۰۳/۰۱/۲۹</td><td>پیشرفته</td><td><span class="chip warn">در حال برنامه‌ریزی</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildParentGradesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="table-wrap">
        <table>
          <thead><tr><th>درس</th><th>نمره</th><th>میانگین</th><th>توضیح</th></tr></thead>
          <tbody>
            <tr><td>ریاضی</td><td>۱۹</td><td>۱۸.۴</td><td>بسیار خوب</td></tr>
            <tr><td>علوم</td><td>۱۷</td><td>۱۶.۸</td><td>در حال پیشرفت</td></tr>
            <tr><td>ادبیات</td><td>۱۸</td><td>۱۷.۹</td><td>قابل‌قبول</td></tr>
          </tbody>
        </table>
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
          <div class="service-mini-card"><h4>ریاضی</h4><p>19 از 20</p></div>
          <div class="service-mini-card"><h4>علوم</h4><p>18 از 20</p></div>
          <div class="service-mini-card"><h4>ادبیات</h4><p>17 از 20</p></div>
        </div>
      </div>
    </div>
  `;
}

function buildStudentGradesPanel() {
  return `
    <div class="dashboard-grid">
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
  `;
}

function buildStudentAssignmentsPanel() {
  return `
    <div class="dashboard-grid">
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
  `;
}

function buildStudentMessagesPanel() {
  return `
    <div class="dashboard-grid">
      <div class="panel-card">
        <div class="section-title"><h3>پیام‌های مدرسه</h3></div>
        <div class="card-grid">
          <div class="service-mini-card"><h4>پیام مدیر</h4><p>جلسه راهنمایی و پیشرفت تحصیلی در روز سه‌شنبه برگزار می‌شود.</p></div>
          <div class="service-mini-card"><h4>پیام کلاس</h4><p>تکلیف آزمایشگاه تا پایان هفته ارسال شود.</p></div>
        </div>
      </div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', () => {
  if (state.adminPassword === '') {
    state.adminPassword = defaultAdminPassword;
    writeStorage(STORAGE_KEYS.adminPassword, state.adminPassword);
  }

  if (!state.parents) {
    state.parents = [
      { id: 1, name: 'پدر آرین', username: 'parent1', password: 'parent123', student: 'آرین رضایی' },
      { id: 2, name: 'مادر سارا', username: 'parent2', password: 'parent456', student: 'سارا محمدی' }
    ];
    writeStorage(STORAGE_KEYS.parents, state.parents);
  }

  if (!state.students) {
    state.students = defaultStudents;
    writeStorage(STORAGE_KEYS.students, state.students);
  }

  const storedSession = readStorage(STORAGE_KEYS.session, null);
  if (storedSession) {
    state.session = storedSession;
    renderDashboard();
  }

  document.getElementById('adminPasswordForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const newPassword = document.getElementById('adminPasswordInput').value.trim();
    if (!newPassword) {
      alert('رمز عبور نمی‌تواند خالی باشد.');
      return;
    }

    state.adminPassword = newPassword;
    writeStorage(STORAGE_KEYS.adminPassword, state.adminPassword);
    alert('رمز عبور مدیر با موفقیت ثبت شد و برای همیشه حفظ می‌شود.');
  });

  document.getElementById('assistantForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const permissions = [];
    const fields = ['scores', 'homework', 'events', 'students', 'attendance', 'reports'];
    fields.forEach((key) => {
      const cb = document.createElement('input');
      cb.name = key;
      cb.checked = false;
    });

    const assistant = {
      id: Date.now(),
      name: formData.get('name'),
      username: formData.get('username'),
      password: formData.get('password'),
      base: formData.get('base'),
      permissions: ['scores', 'homework', 'events']
    };

    if (!assistant.name || !assistant.username || !assistant.password || !assistant.base) {
      alert('لطفاً تمام فیلدهای دستیار را تکمیل کنید.');
      return;
    }

    state.assistants.push(assistant);
    writeStorage(STORAGE_KEYS.assistants, state.assistants);
    form.reset();
    renderDashboard();
  });

  document.getElementById('representativeForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const rep = {
      id: Date.now(),
      name: formData.get('name'),
      username: formData.get('username'),
      password: formData.get('password'),
      role: formData.get('role'),
      className: formData.get('className'),
      student: formData.get('student')
    };

    if (!rep.name || !rep.username || !rep.password || !rep.student) {
      alert('لطفاً اطلاعات نماینده را کامل وارد کنید.');
      return;
    }

    state.representatives.push(rep);
    writeStorage(STORAGE_KEYS.representatives, state.representatives);
    form.reset();
    renderDashboard();
  });
});

