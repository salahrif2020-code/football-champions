// ============================================
// Football Champions - Backend Server
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// CORS — يقبل من localhost + Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.includes('vercel.app')) return callback(null, true);
    if (origin.includes('render.com')) return callback(null, true);
    return callback(null, true); // للتطوير — في الإنتاج، يمكنك تقييدها
  },
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ============================================
// Helpers
// ============================================

function normalizeCode(code) {
  if (!code) return code;
  return { upper: code.toUpperCase(), lower: code.toLowerCase() };
}

// ============================================
// Routes
// ============================================

app.get('/', (req, res) => {
  res.json({
    message: '⚽ مرحباً بك في Football Champions API!',
    version: '2.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', async (req, res) => {
  try {
    const [compCount, teamCount, matchCount] = await Promise.all([
      prisma.competition.count(),
      prisma.team.count(),
      prisma.match.count(),
    ]);
    res.json({
      status: 'OK',
      uptime: process.uptime(),
      database: {
        competitions: compCount,
        teams: teamCount,
        matches: matchCount,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// ============================================
// COMPETITIONS
// ============================================

app.get('/api/competitions', async (req, res) => {
  try {
    const competitions = await prisma.competition.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        shortName: true,
        country: true,
        emblem: true,
        type: true,
        currentSeason: true,
        seasonStart: true,
        seasonEnd: true,
        currentMatchday: true,
        _count: { select: { teams: true, matches: true } },
      },
    });
    res.json({ success: true, count: competitions.length, data: competitions });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/competitions/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { upper, lower } = normalizeCode(code);
    const competition = await prisma.competition.findFirst({
      where: { OR: [{ code: upper }, { code: lower }, { id: upper }, { id: lower }] },
      include: { _count: { select: { teams: true, matches: true } } },
    });
    if (!competition) {
      return res.status(404).json({ success: false, error: 'البطولة غير موجودة' });
    }
    res.json({ success: true, data: competition });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/competitions/:code/teams', async (req, res) => {
  try {
    const { code } = req.params;
    const { upper, lower } = normalizeCode(code);
    const competition = await prisma.competition.findFirst({
      where: { OR: [{ code: upper }, { code: lower }, { id: upper }, { id: lower }] },
    });
    if (!competition) {
      return res.status(404).json({ success: false, error: 'البطولة غير موجودة' });
    }
    const teams = await prisma.team.findMany({
      where: { competitionId: competition.id },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, count: teams.length, data: teams });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/competitions/:code/matches', async (req, res) => {
  try {
    const { code } = req.params;
    const { upper, lower } = normalizeCode(code);
    const { status, limit } = req.query;
    const competition = await prisma.competition.findFirst({
      where: { OR: [{ code: upper }, { code: lower }, { id: upper }, { id: lower }] },
    });
    if (!competition) {
      return res.status(404).json({ success: false, error: 'البطولة غير موجودة' });
    }
    const where = { competitionId: competition.id };
    if (status) where.status = status;
    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
      },
      orderBy: { matchDate: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });
    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// TEAMS
// ============================================

app.get('/api/teams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: { competition: true },
    });
    if (!team) {
      return res.status(404).json({ success: false, error: 'الفريق غير موجود' });
    }
    res.json({ success: true, data: team });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/teams/:id/matches', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, limit = 100 } = req.query;
    const where = { OR: [{ homeTeamId: id }, { awayTeamId: id }] };
    if (status) where.status = status;
    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        competition: { select: { id: true, name: true, code: true, emblem: true } },
      },
      orderBy: { matchDate: 'asc' },
      take: parseInt(limit),
    });
    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// MATCHES
// ============================================

app.get('/api/matches', async (req, res) => {
  try {
    const { status, competitionId, from, to, limit } = req.query;
    const where = {};
    if (status) where.status = status;
    if (competitionId) where.competitionId = competitionId;
    if (from || to) {
      where.matchDate = {};
      if (from) where.matchDate.gte = new Date(from);
      if (to) where.matchDate.lte = new Date(to);
    }
    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        competition: { select: { id: true, name: true, code: true, emblem: true } },
      },
      orderBy: { matchDate: 'desc' },
      take: limit ? parseInt(limit) : 50,
    });
    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/matches/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const matches = await prisma.match.findMany({
      where: { matchDate: { gte: today, lt: tomorrow } },
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        competition: { select: { id: true, name: true, code: true, emblem: true } },
      },
      orderBy: { matchDate: 'asc' },
    });
    res.json({ success: true, count: matches.length, data: matches, date: today.toISOString().split('T')[0] });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/matches/tomorrow', async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    const matches = await prisma.match.findMany({
      where: { matchDate: { gte: tomorrow, lt: dayAfter } },
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        competition: { select: { id: true, name: true, code: true, emblem: true } },
      },
      orderBy: { matchDate: 'asc' },
    });
    res.json({ success: true, count: matches.length, data: matches, date: tomorrow.toISOString().split('T')[0] });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/matches/live', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      where: { status: 'LIVE' },
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        competition: { select: { id: true, name: true, code: true, emblem: true } },
      },
      orderBy: { matchDate: 'desc' },
    });
    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/matches/upcoming', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const now = new Date();
    const later = new Date();
    later.setDate(later.getDate() + parseInt(days));
    const matches = await prisma.match.findMany({
      where: { status: 'SCHEDULED', matchDate: { gte: now, lte: later } },
      include: {
        homeTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        awayTeam: { select: { id: true, name: true, shortName: true, tla: true, crest: true } },
        competition: { select: { id: true, name: true, code: true, emblem: true } },
      },
      orderBy: { matchDate: 'asc' },
      take: 50,
    });
    res.json({ success: true, count: matches.length, data: matches });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: { homeTeam: true, awayTeam: true, competition: true },
    });
    if (!match) {
      return res.status(404).json({ success: false, error: 'المباراة غير موجودة' });
    }
    res.json({ success: true, data: match });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// SYNC
// ============================================

app.get('/api/sync/status', async (req, res) => {
  try {
    const logs = await prisma.syncLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ success: true, latest: logs });
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
  console.log(`🏆 البطولات: http://localhost:${PORT}/api/competitions`);
  console.log(`⚽ مباريات اليوم: http://localhost:${PORT}/api/matches/today`);
  console.log(`🔴 مباشر الآن: http://localhost:${PORT}/api/matches/live`);
  console.log('========================================');
});