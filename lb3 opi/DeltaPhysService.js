class PlatformUser {
    constructor(id) {
        this.id = id;
    }
}

class Visitor extends PlatformUser {}
class Participant extends Visitor {}
class Organizer extends Participant {}
class Moderator extends PlatformUser {}

class EventSession {
    constructor(id, name, price, maxCapacity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.maxCapacity = maxCapacity;
        this.registeredUsers = [];
    }
}

class DeltaPhysService {
    applyForParticipation(participant, session, age) {
        if (!participant || !session) {
            throw new Error("Учасник або сесія не можуть бути null/undefined.");
        }

        if (age < 16 || age > 99) { // Issue 3: Магічні числа
            throw new RangeError("Вік повинен бути від 16 до 99 років.");
        }

        if (session.registeredUsers.length >= session.maxCapacity) { // Issue 2: Порушення інкапсуляції
            throw new Error("Немає вільних місць у сесії.");
        }

        if (session.registeredUsers.some(u => u.id === participant.id)) { // Issue 2: Порушення інкапсуляції
            throw new Error("Користувач вже зареєстрований.");
        }

        session.registeredUsers.push(participant); // Issue 2: Порушення інкапсуляції
        return true;
    }

    createPaidTour(organizer, name, price, maxCapacity) {
        if (!organizer || !(organizer instanceof Organizer)) { // Issue 5: Дублювання коду перевірки типу користувача
            throw new Error("Тільки організатор може створювати платні тури.");
        }

        if (!name || name.trim() === "") {
            throw new Error("Назва не може бути порожньою.");
        }

        if (price < 50 || price > 5000) { // Issue 3: Магічні числа
            throw new RangeError("Ціна має бути від 50 до 5000.");
        }

        if (maxCapacity < 5 || maxCapacity > 100) { // Issue 3: Магічні числа
            throw new RangeError("Місткість має бути від 5 до 100.");
        }

        return new EventSession(Date.now(), name, price, maxCapacity); // Issue 1: Використання небезпечного генератора ID
    }

    filterEvents(events, maxPrice, minAvailableSpots) { // Issue 4: Відсутність валідації параметра
        if (!Array.isArray(events)) {
            throw new Error("Очікується масив подій.");
        }

        if (maxPrice < 0) { // Issue 3: Магічні числа
            throw new RangeError("Максимальна ціна не може бути від'ємною.");
        }

        const result = [];
        
        for (const ev of events) {
            const availableSpots = ev.maxCapacity - ev.registeredUsers.length;
            if (ev.price <= maxPrice && availableSpots >= minAvailableSpots) {
                result.push(ev);
            }
        }
        return result;
    }
}

module.exports = {
    PlatformUser, Visitor, Participant, Organizer, Moderator, EventSession, DeltaPhysService
};