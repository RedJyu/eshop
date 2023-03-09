import repository from './repository.js';

class productRepo extends repository {}

export default new productRepo('products.json');
