const Users = require("../model/Users");
let internals = {};

internals.redirect = (req, res) => {
  res.redirect("/login");
};

internals.get_login = async (req, res) => {
  if (req.cookies.user) res.redirect("/home");
  else res.render("login");
};

internals.get_register = async (req, res) => {
  if (req.cookies.user) res.redirect("/home");
  else res.render("register");
};

internals.home = async (req, res) => {
  if (req.cookies.user)
    res.render("home", {
      data: JSON.parse(req.cookies.user),
    });
  else res.redirect("/login");
};

internals.logout = async (req, res) => {
  res.clearCookie("user");
  res.redirect("*");
};
// new or add name api
internals.post_login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("login", {
      message: "Some field are blank.",
      messageClass: "alert-danger",
    });
  }

  await Users.find({ username })
    .then((data) => {
      if (data[0].password != password) {
        res.render("login", {
          message: "Wrong password.",
          messageClass: "alert-danger",
        });
      } else {
        res.cookie("user", JSON.stringify(data[0]));
        res.redirect("/home");
      }
    })
    .catch(() => {
      res.render("login", {
        message: "Account did not exist",
        messageClass: "alert-danger",
      });
    });
};

internals.post_register = async (req, res) => {
  const { name, email, username, password, confirm } = req.body;
  var re = /\S+@\S+\.\S+/;

  if (!name || !email || !username || !password || !confirm)
    res.render("register", {
      message: "Some field are blank.",
      messageClass: "alert-danger",
    });
  if (password != confirm)
    res.render("register", {
      message: "Password and Confirm password are not equal.",
      messageClass: "alert-danger",
    });
  if (!re.test(email))
    res.render("register", {
      message: "Invalid email format.",
      messageClass: "alert-danger",
    });

  let NewUser = await Users(req.body);
  NewUser.save()
    .then(() => {
      res.cookie("user", JSON.stringify(NewUser));
      res.redirect("/home");
      return res.send({ success: true, message: "Added successfully" });
    })
    .catch((err) =>
      res.send({ success: false, message: err || "Error in the server" })
    );
};

internals.updateInfo = async (req, res) => {
  const { name, email, username } = req.body;
  let obj = {};
  let data = JSON.parse(req.cookies.user);

  if (email && !/\S+@\S+\.\S+/.test(email)) {
    res.render("home", {
      message: "Invalid email format.",
      messageClass: "alert-danger",
      data,
    });
    return;
  }

  if (name) obj.name = name;
  if (email) obj.email = email;
  if (username) obj.username = username;

  if (Object.keys(obj).length > 0) {
    await Users.findOneAndUpdate(
      { _id: data._id },
      {
        $set: obj,
      },
      { returnOriginal: false }
    )
      .then((data) => {
        res.cookie("user", JSON.stringify(data));
        res.redirect("/home");
      })
      .catch((err) =>
        res.send({ success: false, message: err || "Error in the server" })
      );
  } else res.redirect("/home");
};

internals.updatePass = async (req, res) => {
  const { oldpass, newpass, confirmpass } = req.body;
  let obj = {};
  let data = JSON.parse(req.cookies.user);

  if (!oldpass || !newpass || !confirmpass) {
    res.render("home", {
      message: "Some fields are blank.",
      messageClass: "alert-danger",
      data,
    });
    return;
  }

  if (oldpass && oldpass != data.password) {
    res.render("home", {
      message: "Old password is incorrect.",
      messageClass: "alert-danger",
      data,
    });
    return;
  }

  if (newpass && newpass != confirmpass) {
    res.render("home", {
      message: "New password didn't match.",
      messageClass: "alert-danger",
      data,
    });
    return;
  }

  if (newpass) obj.password = newpass;

  if (Object.keys(obj).length > 0) {
    await Users.findOneAndUpdate(
      { _id: data._id },
      {
        $set: obj,
      },
      { returnOriginal: false }
    )
      .then((data) => {
        res.cookie("user", JSON.stringify(data));
        res.render("home", {
          message: "Password successfully updated.",
          messageClass: "alert-success",
          data,
        });
      })
      .catch((err) =>
        res.send({ success: false, message: err || "Error in the server" })
      );
  }
};

internals.delete = async (req, res) => {
  let data = JSON.parse(req.cookies.user);
  await Users.findOneAndDelete({ _id: data._id })
    .then(() => {
      res.clearCookie("user");
      res.redirect("/home");
    })
    .catch((err) =>
      res.send({ success: false, message: err || "Error in the server" })
    );
};

// Handle view contact info
internals.view_data = async (req, res) => {
  let _data = await Data.find({ _id: req.params.name_id });
  if (_data.length == 0)
    return res.send({
      status: "Data ID not found",
    });
  else return res.send({ status: "Data ID found", data: _data });
};
// Handle update name
internals.update_name = async (req, res) => {
  let name = req.body.name;

  await Data.findByIdAndUpdate(req.params.name_id, {
    $set: { name },
  }).catch((err) => {
    return res.send({ message: "Error in finding the data" });
  });
  const data = await Data.find({ _id: req.params.name_id });
  if (data.length == 0) return res.send({ message: "Data ID not found" });
  else
    return res.send({
      message: "Data updated successfully",
    });
};
// Handle delete name
internals.delete_name = async (req, res) => {
  await Data.findByIdAndDelete({ _id: req.params.name_id }).catch((err) => {
    return res.send({ message: "Error on deleting the data" });
  });
  return res.send({ error: false, message: "Deleted successfully" });
};

module.exports = internals;
