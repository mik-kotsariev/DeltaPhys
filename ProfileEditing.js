function createProfileEditor(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let user = JSON.parse(localStorage.getItem('user_profile')) || {
    username: "Мандрівник",
    status: "Активний",
    avatarColor: "#6200ee"
  };

  const resetContainer = () => {
    container.innerHTML = '';
    container.style.padding = '20px';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '12px';
    container.style.maxWidth = '300px';
    container.style.fontFamily = 'Segoe UI, Tahoma, sans-serif';
  };

  const showProfile = () => {
    resetContainer();

    const profileHTML = `
      <div style="display: flex; align-items: center; flex-direction: column;">
        <div id="avatar" style="width: 80px; height: 80px; background: ${user.avatarColor}; border-radius: 50%; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
          ${user.username.charAt(0).toUpperCase()}
        </div>
        <h3 style="margin: 5px 0;">${user.username}</h3>
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">${user.status}</p>
        <button id="btn-edit" style="width: 100%; padding: 10px; cursor: pointer; border: none; background: #f0f0f0; border-radius: 6px;">Налаштувати</button>
      </div>
    `;

    container.innerHTML = profileHTML;
    document.getElementById('btn-edit').onclick = showEditor;
  };

  const showEditor = () => {
    resetContainer();

    const editorHTML = `
      <h4 style="margin-top: 0;">Редагувати профіль</h4>
      <label style="font-size: 12px; color: #888;">Ім'я користувача</label>
      <input type="text" id="edit-name" value="${user.username}" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
      
      <label style="font-size: 12px; color: #888;">Статус</label>
      <input type="text" id="edit-status" value="${user.status}" style="width: 90%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
      
      <label style="font-size: 12px; color: #888; display: block;">Колір аватара</label>
      <input type="color" id="edit-color" value="${user.avatarColor}" style="margin-bottom: 15px; border: none; width: 50px; height: 30px; cursor: pointer;">
      
      <div style="display: flex; gap: 10px;">
        <button id="btn-save" style="flex: 1; padding: 10px; background: #6200ee; color: white; border: none; border-radius: 6px; cursor: pointer;">Зберегти</button>
        <button id="btn-cancel" style="flex: 1; padding: 10px; background: #eee; border: none; border-radius: 6px; cursor: pointer;">Назад</button>
      </div>
    `;

    container.innerHTML = editorHTML;

    document.getElementById('btn-save').onclick = () => {
      user.username = document.getElementById('edit-name').value || user.username;
      user.status = document.getElementById('edit-status').value || user.status;
      user.avatarColor = document.getElementById('edit-color').value;
      
      localStorage.setItem('user_profile', JSON.stringify(user));
      showProfile();
    };

    document.getElementById('btn-cancel').onclick = showProfile;
  };

  showProfile();
}