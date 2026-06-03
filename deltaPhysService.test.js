const {
    CONFIG,
    PlatformUser,
    Visitor,
    Participant,
    Organizer,
    Moderator,
    EventSession,
    DeltaPhysService
} = require('./deltaPhysService');

describe('DeltaPhysService', () => {
    let service;
    let organizer;

    beforeEach(() => {
        service = new DeltaPhysService();
        organizer = new Organizer('org-1');
    });

    // ──────────────────────────────────────────
    // createPaidTour
    // ──────────────────────────────────────────
    describe('createPaidTour', () => {
        test('успішне створення туру з коректними даними', () => {
            const session = service.createPaidTour(organizer, 'Тур по Києву', 500, 30);

            expect(session).toBeInstanceOf(EventSession);
            expect(session.name).toBe('Тур по Києву');
            expect(session.price).toBe(500);
            expect(session.maxCapacity).toBe(30);
            expect(session.id).toBeDefined();
            expect(session.registeredUsers).toEqual([]);
        });

        test('генерує унікальні UUID для різних турів', () => {
            const s1 = service.createPaidTour(organizer, 'Тур 1', 100, 10);
            const s2 = service.createPaidTour(organizer, 'Тур 2', 200, 20);

            expect(s1.id).not.toBe(s2.id);
        });

        test('помилка: не-організатор не може створювати тури', () => {
            const participant = new Participant('user-1');
            expect(() => service.createPaidTour(participant, 'Тур', 500, 30))
                .toThrow('Тільки організатор може створювати платні тури.');
        });

        test('помилка: Visitor не може створювати тури', () => {
            const visitor = new Visitor('visitor-1');
            expect(() => service.createPaidTour(visitor, 'Тур', 500, 30))
                .toThrow('Тільки організатор може створювати платні тури.');
        });

        test('помилка: Moderator не може створювати тури', () => {
            const moderator = new Moderator('mod-1');
            expect(() => service.createPaidTour(moderator, 'Тур', 500, 30))
                .toThrow('Тільки організатор може створювати платні тури.');
        });

        test('помилка: null організатор', () => {
            expect(() => service.createPaidTour(null, 'Тур', 500, 30))
                .toThrow('Тільки організатор може створювати платні тури.');
        });

        test('помилка: порожня назва туру', () => {
            expect(() => service.createPaidTour(organizer, '', 500, 30))
                .toThrow('Назва не може бути порожньою.');
        });

        test('помилка: назва тільки з пробілів', () => {
            expect(() => service.createPaidTour(organizer, '   ', 500, 30))
                .toThrow('Назва не може бути порожньою.');
        });

        test('помилка: ціна нижче мінімуму', () => {
            expect(() => service.createPaidTour(organizer, 'Тур', CONFIG.MIN_PRICE - 1, 30))
                .toThrow(RangeError);
        });

        test('помилка: ціна вище максимуму', () => {
            expect(() => service.createPaidTour(organizer, 'Тур', CONFIG.MAX_PRICE + 1, 30))
                .toThrow(RangeError);
        });

        test('успіх: ціна на мінімальній межі', () => {
            const session = service.createPaidTour(organizer, 'Тур', CONFIG.MIN_PRICE, 10);
            expect(session.price).toBe(CONFIG.MIN_PRICE);
        });

        test('успіх: ціна на максимальній межі', () => {
            const session = service.createPaidTour(organizer, 'Тур', CONFIG.MAX_PRICE, 10);
            expect(session.price).toBe(CONFIG.MAX_PRICE);
        });

        test('помилка: місткість нижче мінімуму', () => {
            expect(() => service.createPaidTour(organizer, 'Тур', 500, CONFIG.MIN_CAPACITY - 1))
                .toThrow(RangeError);
        });

        test('помилка: місткість вище максимуму', () => {
            expect(() => service.createPaidTour(organizer, 'Тур', 500, CONFIG.MAX_CAPACITY + 1))
                .toThrow(RangeError);
        });
    });

    // ──────────────────────────────────────────
    // applyForParticipation
    // ──────────────────────────────────────────
    describe('applyForParticipation', () => {
        let session;

        beforeEach(() => {
            session = service.createPaidTour(organizer, 'Тур', 500, 5);
        });

        test('успішна реєстрація учасника', () => {
            const participant = new Participant('user-1');
            const result = service.applyForParticipation(participant, session, 25);

            expect(result).toBe(true);
            expect(session.registeredUsers).toHaveLength(1);
            expect(session.getAvailableSpots()).toBe(4);
        });

        test('успішна реєстрація кількох учасників', () => {
            for (let i = 1; i <= 3; i++) {
                service.applyForParticipation(new Participant(`user-${i}`), session, 20 + i);
            }

            expect(session.registeredUsers).toHaveLength(3);
            expect(session.getAvailableSpots()).toBe(2);
        });

        test('помилка: вік нижче мінімуму', () => {
            const participant = new Participant('user-1');
            expect(() => service.applyForParticipation(participant, session, CONFIG.MIN_AGE - 1))
                .toThrow(RangeError);
        });

        test('помилка: вік вище максимуму', () => {
            const participant = new Participant('user-1');
            expect(() => service.applyForParticipation(participant, session, CONFIG.MAX_AGE + 1))
                .toThrow(RangeError);
        });

        test('успіх: вік на мінімальній межі', () => {
            const participant = new Participant('user-1');
            expect(service.applyForParticipation(participant, session, CONFIG.MIN_AGE)).toBe(true);
        });

        test('успіх: вік на максимальній межі', () => {
            const participant = new Participant('user-1');
            expect(service.applyForParticipation(participant, session, CONFIG.MAX_AGE)).toBe(true);
        });

        test('помилка: немає вільних місць', () => {
            // Заповнюємо всі 5 місць
            for (let i = 1; i <= 5; i++) {
                service.applyForParticipation(new Participant(`user-${i}`), session, 25);
            }

            expect(() => service.applyForParticipation(new Participant('user-6'), session, 25))
                .toThrow('Немає вільних місць у сесії.');
        });

        test('помилка: повторна реєстрація того ж учасника', () => {
            const participant = new Participant('user-1');
            service.applyForParticipation(participant, session, 25);

            expect(() => service.applyForParticipation(participant, session, 25))
                .toThrow('Користувач вже зареєстрований.');
        });

        test('помилка: null учасник', () => {
            expect(() => service.applyForParticipation(null, session, 25))
                .toThrow('Учасник або сесія не можуть бути null/undefined.');
        });

        test('помилка: null сесія', () => {
            const participant = new Participant('user-1');
            expect(() => service.applyForParticipation(participant, null, 25))
                .toThrow('Учасник або сесія не можуть бути null/undefined.');
        });
    });

    // ──────────────────────────────────────────
    // filterEvents
    // ──────────────────────────────────────────
    describe('filterEvents', () => {
        let events;

        beforeEach(() => {
            events = [
                new EventSession('1', 'Дешевий тур', 100, 10),
                new EventSession('2', 'Середній тур', 300, 20),
                new EventSession('3', 'Дорогий тур', 1000, 5),
            ];
            // Реєструємо 3 учасників на третій тур (залишиться 2 місця)
            events[2].registerParticipant(new Participant('u1'));
            events[2].registerParticipant(new Participant('u2'));
            events[2].registerParticipant(new Participant('u3'));
        });

        test('фільтрація за максимальною ціною', () => {
            const result = service.filterEvents(events, 300, 0);
            expect(result).toHaveLength(2);
            expect(result.map(e => e.name)).toEqual(['Дешевий тур', 'Середній тур']);
        });

        test('фільтрація за мінімальними вільними місцями', () => {
            const result = service.filterEvents(events, 5000, 5);
            expect(result).toHaveLength(2);
            expect(result.map(e => e.name)).toEqual(['Дешевий тур', 'Середній тур']);
        });

        test('комбінована фільтрація: ціна + місця', () => {
            const result = service.filterEvents(events, 200, 5);
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Дешевий тур');
        });

        test('повертає порожній масив, якщо нічого не підходить', () => {
            const result = service.filterEvents(events, 50, 0);
            expect(result).toHaveLength(0);
        });

        test('повертає всі, якщо ліміти максимальні', () => {
            const result = service.filterEvents(events, 10000, 0);
            expect(result).toHaveLength(3);
        });

        test('помилка: events не є масивом', () => {
            expect(() => service.filterEvents('not-array', 500, 5))
                .toThrow(TypeError);
        });

        test('помилка: від\'ємна максимальна ціна', () => {
            expect(() => service.filterEvents(events, -1, 5))
                .toThrow(RangeError);
        });

        test('помилка: від\'ємне minAvailableSpots', () => {
            expect(() => service.filterEvents(events, 500, -1))
                .toThrow(TypeError);
        });

        test('помилка: minAvailableSpots не число', () => {
            expect(() => service.filterEvents(events, 500, 'abc'))
                .toThrow(TypeError);
        });

        test('помилка: minAvailableSpots = NaN', () => {
            expect(() => service.filterEvents(events, 500, NaN))
                .toThrow(TypeError);
        });
    });

    // ──────────────────────────────────────────
    // Перевірка ієрархії ролей
    // ──────────────────────────────────────────
    describe('Ієрархія ролей (canCreateTours)', () => {
        test('PlatformUser не може створювати тури', () => {
            expect(new PlatformUser('id').canCreateTours()).toBe(false);
        });

        test('Visitor не може створювати тури', () => {
            expect(new Visitor('id').canCreateTours()).toBe(false);
        });

        test('Participant не може створювати тури', () => {
            expect(new Participant('id').canCreateTours()).toBe(false);
        });

        test('Organizer може створювати тури', () => {
            expect(new Organizer('id').canCreateTours()).toBe(true);
        });

        test('Moderator не може створювати тури', () => {
            expect(new Moderator('id').canCreateTours()).toBe(false);
        });
    });

    // ──────────────────────────────────────────
    // EventSession
    // ──────────────────────────────────────────
    describe('EventSession', () => {
        test('getAvailableSpots повертає коректне значення', () => {
            const session = new EventSession('1', 'Тест', 100, 10);
            expect(session.getAvailableSpots()).toBe(10);

            session.registerParticipant(new Participant('u1'));
            expect(session.getAvailableSpots()).toBe(9);
        });

        test('registerParticipant додає учасника', () => {
            const session = new EventSession('1', 'Тест', 100, 10);
            session.registerParticipant(new Participant('u1'));
            expect(session.registeredUsers).toHaveLength(1);
        });
    });
});
