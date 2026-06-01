class Participant {
    constructor(id) {
        this.id = id;
    }
}

class EventSession {

    constructor(id, title, maxCapacity) {
        this.id = id;
        this.title = title;
        this.registeredUsers = new Set();
        this.maxCapacity = maxCapacity;
    }

    hasParticipant(participantId) {
        return this.registeredUsers.has(participantId);
    }

    registerParticipant(participantId) {
        this.registeredUsers.add(participantId);
    }
}

class Organizer {
    constructor(id) {
        this.id = id;
    }
}

class PaidTour {
    constructor(organizerId, title, price, maxParticipants) {
        this.organizerId = organizerId;
        this.title = title;
        this.price = price;
        this.maxParticipants = maxParticipants;
    }
}

class EventService {
    filterEvents(eventsArray, maxCapacity, organizerId) {
        if (!Array.isArray(eventsArray)) {
            throw new Error("Очікується масив подій");
        }
        return eventsArray.filter(event => 
            event.maxCapacity <= maxCapacity && event.organizerId === organizerId
        );
    }

    applyForParticipation(participant, session) { 
        if (!session || typeof session !== 'object' || !('registeredUsers' in session)) {
            throw new TypeError("Некоректний об'єкт сесії");
        }

        if (!participant || typeof participant !== 'object' || !('id' in participant)) {
            throw new TypeError("Некоректний об'єкт учасника");
        }

        const pId = participant.id;

        if (session.hasParticipant(pId)) {
            throw new Error("Учасник вже зареєстрований");
        }
        
        session.registerParticipant(pId);
        return true;
    }

    createPaidTour(organizer, title, price, maxParticipants) {

        if (!organizer || typeof organizer !== 'object' || !('id' in organizer)) {
            throw new TypeError("Некоректний об'єкт організатора");
        }
        if (typeof title !== 'string') {
            throw new TypeError("Назва туру має бути рядком");
        }

        const trimmedTitle = title.trim(); 
        
        if (trimmedTitle === "") {
            throw new Error("Назва не може бути порожньою");
        }

        return new PaidTour(organizer.id, trimmedTitle, price, maxParticipants);
    }
}
module.exports = { Participant, EventSession, Organizer, PaidTour, EventService };