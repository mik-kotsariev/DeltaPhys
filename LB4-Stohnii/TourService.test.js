const { TourService, Organizer, Moderator } = require('./TourService');

describe('TourService - Валідація створення туру', () => {
    let service;
    let org;

    beforeEach(() => {
        service = new TourService();
        org = new Organizer(1);
    });

    test('24. Негативний: Модератор -> помилка', () => {
        const mod = new Moderator(1);
        
        expect(() => service.createPaidTour(mod, { title: "Тур", price: 500, maxCapacity: 20 })).toThrow();
    });

    test('25. BVA: Ціна 49 (нижче мінімуму) -> помилка', () => {
        expect(() => service.createPaidTour(org, { title: "Тур", price: 49, maxCapacity: 20 })).toThrow(RangeError);
    });

    test('26. BVA: Ціна 50 (мінімум) -> успіх', () => {
        const testPrice = 50;
        const s = service.createPaidTour(org, { title: "Тур", price: testPrice, maxCapacity: 20 });
        expect(s.price).toBe(testPrice);
    });

    test('27. BVA: Ціна 51 (трохи вище мінімуму) -> успіх', () => {
        const s = service.createPaidTour(org, { title: "Тур", price: 51, maxCapacity: 20 });
        expect(s).toBeDefined();
    });

    test('28. BVA: Ціна 4999 (трохи нижче максимуму) -> успіх', () => {
        const s = service.createPaidTour(org, { title: "Тур", price: 4999, maxCapacity: 20 });
        expect(s).toBeDefined();
    });

    test('29. BVA: Ціна 5000 (максимум) -> успіх', () => {
        const testPrice = 5000;
        const s = service.createPaidTour(org, { title: "Тур", price: testPrice, maxCapacity: 20 });
        expect(s.price).toBe(testPrice);
    });

    test('30. BVA: Ціна 5001 (вище максимуму) -> помилка', () => {
        expect(() => service.createPaidTour(org, { title: "Тур", price: 5001, maxCapacity: 20 })).toThrow(RangeError);
    });

    test('31. BVA: Місткість 4 (нижче мінімуму) -> помилка', () => {
        expect(() => service.createPaidTour(org, { title: "Тур", price: 500, maxCapacity: 4 })).toThrow(RangeError);
    });

    test('32. BVA: Місткість 5 (мінімум) -> успіх', () => {
        const testCapacity = 5;
        const s = service.createPaidTour(org, { title: "Тур", price: 500, maxCapacity: testCapacity });
        expect(s.maxCapacity).toBe(testCapacity);
    });

    test('33. BVA: Місткість 100 (максимум) -> успіх', () => {
        const testCapacity = 100;
        const s = service.createPaidTour(org, { title: "Тур", price: 500, maxCapacity: testCapacity });
        expect(s.maxCapacity).toBe(testCapacity);
    });

    test('34. BVA: Місткість 101 (вище максимуму) -> помилка', () => {
        expect(() => service.createPaidTour(org, { title: "Тур", price: 500, maxCapacity: 101 })).toThrow(RangeError);
    });
});