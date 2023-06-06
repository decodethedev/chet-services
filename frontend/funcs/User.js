// Auth functions

import axios from "axios";

module.exports.ConvertUser = (user) => {
  var data = user;

  if (data == undefined) {
    return;
  }

  data.imageUrl = "/images/default_pfp.png";
  data.role = data.role.charAt(0).toUpperCase() + data.role.slice(1);

  if (data.is_permanent) {
    data.timeLeft = "UNLIMITED";
  } else if (data.expire_date == "0001-01-01T00:00:00Z") {
    data.timeLeft = "EXPIRED";
  } else {
    var date = new Date(data.expire_date);
    // Minus time
    var now = new Date();
    var diff = date.getTime() - now.getTime();
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days < 0) {
      data.timeLeft = "EXPIRED";
    }

    if (days == 0) {
      data.timeLeft = hours + " Hours";
    }

    if (days > 0) {
      data.timeLeft = days + " Days";
    }

    // console.log(data.timeLeft);
  }
  return data;
};

module.exports.GetAllUsers = async (
  cookies,
  setUsers,
  setIsFetched,
  router
) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;

  const res = await axios
    .get("https://chet.fun/api/v1/admin/users", config)
    .catch(function (err) {
      isError = true;
      if (err.response) {
        isError = true;
        return;
      }
    });

  if (isError) {
    router.push("/dashboard/");
    return;
  }

  var users = await res.data.data;

  for (var i = 0; i < users.length; i++) {
    users[i] = module.exports.ConvertUser(users[i]);
  }

  const r = [users, isError];

  setUsers(users);
  setIsFetched(true);

  return r;
};

// Check token
module.exports.RefreshAccount = async (
  router,
  cookies,
  setUser,
  setLoading
) => {
  const token = cookies.get("token");

  if (!token || token == "" || token == undefined) {
    router.push("/dashboard/login");
  } else {
    const config = {
      // type: "GET",
      headers: {
        Authorization: token,
      },
    };

    var data = {};
    var isError = false;

    const res = await axios
      .get("https://chet.fun/api/v1/user/", config)
      .catch(function (error) {
        isError = true;
      });

    if (isError) {
      cookies.remove("token");
      router.push("/dashboard/login");
    } else {
      data = await res.data.data;

      data.imageUrl = "/images/default_pfp.png";
      data.role = data.role.charAt(0).toUpperCase() + data.role.slice(1);

      if (data.is_permanent) {
        data.timeLeft = "UNLIMITED";
      } else if (data.expire_date == "0001-01-01T00:00:00Z") {
        data.timeLeft = "EXPIRED";
      } else {
        var date = new Date(data.expire_date);
        // Minus time
        var now = new Date();
        var diff = date.getTime() - now.getTime();
        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        if (days < 0) {
          data.timeLeft = "EXPIRED";
        }

        if (days == 0) {
          data.timeLeft = hours + " Hours";
        }

        if (days > 0) {
          data.timeLeft = days + " Days";
        }

        // console.log(data.timeLeft);
      }
      // console.log(data);
      setUser(data);

      setLoading(false);
    }
  }
};

module.exports.IsAuthenticated = async (router, cookies, setNotAuthed) => {
  const token = cookies.get("token");

  if (!token || token == "" || token == undefined) {
    setNotAuthed(true);
  } else {
    const config = {
      // type: "GET",
      headers: {
        Authorization: token,
      },
    };

    var isError = false;

    await axios.get("https://chet.fun/api/v1/user/", config).catch(function () {
      isError = true;
    });

    if (isError) {
      cookies.remove("token");
      setNotAuthed(true);
      // router.push("dashboard/login");
      return;
    }

    setNotAuthed(false);
    router.push("/dashboard");
  }
};

module.exports.ResetHWID = async (cookies) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;
  var error = "";

  const res = await axios
    .get("https://chet.fun/api/v1/user/resethwid", config)
    .catch(function (err) {
      isError = true;

      if (err.response) {
        error = err.response.data.message;
        return;
      }
      error =
        "An unknown error occured, please contact the developer for help.";
    });

  if (isError) {
    return [error, isError];
  } else {
    return [
      "Successfully resetted your HWID for Chet, copy the script to execute in a new computer.",
      isError,
    ];
  }
};

module.exports.UpdateDiscordID = async (cookies, discordID) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;

  const res = await axios
    .put(
      "https://chet.fun/api/v1/user/",
      {
        discord_id: discordID,
      },
      config
    )
    .catch(function (err) {
      isError = true;
    });

  const message = await res.data.message;

  return [message, isError];
};

module.exports.RedeemCode = async (cookies, code) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;
  var error = "";

  // console.log(code);

  const res = await axios
    .post("https://chet.fun/api/v1/user/redeem", { code: code }, config)
    .catch(function (err) {
      isError = true;

      if (err.response) {
        error = err.response.data.message;
        return;
      }
      error =
        "An unknown error occured, please contact the developer for help.";
    });

  if (isError) {
    return [error, isError];
  }

  const bdy = await res.data.message;

  return [bdy, isError];
};

module.exports.BlacklistUser = async (
  cookies,
  id,
  setIsFetched,
  setTitle,
  setDescription,
  setErrorOpen,
  setIsLoading
) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      // "Content-Type": "application/json",
    },
  };

  var isError = false;
  var error = "";

  const res = await axios
    .post("https://chet.fun/api/v1/admin/users/" + id + "/ban", null, config)
    .catch(function (err) {
      isError = true;

      if (err.response) {
        error = err.response.data.message;
        return;
      }
      error =
        "An unknown error occured, please contact the developer for help.";
    });

  if (isError) {
    setTitle("Error");
    setDescription(error);
    setErrorOpen(true);
    setIsLoading(false);
    return;
  }

  const bdy = await res.data.message;

  setIsFetched(false);
  setIsLoading(false);

  return [bdy, isError];
};

module.exports.UnbanUser = async (
  cookies,
  id,
  setIsFetched,
  setTitle,
  setDescription,
  setErrorOpen,
  setIsLoading
) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      // "Content-Type": "application/json",
    },
  };

  var isError = false;
  var error = "";

  const res = await axios
    .post("https://chet.fun/api/v1/admin/users/" + id + "/unban", null, config)
    .catch(function (err) {
      isError = true;

      if (err.response) {
        error = err.response.data.message;
        return;
      }
      error =
        "An unknown error occured, please contact the developer for help.";
    });

  if (isError) {
    setTitle("Error");
    setDescription(error);
    setErrorOpen(true);
    setIsLoading(false);
    return;
  }

  const bdy = await res.data.message;

  setIsFetched(false);
  setIsLoading(false);

  return [bdy, isError];
};

module.exports.ForceResetHWID = async (
  cookies,
  id,
  setIsFetched,
  setTitle,
  setDescription,
  setErrorOpen,
  setIsLoading
) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      // "Content-Type": "application/json",
    },
  };

  var isError = false;
  var error = "";

  const res = await axios
    .post(
      "https://chet.fun/api/v1/admin/users/" + id + "/resethwid",
      null,
      config
    )
    .catch(function (err) {
      isError = true;

      if (err.response) {
        error = err.response.data.message;
        return;
      }
      error =
        "An unknown error occured, please contact the developer for help.";
    });

  if (isError) {
    setTitle("Error");
    setDescription(error);
    setErrorOpen(true);
    setIsLoading(false);
    return;
  }

  const bdy = await res.data.message;

  setIsFetched(false);
  setIsLoading(false);

  return [bdy, isError];
};
