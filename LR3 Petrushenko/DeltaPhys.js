class Participant {
    constructor(id) {
        this.id = id;
    }
}

class EventSession {
    constructor(id, name, price, totalSpots) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.totalSpots = totalSpots;
        this.registeredUsers = [];
    }
}

class PaidTour {
    constructor(organization, name, price, totalSpots) {
        this.organization = organization;
        this.name = name;
        this.price = price;
        this.totalSpots = totalSpots;
    }
}

class EventService {
    createPaidTour(organization, name, price, totalSpots) {
        if (name === null || name === undefined || name.trim() === "") {
            throw new Error("Назва не може бути порожньою");
        }
        return new PaidTour(organization, name, price, totalSpots);
    }

    filterEvents(eventsList, maxPrice, minSpots) {
        if (maxPrice < 0) {
            throw new RangeError("Ціна не може бути від'ємною");
        }

        return eventsList.filter(event => {
            const availableSpots = event.totalSpots - event.registeredUsers.length;
            return event.price <= maxPrice && availableSpots >= minSpots;
        });
    }
}

module.exports = {
    Participant,
    EventSession,
    PaidTour,
    EventService
};