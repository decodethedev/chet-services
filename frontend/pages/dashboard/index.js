import {
  AcademicCapIcon,
  BanknotesIcon,
  FireIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowRightOnRectangleIcon,
  BoltIcon,
  BookOpenIcon,
  MegaphoneIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";

import Layout from "@/components/Layout";
import Head from "next/head";
import Navbar from "@/components/Dashboard/Navbar";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { RefreshAccount } from "@/funcs/User";

// const navigation = [
//   { name: "Home", href: "#", current: true },
//   { name: "Account", href: "/dashboard/account", current: false },
//   { name: "Admin Panel", href: "/dashboard/admin", current: false },
// ];

const actions = [
  {
    icon: ArrowRightOnRectangleIcon,
    name: "Get script",
    description:
      "Get the script to use Chet on your computer. You can use Chet on only 1 computer at a time.",
    href: "/dashboard/account?tab=script",
    iconForeground: "text-indigo-700",
    iconBackground: "bg-indigo-50",
  },
  {
    icon: UserCircleIcon,
    name: "Reset HWID",
    description:
      "Reset your HWID to allow you to use Chet on another computer, maximum 2 resets per 30 days.",
    href: "/dashboard/account?tab=script",
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
  },
  {
    icon: BanknotesIcon,
    name: "Extend subscription",
    description: "Purchase to more days to extend your Chet subscription.",
    href: "/dashboard/account?tab=billing",
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50",
  },
  {
    icon: AcademicCapIcon,
    name: "Tutorials",
    description: "Learn how to use Chet and get the most out of it.",
    href: "#",
    iconForeground: "text-sky-700",
    iconBackground: "bg-sky-50",
  },
  {
    icon: UserGroupIcon,
    name: "Edit your account",
    description: "Change your account information.",
    href: "/dashboard/account",
    iconForeground: "text-yellow-700",
    iconBackground: "bg-yellow-50",
  },
  {
    icon: BookOpenIcon,
    name: "Documentation",
    description: "View the documentation for Chet. (Coming soon!)",
    href: "#",
    iconForeground: "text-blue-700",
    iconBackground: "bg-blue-50",
  },
];

import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardHome() {
  const router = useRouter();
  const cookies = new Cookies();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const [subscription, setSubscription] = useState("LOADING");
  const [blacklisted, setBlacklisted] = useState("LOADING");

  // const [stats, setStats] = useState([
  //   { label: "Subscription", value: "LOADING" },
  //   { label: "Total executions", value: "LOADING" },
  //   { label: "Blacklisted", value: "LOADING" },
  // ]);

  useEffect(() => {
    RefreshAccount(router, cookies, setUser, setLoading);
  }, []);

  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/dashboard", current: true },
    { name: "Account", href: "/dashboard/account", current: false },
    // { name: "Admin Panel", href: "/dashboard/admin", current: false },
  ]);

  useState(() => {
    if (user.isAdmin) {
      setNavigation([
        { name: "Home", href: "/dashboard", current: true },
        { name: "Account", href: "/dashboard/account", current: false },
        { name: "Admin Panel", href: "/dashboard/admin", current: false },
      ]);
    }
  }, [user]);

  useEffect(() => {
    console.log(user);

    // newStats[0].value = user.timeLeft;
    // newStats[1].value = "N/A";
    // if (user.IsBanned) {
    //   newStats[2].value = "Yes";
    // } else {
    //   newStats[2].value = "Not";
    // }

    setSubscription(user.timeLeft);
    setBlacklisted(user.IsBanned);
  }, [user]);

  if (!loading) {
    return (
      <Layout>
        <Head>
          <title>Chet Dashboard</title>
        </Head>
        <div className="min-h-full">
          <Navbar nav={navigation} user={user} />
          <main className="-mt-24 pb-8">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <h1 className="sr-only">Profile</h1>

              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                {/* Left column */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                  {/* Welcome panel */}
                  <section aria-labelledby="profile-overview-title">
                    <div className="overflow-hidden rounded-lg bg-black shadow">
                      <h2 className="sr-only" id="profile-overview-title">
                        Profile Overview
                      </h2>
                      <div className="bg-gray-800 p-6">
                        <div className="sm:flex sm:items-center sm:justify-between">
                          <div className="sm:flex sm:space-x-5">
                            <div className="flex-shrink-0">
                              <img
                                className="mx-auto h-20 w-20 rounded-full"
                                src={user.imageUrl}
                                alt="pfp"
                              />
                            </div>
                            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                              
                              <p className="text-sm font-medium text-gray-300">
                                Welcome back,
                              </p>
                              <p className="text-xl font-bold text-white sm:text-2xl">
                                {user.username} <div
                                  class="font-bold text-sm inline-flex items-center leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded-full"
                                >
                                UID: {user.id}
                              </div>
                              </p>
                              
                              <p className="text-sm  font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                                {user.role}
                              </p>
                              
                            </div>
                          </div>
                          {/* <div className="mt-5 flex justify-center sm:mt-0">
                          <a
                            href="#"
                            className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          >
                            View profile
                          </a>
                        </div> */}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 divide-y divide-gray-500 border-t border-gray-500 bg-gray-600 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
                        {/* {stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="px-6 py-5 text-center text-sm font-medium"
                          >
                            <span className="font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
                              {stat.value}
                            </span>{" "}
                            <span className="text-white">{stat.label}</span>
                          </div>
                        ))} */}
                        <div
                          key="Subscription"
                          className="px-6 py-5 text-center text-sm font-medium"
                        >
                          <span className="font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
                            {subscription}
                          </span>{" "}
                          <span className="text-white">Subscription</span>
                        </div>
                        <div
                          key="Total executions"
                          className="px-6 py-5 text-center text-sm font-medium"
                        >
                          <span className="font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
                            N/A
                          </span>{" "}
                          <span className="text-white">Total Executions</span>
                        </div>
                        <div
                          key="Blacklisted"
                          className="px-6 py-5 text-center text-sm font-medium"
                        >
                          <span className="font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
                            {blacklisted ? "Yes" : "Not"}
                          </span>{" "}
                          <span className="text-white">Blacklisted</span>
                        </div>
                        
                      </div>
                    </div>
                  </section>

                  {/* Actions panel */}
                  <section aria-labelledby="quick-links-title">
                    <div className="divide-y divide-gray-600 overflow-hidden rounded-lg bg-gray-600 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                      <h2 className="sr-only" id="quick-links-title">
                        Quick links
                      </h2>
                      {actions.map((action, actionIdx) => (
                        <div
                          key={action.name}
                          className={classNames(
                            actionIdx === 0
                              ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                              : "",
                            actionIdx === 1 ? "sm:rounded-tr-lg" : "",
                            actionIdx === actions.length - 2
                              ? "sm:rounded-bl-lg"
                              : "",
                            actionIdx === actions.length - 1
                              ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                              : "",
                            "group relative bg-gray-800 p-6"
                          )}
                        >
                          <div>
                            <span
                              className={classNames(
                                action.iconBackground,
                                action.iconForeground,
                                "inline-flex rounded-lg p-3 ring-4 ring-gray-500"
                              )}
                            >
                              <action.icon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="mt-8">
                            <h3 className="text-lg font-medium">
                              <Link
                                href={action.href}
                                className="focus:outline-none text-white font-semibold"
                              >
                                {/* Extend touch target to entire panel */}
                                <span
                                  className="absolute inset-0"
                                  aria-hidden="true"
                                />
                                {action.name}
                              </Link>
                            </h3>
                            <p className="mt-2 text-sm text-gray-300">
                              {action.description}
                            </p>
                          </div>
                          <span
                            className="pointer-events-none absolute top-6 right-6 text-gray-400 group-hover:text-gray-300"
                            aria-hidden="true"
                          >
                            <svg
                              className="h-6 w-6"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                            </svg>
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right column */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Announcements */}
                  <section aria-labelledby="announcements-title">
                    <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                      <div className="p-6">
                        <h2
                          className="text-base text-white font-semibold"
                          id="announcements-title"
                        >
                          Announcements
                        </h2>
                        {/* <div className="mt-6 flow-root">
                        <ul
                          role="list"
                          className="-my-5 divide-y divide-gray-500"
                        >
                          {announcements.map((announcement) => (
                            <li key={announcement.id} className="py-5">
                              <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                                <h3 className="text-sm font-semibold text-white">
                                  <a
                                    href={announcement.href}
                                    className="hover:underline focus:outline-none"
                                  >

                                    <span
                                      className="absolute inset-0"
                                      aria-hidden="true"
                                    />
                                    {announcement.title}
                                  </a>
                                </h3>
                                <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                                  {announcement.preview}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6">
                        <ThemeButton>View all</ThemeButton>
                      </div> */}
                        <div className="text-center mt-6">
                          <MegaphoneIcon className="mx-auto h-12 w-12 text-blue-400" />
                          <h3 className="mt-2 text-sm font-semibold text-white">
                            No announcements
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            We will post announcements here.
                          </p>
                          <div className="mt-3"></div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Recent Updates */}
                  <section aria-labelledby="recent-hires-title">
                    <div className="overflow-hidden rounded-lg bg-gray-800 shadow">
                      <div className="p-6">
                        <h2
                          className="text-base text-white font-semibold"
                          id="recent-hires-title"
                        >
                          Recent Updates
                        </h2>
                        {/* <div className="mt-6 flow-root">
                        <ul role="list" className="-mb-8">
                          {updates.map((activityItem, activityItemIdx) => (
                            <li key={activityItem.id}>
                              <div className="relative pb-8">
                                {activityItemIdx !== updates.length - 1 ? (
                                  <span
                                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-600"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <div className="relative flex items-start space-x-3">
                                  {activityItem.type === "update" ? (
                                    <>
                                      <div className="relative">
                                        <img
                                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-gray-600"
                                          src={activityItem.imageUrl}
                                          alt=""
                                        />

                                        <span className="absolute -bottom-0.5 -right-1 bg-gray-600 border-gray-400 rounded-full px-0.5 py-px">
                                          <MegaphoneIcon
                                            className="h-5 w-5 text-white bg-transparent"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div>
                                          <div className="text-sm">
                                            <div className=" text-white font-bold">
                                              {activityItem.person.name}

                                              <span className="font-normal block">
                                                {activityItem.person.role}
                                              </span>
                                            </div>
                                          </div>
                                          <p className="mt-0.5 text-sm text-gray-300">
                                            {activityItem.date}
                                          </p>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-400">
                                          <h3 className="text-white font-semibold">
                                            {activityItem.updateTitle}
                                          </h3>
                                          <p>{activityItem.update}</p>
                                        </div>
                                      </div>
                                    </>
                                  ) : activityItem.type === "assignment" ? (
                                    <>
                                      <div>
                                        <div className="relative px-1">
                                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 ring-8 ring-gray-600">
                                            <UserCircleIcon
                                              className="h-5 w-5 text-gray-100"
                                              aria-hidden="true"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="min-w-0 flex-1 py-1.5">
                                        <div className="text-sm text-gray-500">
                                          <a
                                            href={activityItem.person.href}
                                            className="font-semibold text-white"
                                          >
                                            {activityItem.person.name}
                                          </a>{" "}
                                          assigned{" "}
                                          <a
                                            href={activityItem.assigned.href}
                                            className="font-medium text-gray-300"
                                          >
                                            {activityItem.assigned.name}
                                          </a>{" "}
                                          <span className="whitespace-nowrap">
                                            {activityItem.date}
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-6">
                        <ThemeButton>View all</ThemeButton>
                      </div> */}

                        <div className="text-center mt-6">
                          <FireIcon className="mx-auto h-12 w-12 text-red-400" />
                          <h3 className="mt-2 text-sm font-semibold text-white">
                            No updates yet
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            We will notify you when an update is pushed out.
                          </p>
                          <div className="mt-3"></div>
                        </div>
                      </div>
                    </div>
                  </section>
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
        </div>
      </Layout>
    );
  } else {
    return <div>loading</div>;
  }
}

// export async function getServerSideProps(context) {
//   const cookies = context.req.headers.cookies;

//   console.log(context.req.headers);

//   // const token = cookies.split("=")[1];
//   console.log(cookies);

//   if (cookies == undefined) {
//     return {
//       redirect: {
//         destination: "/dashboard/login",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       user: data,
//     },
//   };
// }
