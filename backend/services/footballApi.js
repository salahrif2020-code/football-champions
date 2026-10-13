// ============================================
// Football Champions - Football Data API Client
// ============================================
// يدير كل الاتصالات بـ football-data.org
// يحترم Rate Limit (10 طلبات/دقيقة)

const API_BASE_URL = process.env.FOOTBALL_API_URL || 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ FOOTBALL_API_KEY غير موجود في .env');
}

// ============================================
// Rate Limiter بسيط
// ============================================
// يضمن عدم تجاوز 10 طلبات في الدقيقة

const rateLimit = {
  requests: [],
  maxPerMinute: 9, // نترك 1 كهامش أمان
  
  async waitIfNeeded() {
    const now = Date.now();
    // احذف الطلبات الأقدم من دقيقة
    this.requests = this.requests.filter(t => now - t < 60000);
    
    if (this.requests.length >= this.maxPerMinute) {
      const oldest = this.requests[0];
      const waitTime = 60000 - (now - oldest) + 100;
      console.log(`⏱ Rate limit — انتظار ${Math.ceil(waitTime/1000)} ثانية`);
      await new Promise(r => setTimeout(r, waitTime));
      return this.waitIfNeeded();
    }
    
    this.requests.push(now);
  }
};

// ============================================
// دالة الاتصال الأساسية
// ============================================

async function apiFetch(endpoint) {
  await rateLimit.waitIfNeeded();
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`🌐 API: ${endpoint}`);
  
  const response = await fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY,
    },
  });
  
  // اقرأ Rate Limit من الـ headers
  const remaining = response.headers.get('X-Requests-Available-Minute');
  if (remaining) {
    console.log(`   → متبقي: ${remaining}/10 طلبات`);
  }
  
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }
  
  return response.json();
}

// ============================================
// البطولات
// ============================================

/**
 * جلب جميع البطولات المتاحة
 */
async function fetchCompetitions() {
  const data = await apiFetch('/competitions');
  return data.competitions || [];
}

/**
 * جلب تفاصيل بطولة واحدة
 * @param {string} code - رمز البطولة (PL, PD, BL1...)
 */
async function fetchCompetition(code) {
  return apiFetch(`/competitions/${code}`);
}

// ============================================
// الفرق
// ============================================

/**
 * جلب فرق بطولة معينة
 * @param {string} code - رمز البطولة (PL, PD...)
 */
async function fetchTeamsByCompetition(code) {
  const data = await apiFetch(`/competitions/${code}/teams`);
  return data.teams || [];
}

// ============================================
// المباريات
// ============================================

/**
 * جلب مباريات بطولة في موسم محدد
 * @param {string} code - رمز البطولة
 * @param {number} season - السنة (2026، 2025...)
 */
async function fetchMatchesByCompetition(code, season = 2026) {
  const data = await apiFetch(`/competitions/${code}/matches?season=${season}`);
  return data.matches || [];
}

/**
 * جلب مباريات فريق معين
 * @param {number} teamId - معرّف الفريق في API
 */
async function fetchMatchesByTeam(teamId) {
  const data = await apiFetch(`/teams/${teamId}/matches`);
  return data.matches || [];
}

// ============================================
// الترتيب والهدافون
// ============================================

/**
 * جلب ترتيب الدوري
 * @param {string} code - رمز البطولة
 */
async function fetchStandings(code) {
  const data = await apiFetch(`/competitions/${code}/standings`);
  return data.standings || [];
}

/**
 * جلب الهدافين
 * @param {string} code - رمز البطولة
 */
async function fetchScorers(code) {
  const data = await apiFetch(`/competitions/${code}/scorers`);
  return data.scorers || [];
}

// ============================================
// التصدير
// ============================================

module.exports = {
  fetchCompetitions,
  fetchCompetition,
  fetchTeamsByCompetition,
  fetchMatchesByCompetition,
  fetchMatchesByTeam,
  fetchStandings,
  fetchScorers,
};