const { Participant, EventSession, Organizer, EventService } = require('./EventService');

describe('EventService', () => {
    let service;

    beforeEach(() => {
        service = new EventService();
    });

    describe('Method: filterEvents', () => {
        test('1. Позитивний: Правильна фільтрація масиву подій', () => {
            const events = [
                { id: 1, maxCapacity: 50, organizerId: 1 },
                { id: 2, maxCapacity: 150, organizerId: 1 },
                { id: 3, maxCapacity: 50, organizerId: 2 }
            ];
            const result = service.filterEvents(events, 100, 1);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        test('2. Негативний (EP): Передача null замість масиву -> помилка', () => {
            expect(() => service.filterEvents(null, 100, 1)).toThrow("Очікується масив подій");
        });

        test('3. Негативний (EP): Передача undefined замість масиву -> помилка', () => {
            expect(() => service.filterEvents(undefined, 100, 1)).toThrow("Очікується масив подій");
        });

        test('4. Негативний (EP): Передача об\'єкта {} замість масиву -> помилка', () => {
            expect(() => service.filterEvents({}, 100, 1)).toThrow("Очікується масив подій");
        });
    });

    describe('Method: applyForParticipation (Edge Cases & Type Coercion)', () => {
        test('5. Позитивний (BVA): Вік передано як десятковий дріб (25.5) -> успіх', () => {
            const p = new Participant(1);
            const s = new EventSession(1, "Physics", 0, 10);
            const result = service.applyForParticipation(p, s, 25.5);
            expect(result).toBe(true);
        });

        test('6. Негативний (BVA): Вік передано як Infinity -> помилка (RangeError)', () => {
            const p = new Participant(1);
            const s = new EventSession(1, "Physics", 0, 10);
            expect(() => service.applyForParticipation(p, s, Infinity)).toThrow(RangeError);
        });

        test('7. Позитивний (EP): Учасник з ID-рядком ("1") не конфліктує з числовим ID (1)', () => {
            const p1 = new Participant(1);
            const p2 = new Participant("1");
            const s = new EventSession(1, "Physics", 0, 10);
            service.applyForParticipation(p1, s, 20);
            const result = service.applyForParticipation(p2, s, 20);
            expect(result).toBe(true);
        });

        test('8. Негативний (EP): Об\'єкт Session не має властивості registeredUsers -> TypeError', () => {
            const p = new Participant(1);
            const s = { id: 1, maxCapacity: 10 };
            expect(() => service.applyForParticipation(p, s, 20)).toThrow(TypeError);
        });

        test('9. Негативний (EP): Учасник без id (undefined) -> помилка при другій реєстрації', () => {
            const p1 = new Participant(); 
            const p2 = new Participant(); 
            const s = new EventSession(1, "Physics", 0, 10);
            service.applyForParticipation(p1, s, 20);
            expect(() => service.applyForParticipation(p2, s, 20)).toThrow("вже зареєстрований");
        });
    });

    describe('Method: createPaidTour (Edge Cases & Type Coercion)', () => {
        test('10. Негативний (EP): Назва передана як число (123) -> помилка (TypeError)', () => {
            const org = new Organizer(1);
            expect(() => service.createPaidTour(org, 123, 500, 20)).toThrow(TypeError);
        });

        test('11. Негативний (EP): Назва передана як об\'єкт ({}) -> помилка (TypeError)', () => {
            const org = new Organizer(1);
            expect(() => service.createPaidTour(org, {}, 500, 20)).toThrow(TypeError);
        });

        test('12. Негативний (BVA): Назва містить лише символ нового рядка (\\n) -> помилка', () => {
            const org = new Organizer(1);
            expect(() => service.createPaidTour(org, "\n", 500, 20)).toThrow("Назва не може бути порожньою");
        });

        test('13. Позитивний (EP): Успішне створення туру', () => {
            const org = new Organizer(1);
            const tour = service.createPaidTour(org, "   Cyber Tour   ", 1000, 50);
            expect(tour.title).toBe("Cyber Tour");
            expect(tour.organizerId).toBe(1);
        });
    });
});