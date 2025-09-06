let currentFriend = null;

function initChat() {
  guardProfile();
  renderFriends();
}

// Renderowanie znajomych i dodanie funkcji wyboru do chat
function renderFriends() {
  const friendsContainer = document.getElementById("friends-container");
  friendsContainer.innerHTML = "";
  const friends = getFriends();
  const users = getUsers();

  friends.forEach(friend => {
    const div = document.createElement("div");
    div.className = "friend-item";
    div.innerHTML = `<img src="${users[friend]?.avatar || 'default-avatar.png'}" class="friend-avatar"><span>${friend}</span>`;
    div.addEventListener("click", () => selectFriend(friend));
    friendsContainer.appendChild(div);
  });
}

// Wybór znajomego do rozmowy
function selectFriend(friend) {
  currentFriend = friend;
  document.getElementById("chat-with").textContent = "Rozmowa z " + friend;
  renderMessages();
}

// Pobranie historii rozmowy
function getMessages() {
  const session = getSession();
  if (!session || !currentFriend) return [];
  const key = `chat_${session.username}_${currentFriend}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Zapis wiadomości
function saveMessages(messages) {
  const session = getSession();
  if (!session || !currentFriend) return;
  const key = `chat_${session.username}_${currentFriend}`;
  localStorage.setItem(key, JSON.stringify(messages));

  // Dla znajomego też zapisujemy w jego kluczu, aby widział wiadomość
  const friendKey = `chat_${currentFriend}_${session.username}`;
  localStorage.setItem(friendKey, JSON.stringify(messages));
}

// Wyświetlenie wiadomości w chat
function renderMessages() {
  const chatDiv = document.getElementById("chat-messages");
  chatDiv.innerHTML = "";
  const messages = getMessages();
  const session = getSession();
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message " + (msg.sender === session.username ? "you" : "friend");
    div.textContent = msg.sender + ": " + msg.text;
    chatDiv.appendChild(div);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Wysłanie wiadomości
function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (!text || !currentFriend) return;
  
  const session = getSession();
  const messages = getMessages();
  messages.push({ sender: session.username, text });
  saveMessages(messages);
  renderMessages();
  input.value = "";
}
