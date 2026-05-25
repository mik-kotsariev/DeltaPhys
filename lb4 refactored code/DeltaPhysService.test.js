const { Visitor, Participant, Organizer, EventSession, DeltaPhysService } = require('./DeltaPhysService');

describe('DeltaPhysService Tests - Lab 3 & 4 (Refactored)', () => {
    let service;

    beforeEach(() => {
        service = new DeltaPhysService();
    });

    test('applyForParticipation_ValidAge_ReturnsTrue', () => {
        const participant = new Participant(1);
        const session = new EventSession(1, "Симуляція фізичного поля (3 точки)", 0, 10);

        const result = service.applyForParticipation(participant, session, 25);

        expect(result).toBe(true);
        expect(session.registeredUsers).toContain(participant);
    });

    test('applyForParticipation_AgeUnder16_ThrowsException', () => {
        const participant = new Participant(1);
        const session = new EventSession(1, "Семінар", 0, 10);
    
        expect(() => service.applyForParticipation(participant, session, 15)).toThrow(RangeError);
    });

    test('applyForParticipation_AgeExactly16_ReturnsTrue', () => {
        const participant = new Participant(1);
        const session = new EventSession(1, "Семінар", 0, 10);
     
        const result = service.applyForParticipation(participant, session, 16);
     
        expect(result).toBe(true);
    });

    test('applyForParticipation_AgeExactly99_ReturnsTrue', () => {
        const participant = new Participant(1);
        const session = new EventSession(1, "Семінар", 0, 10);

        const result = service.applyForParticipation(participant, session, 99);

        expect(result).toBe(true);
    });

    test('applyForParticipation_AgeOver99_ThrowsException', () => {
        const participant = new Participant(1);
        const session = new EventSession(1, "Семінар", 0, 10);

        expect(() => service.applyForParticipation(participant, session, 100)).toThrow(RangeError);
    });

    test('applyForParticipation_SessionFull_ThrowsException', () => {
        const participant1 = new Participant(1);
        const participant2 = new Participant(2);
        const session = new EventSession(1, "Ексклюзивний воркшоп", 0, 1);
        
        session.registerParticipant(participant1);

        expect(() => service.applyForParticipation(participant2, session, 20)).toThrow("Немає вільних місць у сесії.");
    });

    test('createPaidTour_ValidData_ReturnsSession', () => {
        const organizer = new Organizer(1);

        const session = service.createPaidTour(organizer, "Фізичний тур", 500, 20);

        expect(session).not.toBeNull();
        expect(session.name).toBe("Фізичний тур");
        expect(session.price).toBe(500);
        expect(typeof session.id).toBe('string');
        expect(session.id.length).toBeGreaterThan(10);
    });

    test('createPaidTour_PriceUnder50_ThrowsException', () => {
        const organizer = new Organizer(1);

        expect(() => service.createPaidTour(organizer, "Тур", 49, 20)).toThrow(RangeError);
    });

    test('createPaidTour_CapacityOver100_ThrowsException', () => {
        const organizer = new Organizer(1);

        expect(() => service.createPaidTour(organizer, "Тур", 100, 101)).toThrow(RangeError);
    });

    test('filterEvents_MatchesCriteria_ReturnsFilteredList', () => {
        const events = [
            new EventSession(1, "Дешева подія", 40, 10),
            new EventSession(2, "Дорога подія", 100, 10)
        ];

        const result = service.filterEvents(events, 50, 1);

        expect(result).toHaveLength(1);
        expect(result[0].price).toBe(40);
    });

    test('filterEvents_NegativePrice_ThrowsException', () => {
        const events = [];

        expect(() => service.filterEvents(events, -10, 1)).toThrow(RangeError);
    });

    test('filterEvents_InvalidMinSpots_ThrowsException', () => {
        const events = [
            new EventSession(1, "Подія", 50, 10)
        ];

        expect(() => service.filterEvents(events, 100, undefined)).toThrow();
        expect(() => service.filterEvents(events, 100, -5)).toThrow();
        expect(() => service.filterEvents(events, 100, "5")).toThrow();
    });

    // --- НОВІ ТЕСТИ ДЛЯ 100% ПОКРИТТЯ ---

    test('applyForParticipation_NullArguments_ThrowsException', () => {
        const session = new EventSession(1, "Тест", 0, 10);
        expect(() => service.applyForParticipation(null, session, 20)).toThrow("Учасник або сесія не можуть бути null/undefined.");
        expect(() => service.applyForParticipation(new Participant(1), null, 20)).toThrow("Учасник або сесія не можуть бути null/undefined.");
    });

    test('applyForParticipation_UserAlreadyRegistered_ThrowsException', () => {
        const participant = new Participant(1);
        const session = new EventSession(1, "Тест", 0, 10);
        
        service.applyForParticipation(participant, session, 25);
        
        expect(() => service.applyForParticipation(participant, session, 25)).toThrow("Користувач вже зареєстрований.");
    });

    test('createPaidTour_NotOrganizer_ThrowsException', () => {
        const visitor = new Visitor(1); 
        expect(() => service.createPaidTour(visitor, "Тур", 500, 20)).toThrow("Тільки організатор може створювати платні тури.");
        expect(() => service.createPaidTour(null, "Тур", 500, 20)).toThrow();
    });

    test('createPaidTour_EmptyName_ThrowsException', () => {
        const organizer = new Organizer(1);
        expect(() => service.createPaidTour(organizer, "", 500, 20)).toThrow("Назва не може бути порожньою.");
        expect(() => service.createPaidTour(organizer, "   ", 500, 20)).toThrow("Назва не може бути порожньою.");
    });

    test('filterEvents_NotArray_ThrowsException', () => {
        expect(() => service.filterEvents("not an array", 50, 1)).toThrow("Очікується масив подій.");
    });
});