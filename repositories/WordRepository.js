/**
 * WordRepository — Data Access Layer for Words
 */

class WordRepository {
  constructor(storageService) {
    this.storage = storageService;
  }

  async findAll() {
    const data = await this.storage.get("words") || [];
    return data.map(w => Word.fromJSON(w));
  }

  async findById(id) {
    const words = await this.findAll();
    return words.find(w => w.id === id) || null;
  }

  async findDue() {
    const words = await this.findAll();
    return words.filter(w => w.isDue());
  }

  async findByCategory(categoryId) {
    const words = await this.findAll();
    return words.filter(w => w.categoryId === categoryId);
  }

  async findByBox(boxNumber) {
    const words = await this.findAll();
    return words.filter(w => w.box === boxNumber);
  }

  async save(word) {
    const words = await this.findAll();
    const index = words.findIndex(w => w.id === word.id);

    if (index >= 0) {
      words[index] = word.toJSON();
    } else {
      words.push(word.toJSON());
    }

    await this.storage.set("words", words);
    return word;
  }

  async saveMany(wordList) {
    const words = await this.findAll();

    wordList.forEach(word => {
      const index = words.findIndex(w => w.id === word.id);
      if (index >= 0) {
        words[index] = word.toJSON();
      } else {
        words.push(word.toJSON());
      }
    });

    await this.storage.set("words", words);
    return wordList;
  }

  async delete(id) {
    const words = await this.findAll();
    const filtered = words.filter(w => w.id !== id);
    await this.storage.set("words", filtered.map(w => w.toJSON()));
    return filtered.length < words.length;
  }

  async count() {
    const words = await this.storage.get("words") || [];
    return words.length;
  }
}

// ثبت جهانی
window.WordRepository = WordRepository;
