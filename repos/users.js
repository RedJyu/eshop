import fs from 'fs';

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
      fs.writeFileSync(this.filename, '[]');
    }
  }
}

new UserRepository('users.json');
