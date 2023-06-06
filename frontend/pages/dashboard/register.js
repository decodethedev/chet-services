import Navbar from "@/components/Landing/Navbar";
import Layout from "@/components/Layout";
import ThemeButton from "@/components/ThemedButton";
import Head from "next/head";
import Link from "next/link";

import { useState } from "react";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const instance = axios.create({});

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onFormSubmit = (e) => {
    e.preventDefault();

    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const passwordConfirm = e.target[3].value;
    const inviteCode = e.target[4].value;
    const refCode = e.target[5].value;

    if (password != passwordConfirm) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    var res;

    res = instance
      .post("https://chet.fun/api/v1/register/", {
        username: username,
        email: email,
        password: password,
        password_confirm: passwordConfirm,
        invite_code: inviteCode,
        referenece_code: refCode,
      })
      .then(function (response) {
        if (response.status == 200) {
          setSuccess(response.data.message);
          setError("");
        }
      })
      .catch(function (error) {
        setError(error.response.data.message);
        setSuccess("");
      });
  };

  return (
    <Layout>
      <Head>
        <title>Sign in to your account</title>
      </Head>

      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
        }
      `}</style>

      <Navbar />
      <main>
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                width={150}
                height={150}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 200V.5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
              <path
                d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
            />
          </svg>

          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {success != "" ? (
              <div className="rounded-md bg-green-50 p-4 mb-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon
                      className="h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Registration successful
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{success}</p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <Link
                          href="/dashboard/login"
                          className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                        >
                          Click here to login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {error != "" ? (
              <div className="rounded-md bg-red-50 p-4 mb-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon
                      className="h-5 w-5 text-red-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      There were an error with your submission
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul role="list" className="list-disc space-y-1 pl-5">
                        <li>{error}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <img
              className="mx-auto h-12 w-auto"
              src="https://media.discordapp.net/attachments/1077533123392327740/1080799704746561586/Logo-_1_.png?width=642&height=676"
              alt="Chet Logo"
            />
            <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Create an account with us
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <Link
                href="/dashboard/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                sign in to your account
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form
                className="space-y-3"
                onSubmit={onFormSubmit}
                autoComplete="off"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Username
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                      placeholder="Your prefered username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Email address
                  </label>
                  <div className="relative mt-2 rounded-md shadow-sm">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                      placeholder="your.email@chet.fun"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Confirm password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmpassword"
                      name="confirmpassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="invitecode"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Invite code
                  </label>
                  <div className="mt-2">
                    <input
                      id="invitecode"
                      name="invitecode"
                      type="password"
                      // autoComplete="new-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="ref"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Reference code (Not Required)
                  </label>
                  <div className="mt-2">
                    <input
                      id="ref"
                      name="ref"
                      type="text"
                      // autoComplete="new-password"
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-gray-900 text-blue-600 focus:ring-blue-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-white"
                  >
                    I agree to the{" "}
                    <Link
                      className="text-blue-400"
                      href="https://store.chet.fun/?browse=terms"
                    >
                      Terms of Service
                    </Link>{" "}
                    of Chet.
                  </label>
                </div>

                <div>
                  <ThemeButton type="submit">Create account</ThemeButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
