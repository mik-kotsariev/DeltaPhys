class Participant {
    constructor(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }
}

class BaseEvent {
    constructor(name, price, totalSpots) {
        if (!name || name.trim() === "") {
            throw new Error("Назва не може бути порожньою");
        }
        if (price < 0) {
            throw new RangeError("Ціна не може бути від'ємною");
        }
        if (totalSpots <= 0) {
            throw new RangeError("Кількість місць має бути більшою за нуль");
        }

        this.name = name;
        this.price = price;
        this.totalSpots = totalSpots;
        this.registeredUsers = [];
    }
    getAvailableSpots() {
        return this.totalSpots - this.registeredUsers.length;
    }
}

class EventSession extends BaseEvent {
    constructor(id, name, price, totalSpots) {
        super(name, price, totalSpots);
        this.id = id;
    }

    getSessionId() {
        return this.id;
    }
}

class PaidTour extends BaseEvent {
    constructor(organization, name, price, totalSpots) {
        super(name, price, totalSpots);
        this.organization = organization;
    }

    getOrganizationInfo() {
        return this.organization;
    }
}

class EventService {
    createPaidTour(organization, name, price, totalSpots) {
        return new PaidTour(organization, name, price, totalSpots);
    }

    filterEvents(eventsList, maxPrice, minSpots) {
        if (!Array.isArray(eventsList)) {
            throw new TypeError("eventsList має бути масивом");
        }
        if (maxPrice < 0 || minSpots < 0) {
            throw new RangeError("Параметри фільтрації не можуть бути від'ємними");
        }

        return eventsList.filter(event => {
            return event.price <= maxPrice && event.getAvailableSpots() >= minSpots;
        });
    }
}

module.exports = {
    Participant,
    BaseEvent,
    EventSession,
    PaidTour,
    EventService
};
