import fs from 'fs';
import crypto from 'crypto';
import util from 'util';
import repository from './repository.js';

const scrypt = util.promisify(crypto.scrypt);

class userRepository extends repository {
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

  async passwordCheck(saved, supplied) {
    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
    return hashed === hashedSuppliedBuf.toString('hex');
  }
}

export default new userRepository('users.json');
