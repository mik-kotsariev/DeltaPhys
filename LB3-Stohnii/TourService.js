class User {
    constructor(id, role) {
        this.id = id;
        this.role = role; 
    }
}

class Organizer extends User {
    constructor(id) {
        super(id, 'organizer');     // issue 1: магічні рядки
    }
}

class Moderator extends User {
    constructor(id) {
        super(id, 'moderator');     // issue 1: магічні рядки
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
    createPaidTour(user, title, price, maxCapacity) {       // issue 4: Довгий список параметрів та Data Clumps
        if (!user || user.role !== 'organizer') {       // issue 1: магічні рядки
            throw new Error("Тільки організатор може створювати платні тури");
        }

        // issue 3: Порушення принципу єдиної відповідальності 35-45
        if (!title || title.trim() === "") {
            throw new Error("Назва не може бути порожньою");
        }

        if (price < 50 || price > 5000) {   // issue 2: Магічні числа 
            throw new RangeError("Ціна повинна бути в межах від 50 до 5000");
        }

        if (maxCapacity < 5 || maxCapacity > 100) {   // issue 2: Магічні числа
            throw new RangeError("Місткість повинна бути в межах від 5 до 100");
        }

        return new Tour(title, price, maxCapacity);
    }
}

module.exports = { TourService, Organizer, Moderator }; // issue 5: Неповний експорт модуля
