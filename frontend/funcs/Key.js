import axios from "axios";

module.exports.GetAllKeys = async (cookies, setKeys, setIsFetched, router) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;

  const res = await axios
    .get("https://chet.fun/api/v1/admin/codes", config)
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

  var codes = await res.data.data;

  const r = [codes, isError];

  setKeys(codes);
  setIsFetched(true);

  return r;
};

module.exports.MassCreateKeys = async (cookies, amount, days) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;

  const res = await axios
    .post(
      "https://chet.fun/api/v1/admin/codes/massCreate/" + amount,
      { days: parseInt(days) },
      config
    )
    .catch(function (err) {
      isError = true;
      if (err.response) {
        isError = true;
        return;
      }
    });

  var codes = [];

  if (!isError) {
    codes = await res.data.data;
  }

  const r = [codes, isError];

  return r;
};

module.exports.DeleteKey = async (cookies, code) => {
  const config = {
    headers: {
      Authorization: cookies.get("token"),
      "Content-Type": "application/json",
    },
  };

  var isError = false;

  const res = await axios
    .delete("https://chet.fun/api/v1/admin/codes/" + code, config)
    .catch(function (err) {
      isError = true;
      if (err.response) {
        isError = true;
        return;
      }
    });

  var message = await res.data.message;

  const r = [message, isError];

  return r;
};
