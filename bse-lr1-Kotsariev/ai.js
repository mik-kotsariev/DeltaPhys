 // Система для оцінки роботи сайту користувачами та отримання фідбеку адміном

// Зберігання оцінок та фідбеку
const feedbackData = {
    userRatings: [],
    adminFeedback: []
};

// Функція для отримання оцінки від користувача (1-5)
const getUserRating = (userName, rating, comment = "") => {
    // Валідація оцінки
    if (rating < 1 || rating > 5) {
        return `❌ Помилка: оцінка має бути від 1 до 5!`;
    }

    // Збереження оцінки
    const feedbackEntry = {
        userName,
        rating,
        comment,
        timestamp: new Date().toLocaleString('uk-UA')
    };
    
    feedbackData.userRatings.push(feedbackEntry);
    
    // Повідомлення користувачу
    return `✅ Дякуємо за фідбек, ${userName}! Ваша оцінка: ${rating}/5 ${comment ? `\n💬 Коментар: ${comment}` : ''}`;
};

// Функція для отримання фідбеку адміном
const getAdminFeedback = (adminName) => {
    if (feedbackData.userRatings.length === 0) {
        return `📊 ${adminName}, ще немає оцінок від користувачів.`;
    }

    const averageRating = (feedbackData.userRatings.reduce((sum, f) => sum + f.rating, 0) / feedbackData.userRatings.length).toFixed(2);
    
    let feedbackReport = `📊 ЗВІТ ФІДБЕКУ ДЛЯ АДМІНА ${adminName.toUpperCase()}\n`;
    feedbackReport += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    feedbackReport += `📈 Середня оцінка: ${averageRating}/5\n`;
    feedbackReport += `👥 Всього оцінок: ${feedbackData.userRatings.length}\n\n`;
    
    feedbackReport += `📋 ДЕТАЛІ ОЦІНОК:\n`;
    feedbackData.userRatings.forEach((f, index) => {
        feedbackReport += `${index + 1}. ${f.userName} - ⭐ ${f.rating}/5 (${f.timestamp})`;
        if (f.comment) feedbackReport += `\n   💬 "${f.comment}"`;
        feedbackReport += `\n`;
    });
    
    return feedbackReport;
};

// Функція для оцінки адміна та відповіді на фідбек
const setAdminRating = (adminName, adminMessage) => {
    const adminEntry = {
        adminName,
        message: adminMessage,
        timestamp: new Date().toLocaleString('uk-UA')
    };
    
    feedbackData.adminFeedback.push(adminEntry);
    return `✅ Адмін ${adminName} залишив коментар: "${adminMessage}"`;
};

// Функція для виведення всіх коментарів адміна
const showAdminComments = () => {
    if (feedbackData.adminFeedback.length === 0) {
        return `📌 Ще немає коментарів від адміна.`;
    }
    
    let comments = `📌 КОМЕНТАРІ АДМІНА:\n`;
    feedbackData.adminFeedback.forEach((f, index) => {
        comments += `${index + 1}. ${f.adminName} (${f.timestamp}): ${f.message}\n`;
    });
    
    return comments;
};

// Експортування функцій для використання в інших файлах
module.exports = {
    getUserRating,
    getAdminFeedback,
    setAdminRating,
    showAdminComments,
    feedbackData
};

