class Participant {
    constructor(id) {
        this.id = id;
    }
}

class EventSession {
    constructor(id, title, registeredCount, maxCapacity) {
        this.id = id;
        this.title = title;
        this.registeredUsers = new Set(); 
        this.maxCapacity = maxCapacity;
    }
}

class Organizer {
    constructor(id) {
        this.id = id;
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

    applyForParticipation(participant, session, age) {
        if (typeof age !== 'number' || !isFinite(age)) {
            throw new RangeError("Вік має бути скінченним числом");
        }
        
        if (!session || typeof session !== 'object' || !('registeredUsers' in session)) {
            throw new TypeError("Некоректний об'єкт сесії");
        }

        const pId = participant.id;

        if (session.registeredUsers.has(pId)) {
            throw new Error("Учасник вже зареєстрований");
        }
        
        session.registeredUsers.add(pId);
        return true;
    }

    createPaidTour(organizer, title, price, maxParticipants) {
        const trimmedTitle = title.trim(); 
        
        if (trimmedTitle === "") {
            throw new Error("Назва не може бути порожньою");
        }

        return {
            organizerId: organizer.id,
            title: trimmedTitle,
            price: price,
            maxParticipants: maxParticipants
        };
    }
}

module.exports = { Participant, EventSession, Organizer, EventService };