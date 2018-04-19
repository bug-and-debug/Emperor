module.exports = {

  db: {
    connectionString: process.env.SITE_MONGO_URI || "mongodb://127.0.0.1:27017/emperor"
  },

  log: {
    formd: 'dev',
    options: {}
  }
};
