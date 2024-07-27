const db = require("../data/database"); //access to database

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    this.id = id; //may be undefined if no id
  }
  async save() {
    await db.getDb().collection("posts").insertOne({
      title: this.title,
      content: this.content,
      date: new Date(), // recording date and time
    });
  }
}

module.exports = Post;
