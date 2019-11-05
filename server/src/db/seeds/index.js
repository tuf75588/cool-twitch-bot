const db = require('../');
const globalCommandModel = require('../globalCommand');
const globalCommandList = require('./globalCommands');

(async () => {
  console.log('seeding global commands...');
  try {
    await globalCommandModel.collection.drop();
    await globalCommandModel.create(...globalCommandList);
    console.log('commands seeded!');
  } catch (error) {
    console.error('error seeding commands', error);
  } finally {
    db.close();
  }
})();
