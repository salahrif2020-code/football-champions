// ============================================
// Football Champions - Cleanup Seed Data
// ============================================
// يحذف بيانات Seed القديمة (بطولات، فرق، لاعبين، مباريات)
// يُبقي بيانات API

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// معرّفات البطولات القديمة (من Seed)
const OLD_COMPETITION_IDS = ['ucl', 'epl', 'laliga', 'bundesliga', 'seriea', 'ligue1'];

// معرّفات الفرق القديمة (من Seed)
const OLD_TEAM_IDS = [
  'rma', 'bar', 'atm',
  'mci', 'liv', 'ars',
  'bay', 'bvb',
  'int', 'juv', 'acm',
  'psg', 'om',
  'slb', 'aja', 'por',
];

async function cleanup() {
  console.log('🧹 بدء التنظيف...\n');

  // ========== 1. احذف المباريات القديمة ==========
  console.log('⚽ حذف المباريات القديمة...');
  const deletedMatches = await prisma.match.deleteMany({
    where: {
      OR: [
        { homeTeamId: { in: OLD_TEAM_IDS } },
        { awayTeamId: { in: OLD_TEAM_IDS } },
      ],
    },
  });
  console.log(`   ✅ حُذفت ${deletedMatches.count} مباراة قديمة\n`);

  // ========== 2. احذف اللاعبين ==========
  console.log('👤 حذف اللاعبين القديمين...');
  const deletedPlayers = await prisma.player.deleteMany({});
  console.log(`   ✅ حُذف ${deletedPlayers.count} لاعب\n`);

  // ========== 3. احذف الفرق القديمة ==========
  console.log('👥 حذف الفرق القديمة...');
  const deletedTeams = await prisma.team.deleteMany({
    where: { id: { in: OLD_TEAM_IDS } },
  });
  console.log(`   ✅ حُذف ${deletedTeams.count} فريق قديم\n`);

  // ========== 4. احذف البطولات القديمة ==========
  console.log('🏆 حذف البطولات القديمة...');
  const deletedCompetitions = await prisma.competition.deleteMany({
    where: { id: { in: OLD_COMPETITION_IDS } },
  });
  console.log(`   ✅ حُذفت ${deletedCompetitions.count} بطولة قديمة\n`);

  // ========== 5. تحقق من النتيجة ==========
  console.log('📊 الإحصائيات بعد التنظيف:');
  const [compCount, teamCount, matchCount, playerCount] = await Promise.all([
    prisma.competition.count(),
    prisma.team.count(),
    prisma.match.count(),
    prisma.player.count(),
  ]);

  console.log(`   🏆 بطولات: ${compCount}`);
  console.log(`   👥 فرق: ${teamCount}`);
  console.log(`   ⚽ مباريات: ${matchCount}`);
  console.log(`   👤 لاعبين: ${playerCount}`);

  console.log('\n🎉 التنظيف اكتمل!');
}

cleanup()
  .catch((error) => {
    console.error('❌ خطأ:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });