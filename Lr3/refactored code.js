const crypto = require('node:crypto'); 

const CONFIG = {
    MIN_TITLE_LENGTH: 2
};

class Visitor {
    constructor(id) {
        this.id = id;
    }
    
    getId() {
        return this.id;
    }
}

class Participant extends Visitor {
    getRole() {
        return 'Participant';
    }
}

class Organizer extends Visitor {
    getRole() {
        return 'Organizer';
    }
}

class EventSession {
    constructor(id, title, price, capacity) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.capacity = capacity;
        this.registeredParticipants = new Set();
    }

    hasFreePlaces() {
        return this.capacity > 0;
    }

    addParticipant(participant) {
        if (!(participant instanceof Participant)) {
            throw new TypeError("Об'єкт повинен бути екземпляром Participant");
        }

        if (!this.hasFreePlaces()) {
            throw new Error("Немає вільних місць");
        }

        const alreadyRegistered = Array.from(this.registeredParticipants)
            .some(p => p.id === participant.id);

        if (alreadyRegistered) {
            throw new Error("Учасник вже зареєстрований");
        }

        this.registeredParticipants.add(participant);
        this.capacity--; 
        return true;
    }
}

class EventFactory {
    static createPaidTour(organizer, title, price, capacity) {
        if (!(organizer instanceof Organizer)) {
            throw new TypeError("Створити тур може тільки Організатор");
        }

        if (!title || title.length < CONFIG.MIN_TITLE_LENGTH) {
            throw new Error("Назва занадто коротка");
        }

        const id = crypto.randomUUID();
        return new EventSession(id, title, price, capacity);
    }
}

class RegistrationService {
    static applyForParticipation(participant, session) {
        if (!participant || !session) {
            throw new TypeError("Учасник та сесія не можуть бути null");
        }

        if (!(session instanceof EventSession)) {
            throw new TypeError("Об'єкт сесії повинен бути екземпляром EventSession");
        }

        return session.addParticipant(participant);
    }
}

class DeltaPhysService {
    constructor() {
        this.sessions = [];
    }

    registerParticipant(participant, session) {
        return RegistrationService.applyForParticipation(participant, session);
    }

    createTour(organizer, title, price, capacity) {
        const newSession = EventFactory.createPaidTour(organizer, title, price, capacity);
        this.sessions.push(newSession);
        return newSession;
    }
}

module.exports = { 
    Visitor, 
    Participant, 
    Organizer, 
    EventSession, 
    EventFactory, 
    RegistrationService, 
    DeltaPhysService 
};