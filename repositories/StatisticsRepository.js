/**
 * StatisticsRepository — Data Access Layer for Statistics
 */

class StatisticsRepository {
  constructor(storageService) {
    this.storage = storageService;
  }

  async find() {
    const data = await this.storage.get("statistics") || {};
    return Statistics.fromJSON(data);
  }

  async save(statistics) {
    await this.storage.set("statistics", statistics.toJSON());
    return statistics;
  }
}

// ثبت جهانی
window.StatisticsRepository = StatisticsRepository;
