const app = document.createElement('div');
app.style.fontFamily = 'sans-serif';
app.style.maxWidth = '400px';
app.style.margin = '50px auto';
app.style.padding = '20px';
app.style.border = '1px solid #ddd';
app.style.borderRadius = '8px';
document.body.appendChild(app);

let userData = JSON.parse(localStorage.getItem('userProfile')) || {
    name: "Олексій Іванов",
    bio: "Розробник-початківець",
    color: "#4A90E2"
};

function render() {
    app.innerHTML = '';

    const viewSection = document.createElement('div');
    viewSection.innerHTML = `
        <div style="width: 50px; height: 50px; background: ${userData.color}; border-radius: 50%; margin-bottom: 10px;"></div>
        <h2 style="margin: 0;">${userData.name}</h2>
        <p style="color: #666;">${userData.bio}</p>
        <button id="editBtn" style="padding: 8px 16px; cursor: pointer;">Редагувати</button>
    `;

    app.appendChild(viewSection);

    document.getElementById('editBtn').onclick = renderEditForm;
}

function renderEditForm() {
    app.innerHTML = '';

    const form = document.createElement('div');
    form.innerHTML = `
        <h3 style="margin-top: 0;">Налаштування профілю</h3>
        <label style="display: block; margin-bottom: 10px;">
            Ім'я:<br>
            <input type="text" id="editName" value="${userData.name}" style="width: 100%; padding: 5px;">
        </label>
        <label style="display: block; margin-bottom: 10px;">
            Про себе:<br>
            <textarea id="editBio" style="width: 100%; padding: 5px;">${userData.bio}</textarea>
        </label>
        <label style="display: block; margin-bottom: 15px;">
            Колір теми:<br>
            <input type="color" id="editColor" value="${userData.color}">
        </label>
        <button id="saveBtn" style="padding: 8px 16px; background: #28a745; color: white; border: none; cursor: pointer; border-radius: 4px;">Зберегти</button>
        <button id="cancelBtn" style="padding: 8px 16px; margin-left: 10px; cursor: pointer;">Скасувати</button>
    `;

    app.appendChild(form);

    document.getElementById('saveBtn').onclick = () => {
        userData.name = document.getElementById('editName').value;
        userData.bio = document.getElementById('editBio').value;
        userData.color = document.getElementById('editColor').value;

        localStorage.setItem('userProfile', JSON.stringify(userData));
        render();
    };

    document.getElementById('cancelBtn').onclick = render;
}

render();
