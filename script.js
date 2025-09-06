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

  users[username] = {
    password,
    createdAt: new Date().toLocaleDateString(),
    about: "Hi, I’m on Roblox Clone 😎",
    stats: {
      visits: 1,
      followers: 0,
      following: 0,
      friends: 0
    }
  };
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
  window.location.href = "home.html";
}

function logout() {
  localStorage.removeItem(STORAGE_SESSION);
  window.location.href = "index.html";
}

function guardProfile() {
  const session = getSession();
  if (!session || !session.username) {
    window.location.href = "index.html";
  }
}

// ============== PROFILE FILL ==============
function fillProfile() {
  const session = getSession();
  if (!session) return;

  const users = getUsers();
  const user = users[session.username];
  if (!user) {
    // user usunięty? wyloguj
    logout();
    return;
  }

  const username = session.username;

  // Header
  setText("displayName", username);
  setText("handle", "@" + username);

  // Numbers
  setText("friendsCount", user.stats.friends ?? 0);
  setText("followersCount", user.stats.followers ?? 0);
  setText("followingCount", user.stats.following ?? 0);

  // About
  setText("about", user.about || "");

  // Stats
  setText("joinDate", user.createdAt);
  setText("placeVisits", user.stats.visits ?? 1);
  setText("followersCount2", user.stats.followers ?? 0);

  // Experiences
  setText("gameTitle", `${username}'s Place 1`);
  document.getElementById("gameTitle2").textContent = `${username}'s Place 2`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function sendForumMessage() {
  const textarea = document.getElementById("forum-text");
  const message = textarea.value.trim();

  if (message === "") {
    alert("Wpisz wiadomość.");
    return;
  }

  // Pobierz nazwę użytkownika z localStorage lub ustaw na "Guest"
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const username = user ? user.username : "Guest";

  // Tworzenie nowej wiadomości
  const forumMessages = document.getElementById("forum-messages");
  const msgEl = document.createElement("div");
  msgEl.className = "forum-message";
  msgEl.innerHTML = `<strong>${username}:</strong> ${message}`;

  forumMessages.appendChild(msgEl);

  // Wyczyść pole tekstowe
  textarea.value = "";
}
function resetPassword() {
  const username = prompt("Podaj swoją nazwę użytkownika, aby zresetować hasło:");
  if (!username) return;

  const users = getUsers();
  if (!users[username]) {
    alert("Nie znaleziono takiego użytkownika.");
    return;
  }

  const newPassword = prompt("Podaj nowe hasło:");
  if (!newPassword) return;

  users[username].password = newPassword;
  saveUsers(users);
  alert("Hasło zostało zresetowane! Możesz się teraz zalogować nowym hasłem.");
}
// Pobranie listy znajomych dla aktualnego użytkownika
function getFriends() {
  const session = getSession();
  if (!session) return [];
  return JSON.parse(localStorage.getItem(`friends_${session.username}`) || "[]");
}

// Zapis listy znajomych
function saveFriends(friends) {
  const session = getSession();
  if (!session) return;
  localStorage.setItem(`friends_${session.username}`, JSON.stringify(friends));
}

// Dodawanie znajomego po wpisaniu nazwy
function addFriend() {
  const username = document.getElementById("friend-username").value.trim();
  if (!username) {
    alert("Podaj nazwę użytkownika.");
    return;
  }

  const users = getUsers();
  if (!users[username]) {
    alert("Nie znaleziono takiego użytkownika.");
    return;
  }

  const friends = getFriends();
  if (friends.includes(username)) {
    alert("Już jest w znajomych.");
    return;
  }

  friends.push(username);
  saveFriends(friends);
  renderFriends();
  alert("Dodano znajomego!");
  document.getElementById("friend-username").value = "";
}

// Wyświetlanie listy znajomych
function renderFriends() {
  const friendsContainer = document.getElementById("friends-container");
  if (!friendsContainer) return;

  friendsContainer.innerHTML = "";
  const friends = getFriends();
  const users = getUsers();

  friends.forEach(friend => {
    const div = document.createElement("div");
    div.className = "friend-item";
    div.innerHTML = `
      <img src="${users[friend]?.avatar || 'default-avatar.png'}" alt="${friend}" class="friend-avatar">
      <span class="friend-name">${friend}</span>
    `;
    friendsContainer.appendChild(div);
  });
}

// Uruchom przy ładowaniu strony, żeby wyświetlić znajomych
document.addEventListener("DOMContentLoaded", renderFriends);

function getSession() {
  const raw = localStorage.getItem("rbx_session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function isAdmin() {
  const session = getSession();
  return session && session.username === "Admin";
}

function logAdminAction(message) {
  const logDiv = document.getElementById("admin-log");
  if (!logDiv) return;
  const p = document.createElement("p");
  p.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
  logDiv.prepend(p);
}

// Funkcje admina
function banUser() {
  if (!isAdmin()) return alert("Brak uprawnień!");
  const username = document.getElementById("admin-username").value.trim();
  if (!username) return alert("Podaj nazwę użytkownika.");
  let bans = JSON.parse(localStorage.getItem("bans") || "[]");
  if (!bans.includes(username)) bans.push(username);
  localStorage.setItem("bans", JSON.stringify(bans));
  logAdminAction(`${username} został zbanowany!`);
}

function kickUser() {
  if (!isAdmin()) return alert("Brak uprawnień!");
  const username = document.getElementById("admin-username").value.trim();
  if (!username) return alert("Podaj nazwę użytkownika.");
  logAdminAction(`${username} został wyrzucony!`);
}

function timeoutUser() {
  if (!isAdmin()) return alert("Brak uprawnień!");
  const username = document.getElementById("admin-username").value.trim();
  if (!username) return alert("Podaj nazwę użytkownika.");
  logAdminAction(`${username} otrzymał timeout!`);
}

function resetUserPassword() {
  if (!isAdmin()) return alert("Brak uprawnień!");
  const username = document.getElementById("admin-username").value.trim();
  if (!username) return alert("Podaj nazwę użytkownika.");
  const users = JSON.parse(localStorage.getItem("rbx_users") || "{}");
  if (!users[username]) return alert("Nie znaleziono użytkownika.");
  const newPass = prompt("Podaj nowe hasło dla użytkownika:");
  if (!newPass) return;
  users[username].password = newPass;
  localStorage.setItem("rbx_users", JSON.stringify(users));
  logAdminAction(`Hasło użytkownika ${username} zostało zresetowane!`);
}

function deleteUser() {
  if (!isAdmin()) return alert("Brak uprawnień!");
  const username = document.getElementById("admin-username").value.trim();
  if (!username) return alert("Podaj nazwę użytkownika.");
  const users = JSON.parse(localStorage.getItem("rbx_users") || "{}");
  if (!users[username]) return alert("Nie znaleziono użytkownika.");
  delete users[username];
  localStorage.setItem("rbx_users", JSON.stringify(users));
  logAdminAction(`Konto użytkownika ${username} zostało usunięte!`);
}
