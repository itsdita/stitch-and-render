const db = require("../data/database"); //access to database

class Contact {
  constructor(name, email, subject, message) {
    this.name = name;
    this.email = email;
    this.subject = subject;
    this.message = message;
    //this.id = id; //may be undefined if no id
  }
  async save() {
    await db.getDb().collection("contact").insertOne({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      date: new Date(), // recording date and time
    });
  }
}

module.exports = Contact;
