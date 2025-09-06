// Klucze w localStorage
const STORAGE_USERS = "rbx_users";
const STORAGE_SESSION = "rbx_session";

// ============== AUTH ==============
function initAuthPage() {
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const which = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(which).classList.add("active");
    });
  });
}

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_USERS) || "{}");
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function setSession(username) {
  localStorage.setItem(STORAGE_SESSION, JSON.stringify({
    username,
    loginAt: new Date().toISOString()
  }));
}

function getSession() {
  const raw = localStorage.getItem(STORAGE_SESSION);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function registerUser() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value;

  if (!username || !password) {
    alert("Podaj nazwę użytkownika i hasło.");
    return;
  }
  const users = getUsers();
  if (users[username]) {
    alert("Ta nazwa jest już zajęta.");
    return;
  }

  saveUsers(users);

  alert("Konto utworzone! Zaloguj się.");
  // przełącz na login tab
  document.querySelector('.tab[data-tab="login"]').click();
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  const users = getUsers();
  if (!users[username] || users[username].password !== password) {
    alert("Nieprawidłowy login lub hasło.");
    return;
  }
  setSession(username);
  window.location.href = "admin.html";
}

function logout() {
  localStorage.removeItem(STORAGE_SESSION);
  window.location.href = "DostępAdmin.html";
}

function guardProfile() {
  const session = getSession();
  if (!session || !session.username) {
    window.location.href = "DostępAdmin.html";
  }
}