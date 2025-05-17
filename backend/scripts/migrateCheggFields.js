const mongoose = require('mongoose');
const User = require('../models/User');
const CheggExtension = require('../models/CheggExtension');
const Question = require('../models/Question');

require('dotenv').config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // 1. Update Users
  const users = await User.find();
  for (const user of users) {
    let updated = false;
    if (user.creditRemaining === undefined) {
      user.creditRemaining = 0;
      updated = true;
    }
    if (user.cheggIdName === undefined) {
      user.cheggIdName = '';
      updated = true;
    }
    if (user.extensions === undefined) {
      user.extensions = [];
      updated = true;
    }
    if (updated) await user.save();
  }
  console.log('Users migrated.');

  // 2. Update CheggExtensions
  const extensions = await CheggExtension.find();
  for (const ext of extensions) {
    let updated = false;
    if (ext.creditsUsed === undefined) {
      ext.creditsUsed = 0;
      updated = true;
    }
    if (!ext.metadata) {
      ext.metadata = { totalUsers: 0, totalCreditsUsed: 0, lastUpdated: new Date() };
      updated = true;
    }
    if (updated) await ext.save();
  }
  console.log('CheggExtensions migrated.');

  // 3. Update Questions
  const questions = await Question.find();
  for (const q of questions) {
    let updated = false;
    if (q.extension === undefined) {
      q.extension = null;
      updated = true;
    }
    if (q.priority === undefined) {
      q.priority = 'medium';
      updated = true;
    }
    if (q.creditPrice === undefined) {
      q.creditPrice = 0;
      updated = true;
    }
    if (q.cheggIdName === undefined) {
      q.cheggIdName = '';
      updated = true;
    }
    if (updated) await q.save();
  }
  console.log('Questions migrated.');

  await mongoose.disconnect();
  console.log('Migration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});