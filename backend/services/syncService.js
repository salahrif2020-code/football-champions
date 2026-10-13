// ============================================
// Football Champions - Sync Service
// ============================================
// يزامن البيانات من football-data.org إلى Neon
// يستخدم Upsert لتجنب التكرار

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const api = require('./footballApi');

// ============================================
// مساعدات
// ============================================

/**
 * سجّل عملية مزامنة في قاعدة البيانات
 */
async function logSync(type, status, itemsProcessed, errorMessage = null, duration = null) {
  try {
    await prisma.syncLog.create({
      data: {
        type,
        status,
        itemsProcessed,
        errorMessage,
        duration,
      },
    });
  } catch (error) {
    console.error('فشل تسجيل SyncLog:', error.message);
  }
}

// ============================================
// مزامنة البطولات
// ============================================

/**
 * يزامن جميع البطولات
 * - يجلب من API
 * - يحفظ في Neon
 */
async function syncCompetitions() {
  const startTime = Date.now();
  console.log('\n🏆 مزامنة البطولات...');
  
  try {
    const competitions = await api.fetchCompetitions();
    console.log(`   📥 استلمنا ${competitions.length} بطولة من API`);
    
    // فلترة البطولات التي نريدها (الدوريات الكبرى)
    const WANTED_CODES = ['PL', 'PD', 'BL1', 'SA', 'FL1', 'CL', 'DED', 'PPL', 'BSA', 'ELC', 'EC', 'WC'];
    const filtered = competitions.filter(c => WANTED_CODES.includes(c.code));
    console.log(`   🎯 منها ${filtered.length} بطولة مهمة`);
    
    let saved = 0;
    for (const comp of filtered) {
      try {
        await prisma.competition.upsert({
          where: { code: comp.code },
          update: {
            apiId: comp.id,
            name: comp.name,
            shortName: comp.code,
            country: comp.area?.name || 'Unknown',
            emblem: comp.emblem,
            type: comp.type === 'CUP' ? 'CUP' : 'LEAGUE',
            seasonStart: comp.currentSeason?.startDate ? new Date(comp.currentSeason.startDate) : null,
            seasonEnd: comp.currentSeason?.endDate ? new Date(comp.currentSeason.endDate) : null,
            currentMatchday: comp.currentSeason?.currentMatchday || null,
            lastSyncedAt: new Date(),
          },
          create: {
            id: comp.code.toLowerCase(), // استخدام code كمعرّف
            apiId: comp.id,
            code: comp.code,
            name: comp.name,
            shortName: comp.code,
            country: comp.area?.name || 'Unknown',
            emblem: comp.emblem,
            type: comp.type === 'CUP' ? 'CUP' : 'LEAGUE',
            seasonStart: comp.currentSeason?.startDate ? new Date(comp.currentSeason.startDate) : null,
            seasonEnd: comp.currentSeason?.endDate ? new Date(comp.currentSeason.endDate) : null,
            currentMatchday: comp.currentSeason?.currentMatchday || null,
            currentSeason: comp.currentSeason?.startDate 
              ? `${comp.currentSeason.startDate.substring(0, 4)}/${comp.currentSeason.endDate.substring(2, 4)}`
              : null,
            lastSyncedAt: new Date(),
          },
        });
        saved++;
      } catch (err) {
        console.error(`   ❌ فشل حفظ ${comp.name}:`, err.message);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`   ✅ تم حفظ ${saved} بطولة`);
    await logSync('competitions', 'success', saved, null, duration);
    
    return { success: true, count: saved };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`   ❌ فشل:`, error.message);
    await logSync('competitions', 'failed', 0, error.message, duration);
    return { success: false, error: error.message };
  }
}

// ============================================
// مزامنة الفرق
// ============================================

/**
 * يزامن فرق بطولة معينة
 * @param {string} competitionCode - رمز البطولة (PL, PD...)
 */
