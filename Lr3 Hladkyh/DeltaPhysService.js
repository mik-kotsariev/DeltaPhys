class Visitor {
    constructor(id) { this.id = id; }
}

class Participant extends Visitor {
    constructor(id) { super(id); }
}

class Organizer extends Participant {
    constructor(id) { super(id); }
}

class EventSession {
    constructor(id, title, price, capacity) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.capacity = capacity;
        this.participants = [];
    }
}

class DeltaPhysService {

    applyForParticipation(participant, session, age) {
        if (!participant || !session) {
            throw new Error("Учасник та сесія не можуть бути null");
        }

        const isAlreadyRegistered = session.participants.some(p => p.id === participant.id);
        if (isAlreadyRegistered) {
            throw new Error("Учасник вже зареєстрований");
        }

        if (session.participants.length >= session.capacity) {
            throw new Error("Немає вільних місць");
        }

        session.participants.push(participant);
        return true;
    }

    createPaidTour(user, title, price, capacity) {
        if (!(user instanceof Organizer)) {
            throw new Error("Тільки організатор може створювати тури");
        }

        if (!title || title.length < 3) {
            throw new Error("Назва туру занадто коротка");
        }

        if (price < 0 || capacity <= 0) {
            throw new Error("Некоректні параметри ціни або місткості");
        }

        return new EventSession(Date.now(), title, price, capacity);
    }
    
    validateAndFilter(sessions, minPrice) {
        if (!Array.isArray(sessions)) throw new Error("Потрібен масив");
        return sessions.filter(s => s.price >= minPrice);
    }
}

module.exports = { Visitor, Participant, Organizer, EventSession, DeltaPhysService };