require(`dotenv/config`)

// Database configs
module.exports = {
  dialect: `sqlite`,
  storage: `./src/database/database.sqlite`,
  define: {
    timestamps: true,
  },
}
