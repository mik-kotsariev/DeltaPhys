const express = require('express');
const {
    Participant,
    Organizer,
    DeltaPhysService,
    EventSession,
    CONFIG
} = require('./deltaPhysService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсингу JSON-тіла запитів
app.use(express.json());

// Статичні файли (лендинг-сторінка)
app.use(express.static('public'));

// Ін-меморі сховище створених сесій (для демонстрації)
const sessions = new Map();

// Єдиний екземпляр сервісу бізнес-логіки
const service = new DeltaPhysService();

// ──────────────────────────────────────────────
// GET /health — перевірка працездатності сервера
// ──────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

// ──────────────────────────────────────────────
// POST /api/tours/create — створення платного туру
// ──────────────────────────────────────────────
// Тіло запиту (JSON):
// {
//   "organizerId": "org-1",
//   "name": "Екскурсія по Києву",
//   "price": 500,
//   "maxCapacity": 30
// }
app.post('/api/tours/create', (req, res) => {
    try {
        const { organizerId, name, price, maxCapacity } = req.body;

        if (!organizerId) {
            return res.status(400).json({ error: 'Поле "organizerId" є обов\'язковим.' });
        }

        // Створюємо об'єкт Organizer для виклику бізнес-логіки
        const organizer = new Organizer(organizerId);
        const session = service.createPaidTour(organizer, name, price, maxCapacity);

        // Зберігаємо сесію в ін-меморі сховище для подальшої роботи
        sessions.set(session.id, session);

        res.status(201).json({
            message: 'Тур успішно створено.',
            tour: {
                id: session.id,
                name: session.name,
                price: session.price,
                maxCapacity: session.maxCapacity,
                availableSpots: session.getAvailableSpots()
            }
        });
    } catch (err) {
        const statusCode = (err instanceof RangeError || err instanceof TypeError) ? 422 : 400;
        res.status(statusCode).json({ error: err.message });
    }
});

// ──────────────────────────────────────────────
// POST /api/sessions/register — реєстрація учасника на сесію
// ──────────────────────────────────────────────
// Тіло запиту (JSON):
// {
//   "participantId": "user-42",
//   "sessionId": "<UUID сесії>",
//   "age": 25
// }
app.post('/api/sessions/register', (req, res) => {
    try {
        const { participantId, sessionId, age } = req.body;

        if (!participantId || !sessionId || age === undefined) {
            return res.status(400).json({
                error: 'Поля "participantId", "sessionId" та "age" є обов\'язковими.'
            });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: `Сесію з id "${sessionId}" не знайдено.` });
        }

        const participant = new Participant(participantId);
        service.applyForParticipation(participant, session, age);

        res.status(200).json({
            message: 'Учасника успішно зареєстровано.',
            session: {
                id: session.id,
                name: session.name,
                availableSpots: session.getAvailableSpots(),
                registeredCount: session.registeredUsers.length
            }
        });
    } catch (err) {
        const statusCode = (err instanceof RangeError || err instanceof TypeError) ? 422 : 400;
        res.status(statusCode).json({ error: err.message });
    }
});

// ──────────────────────────────────────────────
// GET /api/tours — список усіх створених турів
// ──────────────────────────────────────────────
app.get('/api/tours', (_req, res) => {
    const tours = Array.from(sessions.values()).map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        maxCapacity: s.maxCapacity,
        availableSpots: s.getAvailableSpots(),
        registeredCount: s.registeredUsers.length
    }));

    res.status(200).json({ tours });
});

// ──────────────────────────────────────────────
// GET /api/config — повертає конфігурацію лімітів
// ──────────────────────────────────────────────
app.get('/api/config', (_req, res) => {
    res.status(200).json({ config: CONFIG });
});

// Запуск серверу
app.listen(PORT, () => {
    console.log(`DeltaPhys API сервер запущено на порту ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
