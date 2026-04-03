import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/password', data),
  getDashboard: () => api.get('/users/dashboard'),
  getReferralInfo: () => api.get('/users/referral'),
};

export const adsAPI = {
  getAds: () => api.get('/ads'),
  startAd: (id) => api.post(`/ads/${id}/start`),
  completeAd: (id, sessionToken) => api.post(`/ads/${id}/complete`, { sessionToken }),
};

export const walletAPI = {
  getWallet: () => api.get('/wallet'),
  getTransactions: (params) => api.get('/wallet/transactions', { params }),
  redeemCoins: (data) => api.post('/wallet/redeem', data),
  getRedemptions: () => api.get('/wallet/redemptions'),
};

export const tasksAPI = {
  getTasks: () => api.get('/tasks'),
  completeTask: (taskKey) => api.post('/tasks/complete', { taskKey }),
};

export const spinAPI = {
  getStatus: () => api.get('/spin/status'),
  spin: () => api.post('/spin'),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleBan: (id) => api.put(`/admin/users/${id}/ban`),
  createAd: (data) => api.post('/admin/ads', data),
  updateAd: (id, data) => api.put(`/admin/ads/${id}`, data),
  deleteAd: (id) => api.delete(`/admin/ads/${id}`),
  getRedemptions: (status) => api.get('/admin/redemptions', { params: { status } }),
  updateRedemption: (id, data) => api.put(`/admin/redemptions/${id}`, data),
  getMessages: () => api.get('/admin/messages'),
};
