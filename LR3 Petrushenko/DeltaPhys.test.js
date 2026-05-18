const { Participant, EventSession, PaidTour, EventService } = require('./DeltaPhys');

describe('EventService', () => {
    let service;
    let org = "TestOrg";

    beforeEach(() => {
        service = new EventService();
    });

    describe('Method: createPaidTour', () => {
        test('36. Негативний: Назва з самих пробілів ("   ") -> помилка', () => {
            expect(() => service.createPaidTour(org, "   ", 500, 20)).toThrow("Назва не може бути порожньою");
        });

        test('37. Негативний: Назва null -> помилка', () => {
            expect(() => service.createPaidTour(org, null, 500, 20)).toThrow();
        });

        test('38. Type: Передача десяткової ціни (наприклад, 500.50) -> успіх', () => {
            const s = service.createPaidTour(org, "Тур", 500.50, 20);
            expect(s.price).toBe(500.50);
        });
    });

    describe('Method: filterEvents', () => {
        let eventsList;

        beforeEach(() => {
            const ev1 = new EventSession(1, "Event 1", 100, 10);
            const ev2 = new EventSession(2, "Event 2", 200, 5);
            const ev3 = new EventSession(3, "Event 3", 50, 2);
            
            ev3.registeredUsers.push(new Participant(1), new Participant(2)); 
            
            eventsList = [ev1, ev2, ev3];
        });

        test('39. EP: Фільтр знаходить подію, що відповідає обом критеріям', () => {
            const result = service.filterEvents(eventsList, 150, 4);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        test('40. EP: Фільтр відкидає через зависоку ціну, хоча місця є', () => {
            const result = service.filterEvents(eventsList, 90, 4);
            expect(result).toHaveLength(0);
        });

        test('41. EP: Фільтр відкидає через нестачу місць, хоча ціна підходить', () => {
            const result = service.filterEvents(eventsList, 200, 6);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });

        test('42. EP: Жодна подія не має вільних місць (Event 3)', () => {
            const result = service.filterEvents([eventsList[2]], 100, 1);
            expect(result).toHaveLength(0);
        });

        test('43. BVA: Точний збіг максимальної ціни', () => {
    const result = service.filterEvents(eventsList, 100, 1);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
        });

        test('44. BVA: maxPrice = 0 (пошук безкоштовних подій)', () => {
            const result = service.filterEvents(eventsList, 0, 1);
            expect(result).toHaveLength(0);
        });

        test('45. Негативний: Від\'ємна ціна фільтру (-10) -> помилка', () => {
            expect(() => service.filterEvents(eventsList, -10, 1)).toThrow(RangeError);
        });

        test('46. BVA: Мінімальна кількість місць = 0 (повертає всі за ціною, навіть заповнені)', () => {
            const result = service.filterEvents(eventsList, 60, 0);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(3);
        });

        test('47. EP: Передача порожнього масиву -> повертає порожній масив', () => {
            const result = service.filterEvents([], 100, 1);
            expect(result).toEqual([]);
        });
    });
});