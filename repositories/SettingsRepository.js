/**
 * SettingsRepository — Data Access Layer for User Settings
 */

class SettingsRepository {
  constructor(storageService) {
    this.storage = storageService;
  }

  async find() {
    const data = await this.storage.get("settings") || {};
    return Settings.fromJSON(data);
  }

  async save(settings) {
    await this.storage.set("settings", settings.toJSON());
    return settings;
  }
}

// ثبت جهانی
window.SettingsRepository = SettingsRepository;
