const bcrypt = require("bcryptjs");

const db = require("../data/database.js");

class User {
  constructor(username, email, confirmEmail, password, confirmPassword) {
    this.username = username;
    this.email = email;
    this.confirmEmail = confirmEmail;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async existsAlready() {
    const exsitingUser = await this.getUserWithSameEmail();
    if (exsitingUser) {
      return true;
    }
    return false;
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  //store users in database
  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      username: this.username,
      email: this.email,
      password: hashedPassword,
    });
  }
}

module.exports = User;
