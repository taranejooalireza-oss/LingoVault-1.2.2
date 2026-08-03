/**
 * AchievementRepository — Data Access Layer for Achievements
 */

class AchievementRepository {
  constructor(storageService) {
    this.storage = storageService;
  }

  async findAll() {
    const data = await this.storage.get("achievements") || {};
    if (!data.unlocked) return [];
    return data.unlocked.map(a => Achievement.fromJSON(a));
  }

  async save(achievements) {
    await this.storage.set("achievements", {
      unlocked: achievements.map(a => a.toJSON())
    });
    return achievements;
  }

  async findById(id) {
    const achievements = await this.findAll();
    return achievements.find(a => a.id === id) || null;
  }
}

// ثبت جهانی
window.AchievementRepository = AchievementRepository;
