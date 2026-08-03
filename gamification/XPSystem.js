/**
 * XPSystem — سیستم امتیاز تجربه (XP)
 * هر تمرین امتیاز می‌دهد و سطح کاربر بالا می‌رود
 */
class XPSystem {
  constructor(storage) {
    this.storage = storage;
    this.KEY = 'xp_progress';
  }

  async getProgress() {
    const data = await this.storage.get(this.KEY) || {
      totalXP: 0,
      level: 1,
      xpToNextLevel: 100
    };
    return data;
  }

  async addXP(points) {
    const data = await this.getProgress();
    data.totalXP += points;
    data.xpToNextLevel -= points;
    
    // سطح‌بندی
    const levels = [100, 250, 500, 1000, 2000, 3500, 6000, 10000];
    while (data.totalXP >= levels[data.level - 1] && data.level < levels.length) {
      data.level++;
      data.xpToNextLevel = levels[data.level] - data.totalXP;
    }
    
    await this.storage.set(this.KEY, data);
    return data;
  }

  async getLevelAndXP() {
    return await this.getProgress();
  }
}

window.XPSystem = XPSystem;
