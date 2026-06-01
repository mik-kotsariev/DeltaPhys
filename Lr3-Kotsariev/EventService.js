class Participant {
    constructor(id) {
        this.id = id;
    }
}

class EventSession {
    constructor(id, title, registeredCount, maxCapacity) {     //Issue 1: видалити registeredCount
        this.id = id;
        this.title = title;
        this.registeredUsers = new Set(); //Issue 2: Порушення принципу інкапсуляції
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

    applyForParticipation(participant, session, age) { //Issue 3: Невикористаний параметр методу
        if (typeof age !== 'number' || !isFinite(age)) {
            throw new RangeError("Вік має бути скінченним числом");
        }
        
        if (!session || typeof session !== 'object' || !('registeredUsers' in session)) {
            throw new TypeError("Некоректний об'єкт сесії");
        }

        const pId = participant.id; //issue 4: Відсутність валідації вхідних параметрів та потенційний Runtime Error

        if (session.registeredUsers.has(pId)) {
            throw new Error("Учасник вже зареєстрований");
        }
        
        session.registeredUsers.add(pId);
        return true;
    }

    createPaidTour(organizer, title, price, maxParticipants) { //Issue 5: Потенційне падіння через відсутність валідації на null/undefined
        const trimmedTitle = title.trim(); 
        
        if (trimmedTitle === "") {
            throw new Error("Назва не може бути порожньою");
        }

        return { //Issue 6: Жорстке зв'язування даних та дублювання логіки створення об'єктів
            organizerId: organizer.id,
            title: trimmedTitle,
            price: price,
            maxParticipants: maxParticipants
        };
    }
}

module.exports = { Participant, EventSession, Organizer, EventService };
