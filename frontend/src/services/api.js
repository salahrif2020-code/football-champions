// ============================================
// Football Champions - API Service
// ============================================

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ============================================
// COMPETITIONS
// ============================================

export const getCompetitions = async () => {
  try {
    const response = await api.get('/competitions');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب البطولات:', error);
    throw error;
  }
};

export const getCompetitionByCode = async (code) => {
  try {
    const response = await api.get(`/competitions/${code}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب البطولة ${code}:`, error);
    throw error;
  }
};

export const getTeamsByCompetition = async (code) => {
  try {
    const response = await api.get(`/competitions/${code}/teams`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب فرق ${code}:`, error);
    throw error;
  }
};

export const getMatchesByCompetition = async (code, params = {}) => {
  try {
    const response = await api.get(`/competitions/${code}/matches`, { params });
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب مباريات ${code}:`, error);
    throw error;
  }
};

// ============================================
// TEAMS
// ============================================

export const getTeamById = async (id) => {
  try {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب الفريق ${id}:`, error);
    throw error;
  }
};

export const getMatchesByTeam = async (id) => {
  try {
    const response = await api.get(`/teams/${id}/matches`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب مباريات الفريق ${id}:`, error);
    throw error;
  }
};

// ============================================
// MATCHES
// ============================================

/**
 * مباريات اليوم (⭐ الأهم)
 */
export const getMatchesToday = async () => {
  try {
    const response = await api.get('/matches/today');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب مباريات اليوم:', error);
    throw error;
  }
};

/**
 * مباريات غداً
 */
export const getMatchesTomorrow = async () => {
  try {
    const response = await api.get('/matches/tomorrow');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب مباريات غداً:', error);
    throw error;
  }
};

/**
 * مباريات مباشرة (LIVE)
 */
export const getLiveMatches = async () => {
  try {
    const response = await api.get('/matches/live');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المباريات المباشرة:', error);
    throw error;
  }
};

/**
 * مباريات قادمة (الأسبوع القادم)
 */
export const getUpcomingMatches = async (days = 7) => {
  try {
    const response = await api.get('/matches/upcoming', { params: { days } });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المباريات القادمة:', error);
    throw error;
  }
};

/**
 * مباريات مُفلترة
 */
export const getMatches = async (params = {}) => {
  try {
    const response = await api.get('/matches', { params });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب المباريات:', error);
    throw error;
  }
};

export const getMatchById = async (id) => {
  try {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`خطأ في جلب المباراة ${id}:`, error);
    throw error;
  }
};

// ============================================
// SYNC
// ============================================

export const getSyncStatus = async () => {
  try {
    const response = await api.get('/sync/status');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب حالة المزامنة:', error);
    throw error;
  }
};

export default api;