import { Fragment, useEffect, useRef, useState } from "react";
import React from "react";

import {
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Layout from "@/components/Layout";
import Head from "next/head";
import Navbar from "@/components/Dashboard/Navbar";

import ThemeButton from "@/components/ThemedButton";
import { useRouter } from "next/router";
import Cookies from "react-cookie/cjs/Cookies";

import {
  RefreshAccount,
  GetAllUsers,
  BlacklistUser,
  ForceResetHWID,
  UnbanUser,
} from "@/funcs/User";
import SuccessModal from "@/components/Dashboard/SuccessModal";
import ErrorModal from "@/components/Dashboard/ErrorModal";

import { GetAllKeys, MassCreateKeys, DeleteKey } from "@/funcs/Key";
import { Dialog, Transition } from "@headlessui/react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { langs } from "@uiw/codemirror-extensions-langs";

const navigation = [
  { name: "Home", href: "/dashboard", current: false },
  { name: "Account", href: "/dashboard/account", current: false },
  { name: "Admin Panel", href: "/dashboard/admin", current: true },
];
const subNavigationInitial = [
  // { name: "Profile", href: "#", icon: UserCircleIcon, current: true },
  { name: "Account", href: "#", icon: CogIcon, current: true },
  { name: "Licenses", href: "#", icon: UserCircleIcon, current: true },
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
  const [openLicenseModal, setOpenLicenseModal] = useState(false);
  const [openLicenseTextBoxModal, setOpenLicenseTextBoxModal] = useState(false);
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

    setSubNavigation(newSubNavigation);
    setLoaded(true);
  }, []);

  const [isFetchedData, setIsFetchedData] = useState(false);
  const [users, setUsers] = useState([]);
  const [keys, setKeys] = useState([]);

  const cancelButtonRef = useRef(null);

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

  useEffect(() => {
    if (user.username) {
      if (!user.isAdmin) {
        router.push("/dashboard");
      }

      console.log("activeSubNavigationTabName: " + activeSubNavigationTabName);

      if (activeSubNavigationTabName == "Account" && users.length == 0) {
        setIsFetchedData(false);
        const usersData = GetAllUsers(
          cookies,
          setUsers,
          setIsFetchedData,
          router
        );
      }

      if (activeSubNavigationTabName == "Licenses" && keys.length == 0) {
        setIsFetchedData(false);
        const usersData = GetAllKeys(
          cookies,
          setKeys,
          setIsFetchedData,
          router
        );
      }
    }
    // setIsFetchedData(false);
  }, [user, isFetchedData, activeSubNavigationTabName]);

  if (!notAuthed) {
    if (user.isAdmin) {
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
            <title>Chet Dashboard: Admin Page</title>
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
                            Users
                          </h2>
                          <p className="mt-1 text-sm text-gray-300">
                            A list of all the users including their name, title,
                            email and role.
                          </p>
                        </div>

                        <div className="bg-gray-800 ">
                          <div className="px-4 sm:px-6 lg:px-8">
                            <div className="sm:flex sm:items-center">
                              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                {/* <ThemeButton
                                type="button"
                                // className="block rounded-md bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                              >
                                Add user
                              </ThemeButton> */}
                              </div>
                            </div>
                            <div className="mt-8 flow-root">
                              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                {!isFetchedData ? (
                                  <div class="text-center">
                                    <div role="status">
                                      <svg
                                        aria-hidden="true"
                                        class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                          fill="currentColor"
                                        />
                                        <path
                                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                          fill="currentFill"
                                        />
                                      </svg>
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 max-h-[60rem]">
                                    <table className="min-w-full divide-y divide-gray-700">
                                      <thead>
                                        <tr>
                                          <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                          >
                                            <span className="sr-only">
                                              Edit
                                            </span>
                                          </th>

                                          <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                          >
                                            <span className="sr-only">
                                              Force Reset HWID
                                            </span>
                                          </th>
                                          {/* <div>asdasdasd</div> */}
                                          <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                                          >
                                            ID
                                          </th>
                                          <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                                          >
                                            IsAdmin
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Username
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Key
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Email
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Role
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            DiscordID
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Blacklisted
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Permanent
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            ExpireDate
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            TimeLeft
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-800">
                                        {users.map((person) => (
                                          <tr key={person.email}>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                              {person.is_banned ? (
                                                <ThemeButton
                                                  // className="bg-gradient-to-r from-red-800 to-red-600"
                                                  onClick={(setIssLoading) => {
                                                    UnbanUser(
                                                      cookies,
                                                      person.id,
                                                      setIsFetchedData,
                                                      setTitle,
                                                      setDescription,
                                                      setErrorOpen,
                                                      setIssLoading
                                                    );
                                                    setUsers([]);

                                                    // cookies,
                                                    // id,
                                                    // setIsFetched,
                                                    // setTitle,
                                                    // setDescription,
                                                    // setErrorOpen,
                                                    // setIsLoading
                                                  }}
                                                >
                                                  Unban
                                                </ThemeButton>
                                              ) : (
                                                <ThemeButton
                                                  // className="bg-gradient-to-r from-red-800 to-red-600"
                                                  onClick={(setIssLoading) => {
                                                    BlacklistUser(
                                                      cookies,
                                                      person.id,
                                                      setIsFetchedData,
                                                      setTitle,
                                                      setDescription,
                                                      setErrorOpen,
                                                      setIssLoading
                                                    );
                                                    setUsers([]);
                                                  }}
                                                >
                                                  Ban
                                                </ThemeButton>
                                              )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 ">
                                              <ThemeButton
                                                onClick={(setIssLoading) => {
                                                  ForceResetHWID(
                                                    cookies,
                                                    person.id,
                                                    setIsFetchedData,
                                                    setTitle,
                                                    setDescription,
                                                    setErrorOpen,
                                                    setIssLoading
                                                  );
                                                }}
                                              >
                                                Reset HWID
                                              </ThemeButton>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                              {person.id}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                              {person.isAdmin ? "Yes" : "No"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {person.username}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                              <button
                                                className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md inline-flex items-center"
                                                onClick={() => {
                                                  setTitle(
                                                    person.username +
                                                      "'s Luarmor Key"
                                                  );
                                                  setDescription(
                                                    person.lua_armor_key
                                                  );
                                                  setOpen(true);
                                                }}
                                              >
                                                <span className="inline-block">
                                                  <EyeSlashIcon className="w-5 h-5 text-white" />
                                                </span>
                                              </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {/* {person.email} */}
                                              <button
                                                className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md inline-flex items-center"
                                                onClick={() => {
                                                  setTitle(
                                                    person.username + "'s Email"
                                                  );
                                                  setDescription(person.email);
                                                  setOpen(true);
                                                }}
                                              >
                                                <span className="inline-block">
                                                  <EyeSlashIcon className="w-5 h-5 text-white" />
                                                </span>
                                              </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {person.role}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {/* {person.discordId} */}
                                              <button
                                                className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md inline-flex items-center"
                                                onClick={() => {
                                                  setTitle(
                                                    person.username +
                                                      "'s Discord ID"
                                                  );
                                                  setDescription(
                                                    person.discord_id
                                                  );
                                                  setOpen(true);
                                                }}
                                              >
                                                <span className="inline-block">
                                                  <EyeSlashIcon className="w-5 h-5 text-white" />
                                                </span>
                                              </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {person.is_banned ? "Yes" : "No"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {person.is_permanent
                                                ? "Yes"
                                                : "No"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {person.expire_date}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {person.timeLeft}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
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

                  {openLicenseTextBoxModal ? (
                    <Transition.Root
                      show={openLicenseTextBoxModal}
                      as={Fragment}
                    >
                      <Dialog
                        as="div"
                        className="relative z-10"
                        onClose={setOpenLicenseTextBoxModal}
                      >
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                              enterTo="opacity-100 translate-y-0 sm:scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                      as="h3"
                                      className="text-base font-semibold leading-6 text-white"
                                    >
                                      Here is your key.
                                    </Dialog.Title>
                                  </div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <ReactCodeMirror
                                      value={JSON.stringify(keys, null, 2)}
                                      height="200px"
                                      extensions={[langs.json()]}
                                      editable={false}
                                    />
                                  </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense ">
                                  <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700 sm:col-start-1 sm:mt-0"
                                    onClick={() => {
                                      setOpenLicenseTextBoxModal(false);
                                      setIsFetchedData(false);
                                      setKeys([]);
                                    }}
                                  >
                                    Done
                                  </button>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition.Root>
                  ) : (
                    ""
                  )}

                  {openLicenseModal ? (
                    <Transition.Root show={openLicenseModal} as={Fragment}>
                      <Dialog
                        as="div"
                        className="relative z-10"
                        initialFocus={cancelButtonRef}
                        onClose={setOpen}
                      >
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 overflow-y-auto">
                          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                              enterTo="opacity-100 translate-y-0 sm:scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                      as="h3"
                                      className="text-base font-semibold leading-6 text-white"
                                    >
                                      Enter the amount of license you want to
                                      generate
                                    </Dialog.Title>
                                  </div>
                                  <div className="mt-3 text-center sm:mt-5">
                                    <form
                                      onSubmit={async (e) => {
                                        e.preventDefault();

                                        const amount = e.target[0].value;
                                        const days = e.target[1].value;

                                        const r = await MassCreateKeys(
                                          cookies,
                                          amount,
                                          days
                                        );

                                        if (r[1]) {
                                          setOpenLicenseModal(false);
                                          setTitle("Error");
                                          setDescription(r[0]);
                                          setErrorOpen(true);
                                        } else {
                                          setOpenLicenseModal(false);
                                          setKeys(r[0]);

                                          setOpenLicenseTextBoxModal(true);
                                        }
                                      }}
                                    >
                                      <div>
                                        <label
                                          htmlFor="amount"
                                          className="block text-sm font-medium leading-6 text-white"
                                        >
                                          Amount (int)
                                        </label>
                                        <div className="mt-2">
                                          <input
                                            id="amount"
                                            name="amount"
                                            type="text"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label
                                          htmlFor="days"
                                          className="block text-sm font-medium leading-6 text-white mt-2"
                                        >
                                          Days (int)
                                        </label>
                                        <div className="mt-2">
                                          <input
                                            id="days"
                                            name="days"
                                            type="text"
                                            required
                                            className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                                          />
                                        </div>
                                      </div>

                                      <ThemeButton
                                        type="submit"
                                        className=" mt-3"
                                      >
                                        Submit
                                      </ThemeButton>
                                    </form>
                                  </div>
                                </div>
                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense ">
                                  <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700 sm:col-start-1 sm:mt-0"
                                    onClick={() => setOpenLicenseModal(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Dialog.Panel>
                            </Transition.Child>
                          </div>
                        </div>
                      </Dialog>
                    </Transition.Root>
                  ) : (
                    ""
                  )}
                  {activeSubNavigationTabName.toLowerCase() ==
                  "Licenses".toLowerCase() ? (
                    <div className="divide-y divide-gray-600 lg:col-span-9">
                      {/* Profile section */}
                      <div className="py-6 px-4 sm:p-6 lg:pb-8">
                        <div className="sm:flex sm:items-center">
                          <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-white">
                              Licenses
                            </h1>
                            <p className="mt-1 text-sm text-gray-300">
                              A list of all the licenses for Chet
                            </p>
                          </div>
                          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <ThemeButton
                              type="button"
                              onClick={async (setIsLd) => {
                                setIsLd(false);
                                setOpenLicenseModal(true);
                              }}
                            >
                              Add license(s)
                            </ThemeButton>
                          </div>
                        </div>

                        <div className="bg-gray-800 ">
                          <div className="px-4 sm:px-6 lg:px-8">
                            <div className="sm:flex sm:items-center">
                              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                {/* <ThemeButton
                                type="button"
                                // className="block rounded-md bg-blue-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                              >
                                Add user
                              </ThemeButton> */}
                              </div>
                            </div>
                            <div className="mt-8 flow-root">
                              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                {!isFetchedData ? (
                                  <div class="text-center">
                                    <div role="status">
                                      <svg
                                        aria-hidden="true"
                                        class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                          fill="currentColor"
                                        />
                                        <path
                                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                          fill="currentFill"
                                        />
                                      </svg>
                                      <span class="sr-only">Loading...</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 max-h-[60rem]">
                                    <table className="min-w-full divide-y divide-gray-700">
                                      <thead>
                                        <tr>
                                          <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                          >
                                            <span className="sr-only">
                                              Delete
                                            </span>
                                          </th>
                                          {/* <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                          >
                                            <span className="sr-only">
                                              Edit
                                            </span>
                                          </th>

                                          <th
                                            scope="col"
                                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                                          >
                                            <span className="sr-only">
                                              Force Reset HWID
                                            </span>
                                          </th> */}
                                          {/* <div>asdasdasd</div> */}
                                          <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                                          >
                                            ID
                                          </th>
                                          <th
                                            scope="col"
                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                                          >
                                            Code
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Used
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Redeemed by
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Is Lifetime
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                          >
                                            Days
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-800">
                                        {keys.map((key) => (
                                          <tr key={key.id}>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                              <ThemeButton
                                                className="bg-gradient-to-r from-red-800 to-red-600 mr-5"
                                                onClick={async (
                                                  setIssLoading
                                                ) => {
                                                  setIssLoading(true);
                                                  const r = await DeleteKey(
                                                    cookies,
                                                    key.code
                                                  );
                                                  if (r[1]) {
                                                    setTitle("Error");
                                                    setDescription(r[0]);
                                                    setErrorOpen(true);
                                                  } else {
                                                    setTitle("Success");
                                                    setDescription(r[0]);
                                                    setOpen(true);
                                                  }

                                                  setKeys([]);
                                                  setIsFetchedData(false);
                                                  setIssLoading(false);
                                                }}
                                              >
                                                Delete
                                              </ThemeButton>
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                              {key.id}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                              <button
                                                className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-md inline-flex items-center"
                                                onClick={() => {
                                                  setTitle("Key Code");
                                                  setDescription(key.code);
                                                  setOpen(true);
                                                }}
                                              >
                                                <span className="inline-block font-normal">
                                                  Unhide
                                                </span>
                                              </button>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {key.used ? "Yes" : "No"}
                                            </td>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                              {key.redeemed_by}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {key.is_permanent ? "Yes" : "No"}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                              {key.days}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
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
