/**
 * GrammarRepository — Data Access Layer for Grammar Points
 */

class GrammarRepository {
  constructor(storageService) {
    this.storage = storageService;
  }

  async findAll() {
    const data = await this.storage.get("grammar") || [];
    return data.map(g => GrammarPoint.fromJSON(g));
  }

  async findById(id) {
    const all = await this.findAll();
    return all.find(g => g.id === id) || null;
  }

  async findDue() {
    const all = await this.findAll();
    return all.filter(g => g.isDue());
  }

  async save(point) {
    let raw = await this.storage.get("grammar") || [];
    if (!Array.isArray(raw)) raw = [];

    const json = point.toJSON();
    const index = raw.findIndex(g => g && g.id === point.id);

    if (index >= 0) {
      raw[index] = json;
    } else {
      raw.push(json);
    }

    await this.storage.set("grammar", raw);
    return point;
  }

  async saveMany(list) {
    let raw = await this.storage.get("grammar") || [];
    if (!Array.isArray(raw)) raw = [];

    list.forEach(point => {
      const json = point.toJSON ? point.toJSON() : point;
      const index = raw.findIndex(g => g && g.id === json.id);

      if (index >= 0) {
        raw[index] = json;
      } else {
        raw.push(json);
      }
    });

    await this.storage.set("grammar", raw);
    return list;
  }

  async delete(id) {
    let raw = await this.storage.get("grammar") || [];
    if (!Array.isArray(raw)) raw = [];

    const filtered = raw.filter(g => g && g.id !== id);
    await this.storage.set("grammar", filtered);
    return filtered.length < raw.length;
  }

  async dueCount() {
    const due = await this.findDue();
    return due.length;
  }
}

// ثبت جهانی
window.GrammarRepository = GrammarRepository;
