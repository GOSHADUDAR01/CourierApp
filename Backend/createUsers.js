const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/d_p", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log("MongoDB подключен");

    const users = [
      { email: "courier@test.com", password: "123456", role: "courier" },
      { email: "admin@test.com", password: "123456", role: "admin" }
    ];

    for (let u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const user = new User(u);
        await user.save();
        console.log(`Создан пользователь: ${u.email}`);
      } else {
        console.log(`Пользователь уже существует: ${u.email}`);
      }
    }

    mongoose.disconnect();
    console.log("Готово!");
  })
  .catch(err => console.error(err));





