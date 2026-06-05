const { Visitor, Participant, Organizer, EventSession, DeltaPhysService } = require('./DeltaPhysService');

describe('DeltaPhys Platform Tests', () => {
    let service;

    beforeEach(() => {
        service = new DeltaPhysService();
    });

    describe('Method: applyForParticipation', () => {
        test('12. BVA: Реєстрація на останнє вільне місце -> успіх', () => {
            const p1 = new Participant(1);
            const p2 = new Participant(2);
            const s = new EventSession(1, "Семінар", 0, 2);
            service.applyForParticipation(p1, s, 20);
            expect(service.applyForParticipation(p2, s, 20)).toBe(true);
        });

        test('13. BVA: Реєстрація, коли місць 0 -> помилка', () => {
            const p = new Participant(1);
            const s = new EventSession(1, "Семінар", 0, 0);
            expect(() => service.applyForParticipation(p, s, 20)).toThrow("Немає вільних місць");
        });

        test('14. BVA: Реєстрація понад ліміт (1 місце, 2 учасника) -> помилка', () => {
            const p1 = new Participant(1);
            const p2 = new Participant(2);
            const s = new EventSession(1, "Семінар", 0, 1);
            service.applyForParticipation(p1, s, 20);
            expect(() => service.applyForParticipation(p2, s, 20)).toThrow("Немає вільних місць");
        });

        test('15. EP: Повторна реєстрація того ж учасника -> помилка', () => {
            const p = new Participant(1);
            const s = new EventSession(1, "Семінар", 0, 10);
            service.applyForParticipation(p, s, 20);
            expect(() => service.applyForParticipation(p, s, 20)).toThrow("вже зареєстрований");
        });

        test('16. Негативний: Учасник null -> помилка', () => {
            const s = new EventSession(1, "Семінар", 0, 10);
            expect(() => service.applyForParticipation(null, s, 20)).toThrow("не можуть бути null");
        });

        test('20. EP: Реєстрація різних об\'єктів учасників з однаковим ID -> помилка', () => {
            const p1 = new Participant(100);
            const p2 = new Participant(100);
            const s = new EventSession(1, "Physics Simulation", 0, 10);
            service.applyForParticipation(p1, s, 20);
            expect(() => service.applyForParticipation(p2, s, 20)).toThrow("вже зареєстрований");
        });
    });

    describe('Method: createPaidTour', () => {
        const org = new Organizer(1);

        test('21. EP: Валідний Організатор створює тур -> повертає EventSession', () => {
            const session = service.createPaidTour(org, "Тур", 500, 20);
            expect(session).toBeInstanceOf(EventSession);
        });

        test('22. Негативний: Звичайний Учасник (не Організатор) -> помилка', () => {
            const participant = new Participant(1);
            expect(() => service.createPaidTour(participant, "Тур", 500, 20)).toThrow();
        });

        test('23. Негативний: Відвідувач (Visitor) -> помилка', () => {
            const visitor = new Visitor(1);
            expect(() => service.createPaidTour(visitor, "Тур", 500, 20)).toThrow();
        });

        test('BVA: Назва занадто коротка', () => {
            expect(() => service.createPaidTour(org, "А", 500, 20)).toThrow("коротка");
        });
    });
});