class User {
    constructor(id, role) {
        this.id = id;
        this.role = role; 
    }
}

class Organizer extends User {
    constructor(id) {
        super(id, 'organizer');
    }
}

class Moderator extends User {
    constructor(id) {
        super(id, 'moderator');
    }
}

class Tour {
    constructor(title, price, maxCapacity) {
        this.title = title;
        this.price = price;
        this.maxCapacity = maxCapacity;
    }
}

class TourService {
    createPaidTour(user, title, price, maxCapacity) {
        if (!user || user.role !== 'organizer') {
            throw new Error("Тільки організатор може створювати платні тури");
        }

        if (!title || title.trim() === "") {
            throw new Error("Назва не може бути порожньою");
        }

        if (price < 50 || price > 5000) {
            throw new RangeError("Ціна повинна бути в межах від 50 до 5000");
        }

        if (maxCapacity < 5 || maxCapacity > 100) {
            throw new RangeError("Місткість повинна бути в межах від 5 до 100");
        }

        return new Tour(title, price, maxCapacity);
    }
}

module.exports = { TourService, Organizer, Moderator };