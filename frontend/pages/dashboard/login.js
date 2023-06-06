import Navbar from "@/components/Landing/Navbar";
import Layout from "@/components/Layout";
import ThemeButton from "@/components/ThemedButton";
import Head from "next/head";
import Link from "next/link";

import axios from "axios";

const instance = axios.create({});

import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

import Cookies from "universal-cookie";
import { IsAuthenticated } from "@/funcs/User";

export default function LoginPage() {
  const router = useRouter();
  const cookies = new Cookies();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [notAuthed, setNotAuthed] = useState(true);

  useEffect(() => {
    console.log(
      "Checking if authenticated...",
      notAuthed,
      cookies.get("token")
    );
    IsAuthenticated(router, cookies, setNotAuthed);
    // RefreshAccount();
  }, []);

  const onFormSubmit = (e) => {
    e.preventDefault();

    // console.log(email, password);
    const email = e.target[0].value;
    const password = e.target[1].value;

    var res;

    res = instance
      .post("https://chet.fun/api/v1/login/", {
        email: email,
        password: password,
      })
      .then(function (response) {
        if (response.status == 200) {
          setSuccess(response.data.message);
          setError("");

          cookies.set("token", response.data.token, {
            path: "/",
            expires: new Date(Date.now() + 86400000),
            sameSite: "strict",
          });

          router.push("/dashboard");
        }
      })
      .catch(function (error) {
        setError(error.response.data.message);
        setSuccess("");
      });
  };

  if (notAuthed) {
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
                        Login successful
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>{success}</p>
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
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{" "}
                <Link
                  href="/dashboard/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  create a new account with us
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form
                  className="space-y-6"
                  onSubmit={onFormSubmit}
                  autoComplete="off"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
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
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-0 placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <ThemeButton type="submit">Sign in</ThemeButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  } else {
    return <div></div>;
  }
}
