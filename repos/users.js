import fs from 'fs';
import crypto from 'crypto';
import util from 'util';
const scrypt = util.promisify(crypto.scrypt);

class userRepository {
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
    // salt
    const salt = crypto.randomBytes(8).toString('hex');
    const hashed = await scrypt(att.password, salt, 64);

    const data = await this.getAll();
    const pass = { ...att, password: `${hashed.toString('hex')}.${salt}` };
    data.push(pass);
    await this.writeALL(data);
    return pass;
  }
  // password

  async passwordCheck(saved, supplied) {
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
    return hashed === hashedSuppliedBuf.toString('hex');
  }

  ///////////////////////////////////
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

export default new userRepository('users.json');
