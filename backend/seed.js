// ============================================
// Football Champions - Seed Script
// ============================================

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء زرع البيانات...\n');

  // ========== البطولات ==========
  const competitions = [
    { id: 'ucl', name: 'UEFA Champions League', shortName: 'UCL', country: 'Europe', type: 'CUP', founded: 1955, currentSeason: '2024/25' },
    { id: 'epl', name: 'Premier League', shortName: 'EPL', country: 'England', type: 'LEAGUE', founded: 1992, currentSeason: '2024/25' },
    { id: 'laliga', name: 'La Liga', shortName: 'LALIGA', country: 'Spain', type: 'LEAGUE', founded: 1929, currentSeason: '2024/25' },
    { id: 'bundesliga', name: 'Bundesliga', shortName: 'BUNDESLIGA', country: 'Germany', type: 'LEAGUE', founded: 1963, currentSeason: '2024/25' },
    { id: 'seriea', name: 'Serie A', shortName: 'SERIEA', country: 'Italy', type: 'LEAGUE', founded: 1898, currentSeason: '2024/25' },
    { id: 'ligue1', name: 'Ligue 1', shortName: 'LIGUE1', country: 'France', type: 'LEAGUE', founded: 1932, currentSeason: '2024/25' },
  ];

  console.log('📌 زرع البطولات...');
  for (const c of competitions) {
    await prisma.competition.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log(`   ✅ ${competitions.length} بطولات\n`);

  // ========== الفرق ==========
  const teams = [
    { id: 'rma', name: 'Real Madrid', shortName: 'RMA', country: 'Spain', city: 'Madrid', stadium: 'Santiago Bernabéu', founded: 1902, competitionId: 'laliga' },
    { id: 'bar', name: 'FC Barcelona', shortName: 'BAR', country: 'Spain', city: 'Barcelona', stadium: 'Spotify Camp Nou', founded: 1899, competitionId: 'laliga' },
    { id: 'atm', name: 'Atlético Madrid', shortName: 'ATM', country: 'Spain', city: 'Madrid', stadium: 'Metropolitano', founded: 1903, competitionId: 'laliga' },
    { id: 'mci', name: 'Manchester City', shortName: 'MCI', country: 'England', city: 'Manchester', stadium: 'Etihad Stadium', founded: 1880, competitionId: 'epl' },
    { id: 'liv', name: 'Liverpool', shortName: 'LIV', country: 'England', city: 'Liverpool', stadium: 'Anfield', founded: 1892, competitionId: 'epl' },
    { id: 'ars', name: 'Arsenal', shortName: 'ARS', country: 'England', city: 'London', stadium: 'Emirates Stadium', founded: 1886, competitionId: 'epl' },
    { id: 'bay', name: 'Bayern Munich', shortName: 'BAY', country: 'Germany', city: 'Munich', stadium: 'Allianz Arena', founded: 1900, competitionId: 'bundesliga' },
    { id: 'bvb', name: 'Borussia Dortmund', shortName: 'BVB', country: 'Germany', city: 'Dortmund', stadium: 'Signal Iduna Park', founded: 1909, competitionId: 'bundesliga' },
    { id: 'int', name: 'Inter Milan', shortName: 'INT', country: 'Italy', city: 'Milan', stadium: 'San Siro', founded: 1908, competitionId: 'seriea' },
    { id: 'juv', name: 'Juventus', shortName: 'JUV', country: 'Italy', city: 'Turin', stadium: 'Allianz Stadium', founded: 1897, competitionId: 'seriea' },
    { id: 'acm', name: 'AC Milan', shortName: 'ACM', country: 'Italy', city: 'Milan', stadium: 'San Siro', founded: 1899, competitionId: 'seriea' },
    { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', country: 'France', city: 'Paris', stadium: 'Parc des Princes', founded: 1970, competitionId: 'ligue1' },
    { id: 'om', name: 'Olympique de Marseille', shortName: 'OM', country: 'France', city: 'Marseille', stadium: 'Vélodrome', founded: 1899, competitionId: 'ligue1' },
    { id: 'slb', name: 'Benfica', shortName: 'SLB', country: 'Portugal', city: 'Lisbon', stadium: 'Estádio da Luz', founded: 1904, competitionId: 'ucl' },
    { id: 'aja', name: 'Ajax', shortName: 'AJA', country: 'Netherlands', city: 'Amsterdam', stadium: 'Johan Cruyff Arena', founded: 1900, competitionId: 'ucl' },
    { id: 'por', name: 'FC Porto', shortName: 'POR', country: 'Portugal', city: 'Porto', stadium: 'Estádio do Dragão', founded: 1893, competitionId: 'ucl' },
  ];

  console.log('📌 زرع الفرق...');
  for (const t of teams) {
    await prisma.team.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`   ✅ ${teams.length} فريق\n`);

  // ========== اللاعبون ==========
  const players = [
    // Real Madrid
    { id: 'jbellingham', name: 'Jude Bellingham', shortName: 'J. Bellingham', nationality: 'England', position: 'MF', number: 5, dateOfBirth: new Date('2003-06-29'), height: 186, weight: 75, teamId: 'rma' },
    { id: 'vjunior', name: 'Vinícius Júnior', shortName: 'Vini Jr', nationality: 'Brazil', position: 'FW', number: 7, dateOfBirth: new Date('2000-07-12'), height: 176, weight: 73, teamId: 'rma' },
    { id: 'lmodric', name: 'Luka Modrić', shortName: 'L. Modrić', nationality: 'Croatia', position: 'MF', number: 10, dateOfBirth: new Date('1985-09-09'), height: 172, weight: 66, teamId: 'rma' },
    { id: 'tcourtois', name: 'Thibaut Courtois', shortName: 'T. Courtois', nationality: 'Belgium', position: 'GK', number: 1, dateOfBirth: new Date('1992-05-11'), height: 200, weight: 96, teamId: 'rma' },
    { id: 'kmbappe', name: 'Kylian Mbappé', shortName: 'K. Mbappé', nationality: 'France', position: 'FW', number: 9, dateOfBirth: new Date('1998-12-20'), height: 178, weight: 75, teamId: 'rma' },

    // FC Barcelona
    { id: 'lyamal', name: 'Lamine Yamal', shortName: 'L. Yamal', nationality: 'Spain', position: 'FW', number: 19, dateOfBirth: new Date('2007-07-13'), height: 180, weight: 72, teamId: 'bar' },
    { id: 'rlewandowski', name: 'Robert Lewandowski', shortName: 'R. Lewandowski', nationality: 'Poland', position: 'FW', number: 9, dateOfBirth: new Date('1988-08-21'), height: 185, weight: 81, teamId: 'bar' },
    { id: 'ppedri', name: 'Pedri', shortName: 'Pedri', nationality: 'Spain', position: 'MF', number: 8, dateOfBirth: new Date('2002-11-25'), height: 174, weight: 68, teamId: 'bar' },
    { id: 'gavi', name: 'Gavi', shortName: 'Gavi', nationality: 'Spain', position: 'MF', number: 6, dateOfBirth: new Date('2004-08-05'), height: 173, weight: 68, teamId: 'bar' },
    { id: 'fterstegen', name: 'Marc-André ter Stegen', shortName: 'M. ter Stegen', nationality: 'Germany', position: 'GK', number: 1, dateOfBirth: new Date('1992-04-30'), height: 187, weight: 85, teamId: 'bar' },

    // Atlético Madrid
    { id: 'agriezmann', name: 'Antoine Griezmann', shortName: 'A. Griezmann', nationality: 'France', position: 'FW', number: 7, dateOfBirth: new Date('1991-03-21'), height: 176, weight: 73, teamId: 'atm' },
    { id: 'joblak', name: 'Jan Oblak', shortName: 'J. Oblak', nationality: 'Slovenia', position: 'GK', number: 13, dateOfBirth: new Date('1993-01-07'), height: 188, weight: 87, teamId: 'atm' },
    { id: 'kjulian', name: 'Julián Álvarez', shortName: 'J. Álvarez', nationality: 'Argentina', position: 'FW', number: 19, dateOfBirth: new Date('2000-01-31'), height: 170, weight: 71, teamId: 'atm' },

    // Manchester City
    { id: 'ehaaland', name: 'Erling Haaland', shortName: 'E. Haaland', nationality: 'Norway', position: 'FW', number: 9, dateOfBirth: new Date('2000-07-21'), height: 194, weight: 88, teamId: 'mci' },
    { id: 'kdebruyne', name: 'Kevin De Bruyne', shortName: 'K. De Bruyne', nationality: 'Belgium', position: 'MF', number: 17, dateOfBirth: new Date('1991-06-28'), height: 181, weight: 70, teamId: 'mci' },
    { id: 'rodri', name: 'Rodri', shortName: 'Rodri', nationality: 'Spain', position: 'MF', number: 16, dateOfBirth: new Date('1996-06-22'), height: 191, weight: 82, teamId: 'mci' },
    { id: 'efoden', name: 'Phil Foden', shortName: 'P. Foden', nationality: 'England', position: 'MF', number: 47, dateOfBirth: new Date('2000-05-28'), height: 171, weight: 69, teamId: 'mci' },

    // Liverpool
    { id: 'msalah', name: 'Mohamed Salah', shortName: 'M. Salah', nationality: 'Egypt', position: 'FW', number: 11, dateOfBirth: new Date('1992-06-15'), height: 175, weight: 71, teamId: 'liv' },
    { id: 'vvandijk', name: 'Virgil van Dijk', shortName: 'V. van Dijk', nationality: 'Netherlands', position: 'DF', number: 4, dateOfBirth: new Date('1991-07-08'), height: 193, weight: 92, teamId: 'liv' },
    { id: 'taa', name: 'Trent Alexander-Arnold', shortName: 'T. Alexander-Arnold', nationality: 'England', position: 'DF', number: 66, dateOfBirth: new Date('1998-10-07'), height: 175, weight: 69, teamId: 'liv' },

    // Arsenal
    { id: 'bsaka', name: 'Bukayo Saka', shortName: 'B. Saka', nationality: 'England', position: 'FW', number: 7, dateOfBirth: new Date('2001-09-05'), height: 178, weight: 72, teamId: 'ars' },
    { id: 'modegaard', name: 'Martin Ødegaard', shortName: 'M. Ødegaard', nationality: 'Norway', position: 'MF', number: 8, dateOfBirth: new Date('1998-12-17'), height: 178, weight: 68, teamId: 'ars' },

    // Bayern Munich
    { id: 'hkane', name: 'Harry Kane', shortName: 'H. Kane', nationality: 'England', position: 'FW', number: 9, dateOfBirth: new Date('1993-07-28'), height: 188, weight: 89, teamId: 'bay' },
    { id: 'jmusiala', name: 'Jamal Musiala', shortName: 'J. Musiala', nationality: 'Germany', position: 'MF', number: 42, dateOfBirth: new Date('2003-02-26'), height: 184, weight: 70, teamId: 'bay' },
    { id: 'mneuer', name: 'Manuel Neuer', shortName: 'M. Neuer', nationality: 'Germany', position: 'GK', number: 1, dateOfBirth: new Date('1986-03-27'), height: 193, weight: 92, teamId: 'bay' },

    // PSG
    { id: 'odembele', name: 'Ousmane Dembélé', shortName: 'O. Dembélé', nationality: 'France', position: 'FW', number: 10, dateOfBirth: new Date('1997-05-15'), height: 178, weight: 67, teamId: 'psg' },
    { id: 'vvitinha', name: 'Vitinha', shortName: 'Vitinha', nationality: 'Portugal', position: 'MF', number: 17, dateOfBirth: new Date('2000-02-13'), height: 172, weight: 64, teamId: 'psg' },

    // Inter Milan
    { id: 'llautaro', name: 'Lautaro Martínez', shortName: 'L. Martínez', nationality: 'Argentina', position: 'FW', number: 10, dateOfBirth: new Date('1997-08-22'), height: 174, weight: 72, teamId: 'int' },
  ];

  console.log('📌 زرع اللاعبين...');
  for (const p of players) {
    await prisma.player.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }
  console.log(`   ✅ ${players.length} لاعب\n`);

  // ========== المباريات ==========
  const matches = [
    // La Liga - منتهية
    {
      id: 'rma-bar-2024-10',
      homeTeamId: 'rma',
      awayTeamId: 'bar',
      competitionId: 'laliga',
      matchDate: new Date('2024-10-26T19:00:00Z'),
      status: 'FINISHED',
      matchday: 11,
      stadium: 'Santiago Bernabéu',
      homeScore: 3,
      awayScore: 1,
    },
    {
      id: 'bar-atm-2024-11',
      homeTeamId: 'bar',
      awayTeamId: 'atm',
      competitionId: 'laliga',
      matchDate: new Date('2024-11-03T20:00:00Z'),
      status: 'FINISHED',
      matchday: 12,
      stadium: 'Spotify Camp Nou',
      homeScore: 2,
      awayScore: 2,
    },
    // La Liga - مجدولة
    {
      id: 'atm-rma-2024-12',
      homeTeamId: 'atm',
      awayTeamId: 'rma',
      competitionId: 'laliga',
      matchDate: new Date('2024-12-15T20:00:00Z'),
      status: 'SCHEDULED',
      matchday: 17,
      stadium: 'Metropolitano',
      homeScore: null,
      awayScore: null,
    },
    {
      id: 'rma-bar-2025-01',
      homeTeamId: 'rma',
      awayTeamId: 'bar',
      competitionId: 'laliga',
      matchDate: new Date('2025-01-12T20:00:00Z'),
      status: 'SCHEDULED',
      matchday: 20,
      stadium: 'Santiago Bernabéu',
      homeScore: null,
      awayScore: null,
    },

    // Premier League - منتهية
    {
      id: 'mci-liv-2024-11',
      homeTeamId: 'mci',
      awayTeamId: 'liv',
      competitionId: 'epl',
      matchDate: new Date('2024-11-23T17:30:00Z'),
      status: 'FINISHED',
      matchday: 12,
      stadium: 'Etihad Stadium',
      homeScore: 2,
      awayScore: 0,
    },
    {
      id: 'liv-ars-2024-12',
      homeTeamId: 'liv',
      awayTeamId: 'ars',
      competitionId: 'epl',
      matchDate: new Date('2024-12-01T16:00:00Z'),
      status: 'FINISHED',
      matchday: 13,
      stadium: 'Anfield',
      homeScore: 2,
      awayScore: 2,
    },
    // Premier League - مجدولة
    {
      id: 'ars-mci-2024-12',
      homeTeamId: 'ars',
      awayTeamId: 'mci',
      competitionId: 'epl',
      matchDate: new Date('2024-12-22T17:30:00Z'),
      status: 'SCHEDULED',
      matchday: 17,
      stadium: 'Emirates Stadium',
      homeScore: null,
      awayScore: null,
    },

    // Bundesliga
    {
      id: 'bay-bvb-2024-11',
      homeTeamId: 'bay',
      awayTeamId: 'bvb',
      competitionId: 'bundesliga',
      matchDate: new Date('2024-11-30T17:30:00Z'),
      status: 'FINISHED',
      matchday: 12,
      stadium: 'Allianz Arena',
      homeScore: 3,
      awayScore: 0,
    },
    {
      id: 'bvb-bay-2024-12',
      homeTeamId: 'bvb',
      awayTeamId: 'bay',
      competitionId: 'bundesliga',
      matchDate: new Date('2024-12-28T17:30:00Z'),
      status: 'SCHEDULED',
      matchday: 15,
      stadium: 'Signal Iduna Park',
      homeScore: null,
      awayScore: null,
    },

    // Serie A
    {
      id: 'int-juv-2024-11',
      homeTeamId: 'int',
      awayTeamId: 'juv',
      competitionId: 'seriea',
      matchDate: new Date('2024-11-10T19:45:00Z'),
      status: 'FINISHED',
      matchday: 12,
      stadium: 'San Siro',
      homeScore: 4,
      awayScore: 4,
    },
    {
      id: 'juv-acm-2024-12',
      homeTeamId: 'juv',
      awayTeamId: 'acm',
      competitionId: 'seriea',
      matchDate: new Date('2024-12-07T19:45:00Z'),
      status: 'FINISHED',
      matchday: 15,
      stadium: 'Allianz Stadium',
      homeScore: 2,
      awayScore: 0,
    },

    // Ligue 1
    {
      id: 'psg-om-2024-10',
      homeTeamId: 'psg',
      awayTeamId: 'om',
      competitionId: 'ligue1',
      matchDate: new Date('2024-10-27T19:45:00Z'),
      status: 'FINISHED',
      matchday: 9,
      stadium: 'Parc des Princes',
      homeScore: 3,
      awayScore: 0,
    },

    // Champions League - مجدولة
    {
      id: 'rma-mci-ucl-2025-02',
      homeTeamId: 'rma',
      awayTeamId: 'mci',
      competitionId: 'ucl',
      matchDate: new Date('2025-02-11T20:00:00Z'),
      status: 'SCHEDULED',
      matchday: null,
      stadium: 'Santiago Bernabéu',
      homeScore: null,
      awayScore: null,
    },
    {
      id: 'bay-liv-ucl-2025-02',
      homeTeamId: 'bay',
      awayTeamId: 'liv',
      competitionId: 'ucl',
      matchDate: new Date('2025-02-12T20:00:00Z'),
      status: 'SCHEDULED',
      matchday: null,
      stadium: 'Allianz Arena',
      homeScore: null,
      awayScore: null,
    },
  ];

  console.log('📌 زرع المباريات...');
  for (const m of matches) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log(`   ✅ ${matches.length} مباراة\n`);

  console.log('🎉 تم زرع البيانات بنجاح!');
  console.log(`   📊 ${competitions.length} بطولات`);
  console.log(`   📊 ${teams.length} فريق`);
  console.log(`   📊 ${players.length} لاعب`);
  console.log(`   📊 ${matches.length} مباراة`);
}

main()
  .catch((error) => {
    console.error('❌ حدث خطأ:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });