import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  _read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async find(filter = {}) {
    const items = this._read();
    return items.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if (typeof val === 'object' && val !== null) {
          if (val.$regex) {
            const regex = new RegExp(val.$regex, val.$options || '');
            if (!regex.test(String(item[key] || ''))) return false;
          }
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: (Date.now().toString(36) + Math.random().toString(36).substring(2, 8)),
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    };
    items.unshift(newItem);
    this._write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, updates, options = {}) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    
    // Handle $push for internalNotes
    if (updates.$push) {
      for (const [arrKey, arrVal] of Object.entries(updates.$push)) {
        if (!Array.isArray(items[index][arrKey])) {
          items[index][arrKey] = [];
        }
        items[index][arrKey].push(arrVal);
      }
      delete updates.$push;
    }

    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this._write(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    this._write(items);
    return deleted;
  }

  async countDocuments(filter = {}) {
    const list = await this.find(filter);
    return list.length;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      this._write([]);
      return { deletedCount: 0 };
    }
    const items = this._read();
    const filtered = items.filter(item => {
      for (const [k, v] of Object.entries(filter)) {
        if (item[k] === v) return false;
      }
      return true;
    });
    const deletedCount = items.length - filtered.length;
    this._write(filtered);
    return { deletedCount };
  }
}

export const fallbackStore = {
  admins: new JsonCollection('admins'),
  services: new JsonCollection('services'),
  projects: new JsonCollection('projects'),
  enquiries: new JsonCollection('enquiries'),
  settings: new JsonCollection('settings')
};
