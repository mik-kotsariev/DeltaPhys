// Issue 1 & SonarQube: Безпечна генерація UUID з використанням префіксу 'node:'
const crypto = require('node:crypto'); 

// Issue 3: Усунення магічних чисел — усі ліміти винесені в єдину конфігурацію
const CONFIG = {
    MIN_AGE: 16,
    MAX_AGE: 99,
    MIN_PRICE: 50,
    MAX_PRICE: 5000,
    MIN_CAPACITY: 5,
    MAX_CAPACITY: 100
};

class PlatformUser {
    constructor(id) {
        this.id = id;
    }
    // Issue 5: Поліморфний метод замість перевірки через instanceof
    canCreateTours() {
        return false; 
    }
}

class Visitor extends PlatformUser {}
class Participant extends Visitor {}
class Organizer extends Participant {
    // Issue 5: Перевизначення методу для розширення прав організатора
    canCreateTours() {
        return true; 
    }
}
class Moderator extends PlatformUser {}

class EventSession {
    constructor(id, name, price, maxCapacity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.maxCapacity = maxCapacity;
        this.registeredUsers = [];
    }

    // Issue 2: Відновлення інкапсуляції — об'єкт сам перевіряє та змінює свій стан
    registerParticipant(participant) {
        if (this.registeredUsers.length >= this.maxCapacity) {
            throw new Error("Немає вільних місць у сесії.");
        }
        if (this.registeredUsers.some(u => u.id === participant.id)) {
            throw new Error("Користувач вже зареєстрований.");
        }
        this.registeredUsers.push(participant);
    }

    getAvailableSpots() {
        return this.maxCapacity - this.registeredUsers.length;
    }
}

class DeltaPhysService {
    applyForParticipation(participant, session, age) {
        if (!participant || !session) {
            throw new Error("Учасник або сесія не можуть бути null/undefined.");
        }

        // Issue 3: Використання констант CONFIG замість захардкодженних чисел
        if (age < CONFIG.MIN_AGE || age > CONFIG.MAX_AGE) {
            throw new RangeError(`Вік повинен бути від ${CONFIG.MIN_AGE} до ${CONFIG.MAX_AGE} років.`);
        }

        // Issue 2: Виклик інкапсульованого методу (без прямої мутації масиву ззовні)
        session.registerParticipant(participant);
        return true;
    }

    createPaidTour(organizer, name, price, maxCapacity) {
        // Issue 5 & SonarQube: Перевірка ролі через поліморфізм та опціональний ланцюжок (?.)
        if (!organizer?.canCreateTours()) { 
            throw new Error("Тільки організатор може створювати платні тури.");
        }

        if (!name || name.trim() === "") {
            throw new Error("Назва не може бути порожньою.");
        }

        // Issue 3: Використання констант CONFIG для ціни та місткості
        if (price < CONFIG.MIN_PRICE || price > CONFIG.MAX_PRICE) {
            throw new RangeError(`Ціна має бути від ${CONFIG.MIN_PRICE} до ${CONFIG.MAX_PRICE}.`);
        }

        if (maxCapacity < CONFIG.MIN_CAPACITY || maxCapacity > CONFIG.MAX_CAPACITY) {
            throw new RangeError(`Місткість має бути від ${CONFIG.MIN_CAPACITY} до ${CONFIG.MAX_CAPACITY}.`);
        }

        // Issue 1: Криптографічно безпечна генерація унікальних UUID для запобігання колізіям
        return new EventSession(crypto.randomUUID(), name, price, maxCapacity); 
    }

    filterEvents(events, maxPrice, minAvailableSpots) { 
        // SonarQube: Викидаємо суворий TypeError замість базового Error для перевірки типів
        if (!Array.isArray(events)) {
            throw new TypeError("Очікується масив подій.");
        }

        if (maxPrice < 0) { 
            throw new RangeError("Максимальна ціна не може бути від'ємною.");
        }

        // Issue 4 & SonarQube: Захисна перевірка (Guard Clause) з використанням суворого Number.isNaN
        if (typeof minAvailableSpots !== 'number' || minAvailableSpots < 0 || Number.isNaN(minAvailableSpots)) {
            throw new TypeError("minAvailableSpots має бути коректним невід'ємним числом.");
        }

        const result = [];
        
        for (const ev of events) {
            if (ev.price <= maxPrice && ev.getAvailableSpots() >= minAvailableSpots) {
                result.push(ev);
            }
        }
        return result;
    }
}

module.exports = {
    PlatformUser, Visitor, Participant, Organizer, Moderator, EventSession, DeltaPhysService
};