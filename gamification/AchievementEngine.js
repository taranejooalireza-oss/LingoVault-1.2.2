/**
 * AchievementEngine — سیستم دستاوردها (Achievements)
 * وقتی کاربر به هدفی می‌رسد، جایزه می‌گیرد
 */
class AchievementEngine {
  constructor(storage) {
    this.storage = storage;
    this.KEY = 'unlocked_achievements';
  }

  async getUnlocked() {
    const data = await this.storage.get(this.KEY) || { unlocked: [] };
    return data.unlocked;
  }

  async unlock(id, titleFa, titleEn, descriptionFa, descriptionEn) {
    const unlocked = await this.getUnlocked();
    
    if (unlocked.some(a => a.id === id)) return false;
    
    unlocked.push({
      id,
      titleFa,
      titleEn,
      descriptionFa,
      descriptionEn,
      unlockedAt: new Date().toISOString()
    });
    
    await this.storage.set(this.KEY, { unlocked });
    return true;
  }

  async getAll() {
    const unlocked = await this.getUnlocked();
    return unlocked;
  }
}

window.AchievementEngine = AchievementEngine;
