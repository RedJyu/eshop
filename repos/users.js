import fs from 'fs';
import crypto from 'crypto';

class UserRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error('creating repo requires filename');
    }
    this.filename = filename;
    try {
      // sync is not preferable but will work in that case as it will be called just once
      fs.accessSync(this.filename);
    } catch (error) {
      // [] is added so we always work with array
      fs.writeFileSync(this.filename, '[]');
    }
  }
  //   needs to open file/read/parse content and then return data
  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    );
  }
  //   att = email,password,id etc
  async create(att) {
    att.id = this.randomId();
    const data = await this.getAll();
    data.push(att);
    await this.writeALL(data);
  }
  async writeALL(data) {
    // null(custom format) and 2 used to format data in users.json into more readable format
    await fs.promises.writeFile(this.filename, JSON.stringify(data, null, 2));
  }
  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }
  async getOne(id) {
    const data = await this.getAll();
    return data.find((data) => data.id === id);
  }
  async delete(id) {
    const users = await this.getAll();
    const filteredData = users.filter((user) => user.id !== id);
    await this.writeALL(filteredData);
  }
  async update(id, att) {
    const data = await this.getAll();
    const user = data.find((user) => user.id === id);
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    Object.assign(user, att);
    await this.writeALL(data);
  }
  async getOneBy(filters) {
    const data = await this.getAll();
    for (let item of data) {
      let found = true;
      for (let key in filters) {
        if (item[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return item;
      }
    }
  }
}

const test = async () => {
  const repo = new UserRepository('users.json');
  //   await repo.create({ email: 'test@test.pl', password: 'testPassword' });
  //   const users = await repo.getAll();
  //   await repo.update('c016b43f', { password: 'newPassword' });
  const user = await repo.getOneBy({ password: 'newPassword' });
  console.log(user);
};
test();
