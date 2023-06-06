import { Disclosure } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "#", current: true },
  { name: "Features", href: "#features", current: false },
  { name: "Our Team", href: "#team", current: false },
  { name: "Contact", href: "#cta", current: false },
  { name: "Pricings", href: "#pricings", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();

  return (
    <Disclosure as="nav" className="transparent">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white ">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <Link className="flex flex-shrink-0 items-center" href="/">
                  <Image
                    className="block h-8 w-auto lg:hidden"
                    src="/images/logo.png"
                    width={100}
                    height={100}
                    alt="Chet Logo"
                  />
                  <Image
                    className="hidden h-10 w-auto lg:block mr-10"
                    src="/images/logo-blue.png"
                    width={100}
                    height={100}
                    alt="Chet Logo"
                  />
                </Link>
              </div>
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={"/" + item.href}
                    className={classNames(
                      item.current
                        ? "bg-gradient-to-r from-blue-800 to-blue-500 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-md font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-transparent border-solid border-blue-600 border-2 box-border transition duration-100 ease-in-out px-3 py-2 text-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:scale-110 active:scale-90 mr-1"
                    href="/dashboard/register"
                  >
                    <ArrowLeftOnRectangleIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Register
                  </Link>
                  <Link
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-blue-800 to-blue-500 transition duration-100 ease-in-out px-3 py-2 text-md font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:scale-110 active:scale-90"
                    href="/dashboard/login"
                  >
                    <UserCircleIcon
                      className="-ml-0.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Login
                  </Link>
                </div>
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  {/* Profile dropdown */}
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gradient-to-r from-blue-800 to-blue-500 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
