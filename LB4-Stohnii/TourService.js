const ROLES = Object.freeze({
    ORGANIZER: 'organizer',
    MODERATOR: 'moderator'
});

const TOUR_PRICE_LIMITS = Object.freeze({
    MIN: 50,
    MAX: 5000
});

const TOUR_CAPACITY_LIMITS = Object.freeze({
    MIN: 5,
    MAX: 100
});

class User {
    constructor(id, role) {
        this.id = id;
        this.role = role; 
    }
}

class Organizer extends User {
    constructor(id) {
        super(id, ROLES.ORGANIZER);
    }
}

class Moderator extends User {
    constructor(id) {
        super(id, ROLES.MODERATOR);
    }
}

class Tour {
    constructor({ title, price, maxCapacity }) {
        this.validate(title, price, maxCapacity);
        
        this.title = title;
        this.price = price;
        this.maxCapacity = maxCapacity;
    }

    validate(title, price, maxCapacity) {
        if (!title || title.trim() === "") {
            throw new Error("Назва не може бути порожньою");
        }

        if (price < TOUR_PRICE_LIMITS.MIN || price > TOUR_PRICE_LIMITS.MAX) {
            throw new RangeError(`Ціна повинна бути в межах від ${TOUR_PRICE_LIMITS.MIN} до ${TOUR_PRICE_LIMITS.MAX}`);
        }

        if (maxCapacity < TOUR_CAPACITY_LIMITS.MIN || maxCapacity > TOUR_CAPACITY_LIMITS.MAX) {
            throw new RangeError(`Місткість повинна бути в межах від ${TOUR_CAPACITY_LIMITS.MIN} до ${TOUR_CAPACITY_LIMITS.MAX}`);
        }
    }
}

class TourService {
    /**
     * @param {User} user 
     * @param {Object} tourDetails
     */
    createPaidTour(user, tourDetails) {
        if (!user || user.role !== ROLES.ORGANIZER) {
            throw new Error("Тільки організатор може створювати платні тури");
        }

        return new Tour(tourDetails);
    }
}

module.exports = { 
    User, 
    Organizer, 
    Moderator, 
    Tour, 
    TourService,
    ROLES
};