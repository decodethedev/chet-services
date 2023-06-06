import { useEffect, useState } from "react";
import React from "react";

import {
  BeakerIcon,
  CogIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/Layout";
import Head from "next/head";
import Navbar from "@/components/Dashboard/Navbar";

import CodeMirror from "@uiw/react-codemirror";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { langs } from "@uiw/codemirror-extensions-langs";
import ThemeButton from "@/components/ThemedButton";
import { useRouter } from "next/router";
import Cookies from "react-cookie/cjs/Cookies";

import {
  RefreshAccount,
  ResetHWID,
  RedeemCode,
  UpdateDiscordID,
} from "@/funcs/User";
import SuccessModal from "@/components/Dashboard/SuccessModal";
import ErrorModal from "@/components/Dashboard/ErrorModal";

// import { lua } from "@uiw/codemirror-extensions-langs/src";

// const user = {
//   name: "decodethedev",
//   email: "dwordthedev@gmail.com",
//   role: "Developer",
//   imageUrl:
//     "https://cdn.discordapp.com/avatars/726231525883904081/a_0a8fcf2b3b68f90a08f1ea64223abc47.gif",
//   discordId: "726231525883904081",
// };

const subNavigationInitial = [
  { name: "Account", href: "#", icon: CogIcon, current: true },
  { name: "Script", href: "#", icon: BeakerIcon, current: true },
  { name: "Billing", href: "#", icon: CreditCardIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardAccountPage(props) {
  const [subNavigation, setSubNavigation] = useState(subNavigationInitial);
  const [activeSubNavigationTabName, setActiveSubNavigationTabName] = useState(
    props.activeTab
  );

  const [loaded, setLoaded] = useState(false);
  const [notAuthed, setNotAuthed] = useState(true);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState("None");

  const router = useRouter();
  const cookies = new Cookies();
  const [user, setUser] = useState({});

  useEffect(() => {
    RefreshAccount(router, cookies, setUser, setNotAuthed);
  }, []);

  useEffect(() => {
    var foundTab = false;
    var newSubNavigation = subNavigation.map((item) => {
      if (item.name.toLowerCase() == activeSubNavigationTabName.toLowerCase()) {
        item.current = true;
        foundTab = true;
      } else {
        item.current = false;
      }
      return item;
    });

    if (!foundTab) {
      // console.log("Tab not found, setting to first tab");
      newSubNavigation = subNavigation.map((item) => {
        if (item.name == subNavigation[0].name) {
          item.current = true;
          foundTab = true;
        } else {
          item.current = false;
        }
        return item;
      });
      setActiveSubNavigationTabName(subNavigation[0].name);
    }

    // console.log("newSubNavigation: ", newSubNavigation);

    setSubNavigation(newSubNavigation);
    setLoaded(true);
  }, []);

  const handleSubNavigationTabClick = (tabName) => {
    const newSubNavigation = subNavigation.map((item) => {
      if (item.name == tabName) {
        item.current = true;
      } else {
        item.current = false;
      }
      return item;
    });
    setSubNavigation(newSubNavigation);
    setActiveSubNavigationTabName(tabName);
  };

  const onKeySubmit = async (e) => {
    e.preventDefault();
    const code = e.target[0].value;

    if (code == "") {
      return;
    }

    const res = await RedeemCode(cookies, code);

    if (!res[1]) {
      setTitle("Redeemed code successfully!");
      setDescription(res[0]);
      setOpen(true);
    }

    if (res[1]) {
      // console.log(res);
      setTitle("There was an error redeeming your code!");
      setDescription(res[0]);
      setErrorOpen(true);
    }
  };

  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/dashboard", current: false },
    { name: "Account", href: "/dashboard/account", current: true },
    // { name: "Admin Panel", href: "/dashboard/admin", current: false },
  ]);

  useState(() => {
    if (user.isAdmin) {
      setNavigation([
        { name: "Home", href: "/dashboard", current: false },
        { name: "Account", href: "/dashboard/account", current: true },
        { name: "Admin Panel", href: "/dashboard/admin", current: false },
      ]);
    }
  }, [user]);

  if (loaded && !notAuthed) {
    const script =
      `script_key="` +
      user.lua_armor_key +
      `";
loadstring(game:HttpGet("https://api.luarmor.net/files/v3/loaders/ef6ccedf9dcd6586b69e60859005b5ad.lua"))()`;

    return (
      <Layout>
        <SuccessModal
          open={open}
          setOpen={setOpen}
          title={title}
          description={description}
        />

        <ErrorModal
          open={errorOpen}
          setOpen={setErrorOpen}
          title={title}
          description={description}
        />

        <Head>
          <title>Chet Dashboard: Account Page</title>
        </Head>

        <Navbar nav={navigation} user={user} />

        <main className="relative -mt-24">
          <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
            <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
              <div className="divide-y divide-gray-600 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    {subNavigation.map((item) => (
                      <a
                        key={item.name}
                        // href={item.href}
                        onClick={() => handleSubNavigationTabClick(item.name)}
                        className={classNames(
                          item.current
                            ? "border-blue-500 bg-gray-900 text-blue-500 hover:bg-gray-900 hover:text-blue-600"
                            : "border-transparent text-gray-100 hover:bg-gray-900 hover:text-white",
                          "group flex items-center border-l-4 px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-blue-500 group-hover:text-blue-600"
                              : "text-gray-400 group-hover:text-white",
                            "-ml-1 mr-3 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>
                      </a>
                    ))}
                  </nav>
                </aside>
                {activeSubNavigationTabName.toLowerCase() ==
                "Account".toLowerCase() ? (
                  <div className="divide-y divide-gray-600 lg:col-span-9">
                    {/* Profile section */}
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                      <div>
                        <h2 className="text-lg font-semibold leading-6 text-white">
                          Account
                        </h2>
                        <p className="mt-1 text-sm text-gray-300">
                          Some of this information like your username and
                          profile picture will be displayed publicly so be
                          careful.
                        </p>
                      </div>

                      <div className="mt-6 flex flex-col lg:flex-row">
                        <div className="flex-grow space-y-6">
                          <div>
                            <label
                              htmlFor="username"
                              className="block text-sm font-medium leading-6 text-white"
                            >
                              Username
                            </label>
                            <div className="mt-2 flex  shadow-sm">
                              <input
                                type="text"
                                name="username"
                                id="username"
                                autoComplete="username"
                                className="rounded-lg block w-full min-w-0 flex-grow border-0 py-1.5 text-white disabled:cursor-not-allowed bg-gray-800 ring-1 ring-inset ring-gray-600 placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                placeholder={user.username}
                                disabled
                              />
                              <div className="max-w-md ml-2">
                                <button
                                  className="p-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
                                  disabled
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">
                              Your username which will be displayed in chat, and
                              on Chet.
                            </span>
                          </div>

                          <div>
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium leading-6 text-white"
                            >
                              Password
                            </label>
                            <div className="mt-2 flex shadow-sm">
                              <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="password"
                                className="rounded-lg block w-full min-w-0 flex-grow border-0 py-1.5 text-white bg-gray-800 ring-1 ring-inset ring-gray-600 disabled:cursor-not-allowed placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                // defaultValue={user.handle}
                                value={user.username}
                                disabled
                              />

                              <div className="max-w-md ml-2">
                                <button
                                  disabled
                                  className="p-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
                                >
                                  Send
                                </button>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">
                              We will generate a secure link to change your
                              password and send it to your email.
                            </span>
                          </div>

                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();

                              const discordId = e.target[0].value;

                              const r = UpdateDiscordID(cookies, discordId);

                              if (r[1]) {
                                setTitle("Error");
                                setDescription(r[0]);
                                setErrorOpen(true);
                              } else {
                                setTitle("Success");
                                setDescription("Updated your Discord ID!");
                                setOpen(true);
                              }
                            }}
                          >
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium leading-6 text-white"
                            >
                              Discord ID
                            </label>
                            <div className="mt-2 flex shadow-sm">
                              <input
                                type="text"
                                name="discord"
                                id="discord"
                                // autoComplete="discord"
                                className="rounded-lg block w-full min-w-0 flex-grow border-0 py-1.5 disabled:cursor-not-allowed text-white bg-gray-800 ring-1 ring-inset ring-gray-600 placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                defaultValue={user.discord_id}
                              />

                              <div className="max-w-md ml-2">
                                <button
                                  type="submit"
                                  className="p-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">
                              You can link your Discord account to Chet to get a
                              role in our Discord server.
                            </span>
                          </form>
                        </div>

                        <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                          <p
                            className="text-sm font-medium leading-6 text-white"
                            aria-hidden="true"
                          >
                            Photo
                          </p>
                          <div className="mt-2 lg:hidden">
                            <div className="flex items-center">
                              <div
                                className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                aria-hidden="true"
                              >
                                <img
                                  className="h-full w-full rounded-full"
                                  src={user.imageUrl}
                                  alt=""
                                />
                              </div>
                              <div className="relative ml-5">
                                <input
                                  id="mobile-user-photo"
                                  name="user-photo"
                                  type="file"
                                  className="peer absolute h-full w-full rounded-md opacity-0"
                                />
                                <label
                                  htmlFor="mobile-user-photo"
                                  className="pointer-events-none block rounded-md py-2 px-3 text-sm font-semibold text-white shadow-sm bg-gray-600"
                                >
                                  <span>Change</span>
                                  <span className="sr-only"> user photo</span>
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="relative hidden overflow-hidden rounded-full lg:block">
                            <img
                              className="relative h-40 w-40 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                            <label
                              htmlFor="desktop-user-photo"
                              className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                            >
                              <span>Change</span>
                              <span className="sr-only"> user photo</span>
                              <input
                                type="file"
                                id="desktop-user-photo"
                                name="user-photo"
                                className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Privacy section */}
                    {/* <div className="divide-y divide-gray-200 pt-6">
                    <div className="mt-4 flex justify-end gap-x-3 py-4 px-4 sm:px-6">
                      <ThemeButton type="submit">Save</ThemeButton>
                    </div>
                  </div> */}
                  </div>
                ) : (
                  ""
                )}
                {activeSubNavigationTabName.toLowerCase() ==
                "Billing".toLowerCase() ? (
                  <div className="divide-y divide-gray-600 lg:col-span-9">
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                      <div>
                        <h2 className="text-lg font-semibold leading-6 text-white">
                          Billing
                        </h2>
                        <p className="mt-1 text-sm text-gray-300">
                          Manage your billing information and payment methods.
                        </p>
                      </div>

                      {/* Display days left of subscription  */}

                      <div className="mt-6 flex flex-col lg:flex-row">
                        <div className="flex-grow space-y-6">
                          <div>
                            <label
                              htmlFor="key"
                              className="block text-sm font-medium leading-6 text-white"
                            >
                              <strong>Extend Membersip</strong> - Enter an
                              invite code below to extend your membership.
                            </label>
                            <form onSubmit={onKeySubmit}>
                              <div className="mt-2 flex  shadow-sm">
                                <input
                                  type="text"
                                  name="key"
                                  id="key"
                                  // autoComplete="username"
                                  className="rounded-lg block w-full min-w-0 flex-grow border-0 py-1.5 text-white bg-gray-800 ring-1 ring-inset ring-gray-600 placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                  placeholder="YourKey"
                                />
                                <div className="max-w-md ml-2">
                                  <ThemeButton
                                    type="submit"
                                    className="p-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                    // type="submit"
                                  >
                                    Process
                                  </ThemeButton>
                                </div>
                              </div>
                            </form>
                            <span className="text-sm text-gray-400">
                              You can extend your membership by entering an
                              invite, if you don&apos;t have one, buy one from
                              this{" "}
                              <a
                                className="text-blue-500"
                                href="https://store.chet.fun"
                              >
                                link
                              </a>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Privacy section */}
                    {/* <div className="divide-y divide-gray-200 pt-6">
                    <div className="mt-4 flex justify-end gap-x-3 py-4 px-4 sm:px-6">
                      <ThemeButton type="submit">Save</ThemeButton>
                    </div>
                  </div> */}
                  </div>
                ) : (
                  ""
                )}

                {activeSubNavigationTabName.toLowerCase() ==
                "Script".toLowerCase() ? (
                  <div className="divide-y divide-gray-600 lg:col-span-9">
                    <div className="py-6 px-4 sm:p-6 lg:pb-8">
                      <div>
                        <h2 className="text-lg font-semibold leading-6 text-white">
                          Script
                        </h2>
                        <p className="mt-1 text-sm text-gray-300">
                          Manage your script, you can reset your HWID, and get a
                          new script here.
                        </p>
                      </div>

                      {/* Script information */}

                      <div className="mt-6 flex flex-col lg:flex-row">
                        <div className="flex-grow space-y-6">
                          <div>
                            <label className="block text-sm font-medium leading-6 text-white">
                              <strong>Chet Script</strong> - Copy the script to
                              paste it into an executor.
                            </label>
                            <CodeMirror
                              value={script}
                              height="200px"
                              theme={tokyoNightStorm}
                              extensions={[langs.lua()]}
                              editable={false}
                            />
                            <ThemeButton
                              onClick={() => {
                                navigator.clipboard.writeText(script);
                                setTitle("Copied!");
                                setDescription(
                                  "Script has been copied into your clipboard! Paste it into any prefered executor to use Chet."
                                );
                                setOpen(true);
                              }}
                              noLoading
                            >
                              Copy
                            </ThemeButton>
                            <span className="text-sm text-gray-400">
                              Copy it and paste it into an executor to use Chet.
                            </span>
                          </div>
                          <div>
                            <label
                              htmlFor="hwid"
                              className="block text-sm font-medium leading-6 text-white"
                            >
                              Hardware ID
                            </label>
                            <div className="mt-2 flex shadow-sm">
                              <input
                                type="password"
                                name="hwid"
                                id="hwid"
                                // autoComplete="discord"
                                className="rounded-lg block w-full min-w-0 flex-grow border-0 py-1.5 text-white bg-gray-800 ring-1 ring-inset ring-gray-600 placeholder:text-gray-300 sm:text-sm sm:leading-6"
                                value="LMAOOOOOOOOOOOOOOOOOO"
                                readOnly
                              />

                              <div className="max-w-md ml-2">
                                <ThemeButton
                                  // className="p-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                                  onClick={async (setIssloading) => {
                                    const res = await ResetHWID(cookies);
                                    if (!res[1]) {
                                      setTitle("HWID has been reset!");
                                      setDescription(res);
                                      setOpen(true);
                                    } else {
                                      setTitle(
                                        "There was an error while resetting your HWID!"
                                      );
                                      setDescription(res);
                                      setErrorOpen(true);
                                    }
                                    await setIssloading(false);
                                  }}
                                >
                                  Reset
                                </ThemeButton>
                              </div>
                            </div>
                            <span className="text-sm text-gray-400">
                              Your Hardware ID is used to verify that you are
                              the owner of the account, reset if you want to use
                              in another pc, maximum 2 resets per 30 days.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="border-t border-gray-600 py-8 text-center text-sm text-gray-500 sm:text-left">
              <span className="block sm:inline">&copy; 2023 Chet Oink.</span>{" "}
              <span className="block sm:inline">All rights reserved.</span>
            </div>
          </div>
        </footer>
      </Layout>
    );
  }
}

export async function getServerSideProps(context) {
  const tab = context.query.tab;
  // console.log(context.query);

  if (!tab) {
    return {
      props: {
        activeTab: "Account",
      },
    };
  }

  return {
    props: {
      activeTab: tab,
    },
  };
}
