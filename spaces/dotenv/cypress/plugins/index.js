require("dotenv").config()

module.exports = (on, config) => {
  config.env.SOME_DATA = process.env.SOME_DATA

  return config

}