async function syncTeams(competitionCode) {
  const startTime = Date.now();
  console.log(`\n👥 مزامنة فرق ${competitionCode}...`);
  
  try {
    // 1. تأكد أن البطولة موجودة في Neon
    const competition = await prisma.competition.findUnique({
      where: { code: competitionCode },
    });
    
    if (!competition) {
      throw new Error(`البطولة ${competitionCode} غير موجودة في Neon — زامن البطولات أولاً`);
    }
    
    // 2. اجلب الفرق من API
    const teams = await api.fetchTeamsByCompetition(competitionCode);
    console.log(`   📥 استلمنا ${teams.length} فريق`);
    
    let saved = 0;
    for (const team of teams) {
      try {
        await prisma.team.upsert({
          where: { apiId: team.id },
          update: {
            name: team.name,
            shortName: team.shortName,
            tla: team.tla,
            crest: team.crest,
            country: team.area?.name || competition.country,
            city: team.address?.split(',').slice(-1)[0]?.trim() || null,
            venue: team.venue,
            clubColors: team.clubColors,
            website: team.website,
            founded: team.founded || null,
            stadium: team.venue,
            lastSyncedAt: new Date(),
          },
          create: {
            id: `team_${team.id}`, // معرّف فريد
            apiId: team.id,
            name: team.name,
            shortName: team.shortName,
            tla: team.tla,
            crest: team.crest,
            country: team.area?.name || competition.country,
            city: team.address?.split(',').slice(-1)[0]?.trim() || null,
            venue: team.venue,
            stadium: team.venue,
            clubColors: team.clubColors,
            website: team.website,
            founded: team.founded || null,
            competitionId: competition.id,
            lastSyncedAt: new Date(),
          },
        });
        saved++;
      } catch (err) {
        console.error(`   ❌ فشل حفظ ${team.name}:`, err.message);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`   ✅ تم حفظ ${saved} فريق`);
    await logSync(`teams:${competitionCode}`, 'success', saved, null, duration);
    
    return { success: true, count: saved };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`   ❌ فشل:`, error.message);
    await logSync(`teams:${competitionCode}`, 'failed', 0, error.message, duration);
    return { success: false, error: error.message };
  }
}

// ============================================
// مزامنة المباريات
// ============================================

/**
 * يزامن مباريات بطولة معينة
 */
async function syncMatches(competitionCode, season = 2026) {
  const startTime = Date.now();
  console.log(`\n⚽ مزامنة مباريات ${competitionCode} (${season})...`);
  
  try {
    const competition = await prisma.competition.findUnique({
      where: { code: competitionCode },
    });
    
    if (!competition) {
      throw new Error(`البطولة ${competitionCode} غير موجودة في Neon`);
    }
    
    const matches = await api.fetchMatchesByCompetition(competitionCode, season);
    console.log(`   📥 استلمنا ${matches.length} مباراة`);
    
    let saved = 0;
    let skipped = 0;
    
    for (const match of matches) {
      try {
        // ابحث عن الفريقين في Neon
        const homeTeam = await prisma.team.findUnique({
          where: { apiId: match.homeTeam.id },
        });
        const awayTeam = await prisma.team.findUnique({
          where: { apiId: match.awayTeam.id },
        });
        
        // إذا لم نجد الفريقين، تخطَّ المباراة
        if (!homeTeam || !awayTeam) {
          skipped++;
          continue;
        }
        
        // استخرج النتيجة
        const homeScore = match.score?.fullTime?.home;
        const awayScore = match.score?.fullTime?.away;
        const halfTimeHome = match.score?.halfTime?.home;
        const halfTimeAway = match.score?.halfTime?.away;
        
        // حوّل الحالة من صيغة API إلى صيغتنا
        const status = mapStatus(match.status);
        
        await prisma.match.upsert({
          where: { apiId: match.id },
          update: {
            matchDate: new Date(match.utcDate),
            status,
            matchday: match.matchday,
            stadium: homeTeam.stadium,
            homeScore,
            awayScore,
            halfTimeHome,
            halfTimeAway,
            season: `${season}/${(season + 1).toString().substring(2)}`,
            lastSyncedAt: new Date(),
          },
          create: {
            id: `match_${match.id}`,
            apiId: match.id,
            matchDate: new Date(match.utcDate),
            status,
            matchday: match.matchday,
            stadium: homeTeam.stadium,
            homeScore,
            awayScore,
            halfTimeHome,
            halfTimeAway,
            season: `${season}/${(season + 1).toString().substring(2)}`,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            competitionId: competition.id,
            lastSyncedAt: new Date(),
          },
        });
        saved++;
      } catch (err) {
        console.error(`   ❌ فشل حفظ مباراة ${match.id}:`, err.message);
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`   ✅ تم حفظ ${saved} مباراة (تخطّينا ${skipped})`);
    await logSync(`matches:${competitionCode}`, 'success', saved, null, duration);
    
    return { success: true, count: saved, skipped };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`   ❌ فشل:`, error.message);
    await logSync(`matches:${competitionCode}`, 'failed', 0, error.message, duration);
    return { success: false, error: error.message };
  }
}

/**
 * يحوّل حالة المباراة من API إلى صيغتنا
 */
function mapStatus(apiStatus) {
  const map = {
    'SCHEDULED': 'SCHEDULED',
    'TIMED': 'SCHEDULED',
    'IN_PLAY': 'LIVE',
    'PAUSED': 'LIVE',
    'FINISHED': 'FINISHED',
    'SUSPENDED': 'POSTPONED',
    'POSTPONED': 'POSTPONED',
    'CANCELLED': 'CANCELLED',
    'AWARDED': 'FINISHED',
  };
  return map[apiStatus] || 'SCHEDULED';
}

// ============================================
// تصدير
// ============================================

module.exports = {
  syncCompetitions,
  syncTeams,
  syncMatches,
};