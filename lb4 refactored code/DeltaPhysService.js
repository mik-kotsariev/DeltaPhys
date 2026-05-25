const crypto = require('crypto');

// Issue 3: Винесення магічних чисел у конфігурацію
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
    // Issue 5: Поліморфізм замість instanceof
    canCreateTours() {
        return false; 
    }
}

class Visitor extends PlatformUser {}
class Participant extends Visitor {}
class Organizer extends Participant {
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

    // Issue 2: Відновлення інкапсуляції
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

        if (age < CONFIG.MIN_AGE || age > CONFIG.MAX_AGE) {
            throw new RangeError(`Вік повинен бути від ${CONFIG.MIN_AGE} до ${CONFIG.MAX_AGE} років.`);
        }

        // Виклик інкапсульованого методу замість прямої мутації стану
        session.registerParticipant(participant);
        return true;
    }

    createPaidTour(organizer, name, price, maxCapacity) {
        if (!organizer || !organizer.canCreateTours()) { 
            throw new Error("Тільки організатор може створювати платні тури.");
        }

        if (!name || name.trim() === "") {
            throw new Error("Назва не може бути порожньою.");
        }

        if (price < CONFIG.MIN_PRICE || price > CONFIG.MAX_PRICE) {
            throw new RangeError(`Ціна має бути від ${CONFIG.MIN_PRICE} до ${CONFIG.MAX_PRICE}.`);
        }

        if (maxCapacity < CONFIG.MIN_CAPACITY || maxCapacity > CONFIG.MAX_CAPACITY) {
            throw new RangeError(`Місткість має бути від ${CONFIG.MIN_CAPACITY} до ${CONFIG.MAX_CAPACITY}.`);
        }

        // Issue 1: Безпечна генерація ID
        return new EventSession(crypto.randomUUID(), name, price, maxCapacity); 
    }

    filterEvents(events, maxPrice, minAvailableSpots) { 
        if (!Array.isArray(events)) {
            throw new Error("Очікується масив подій.");
        }

        if (maxPrice < 0) { 
            throw new RangeError("Максимальна ціна не може бути від'ємною.");
        }

        // Issue 4: Захисна перевірка (Guard Clause) для minAvailableSpots
        if (typeof minAvailableSpots !== 'number' || minAvailableSpots < 0 || isNaN(minAvailableSpots)) {
            throw new Error("minAvailableSpots має бути коректним невід'ємним числом.");
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