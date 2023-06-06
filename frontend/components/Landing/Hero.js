import { ChevronRightIcon, CodeBracketIcon } from "@heroicons/react/20/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900">
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
      <svg
        viewBox="0 0 1108 632"
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 w-[69.25rem] max-w-none transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
      >
        <path
          fill="url(#175c433f-44f6-4d59-93f0-c5c51ad5566d)"
          fillOpacity=".2"
          d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"
        />
        <defs>
          <linearGradient
            id="175c433f-44f6-4d59-93f0-c5c51ad5566d"
            x1="1220.59"
            x2="-85.053"
            y1="432.766"
            y2="638.714"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4F46E5" />
            <stop offset={1} stopColor="#80CAFF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:py-40 lg:px-8">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="sm:mt-30 lg:mt-16">
            <Link
              href="https://store.chet.fun"
              className="inline-flex space-x-6"
            >
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-400 ring-1 ring-inset ring-blue-500/20">
                Work in progress
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300 hover:translate-x-1 transition-all duration-50">
                <span>Get Beta access</span>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
          <h1 className="text-center sm:text-left mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Enter Chet, the{" "}
            <strong className="text-blue-400/50">epitome</strong>
            {"\n"}
            of script utilities.
          </h1>
          <p className="text-center sm:text-left mt-6 text-lg leading-8 text-blue-500/80">
            Crafted with versatility in mind, we guarantee that you&apos;ll find
            what you need - whether you want to give yourself a discreet edge
            over the competition or bring about the downfall of your opponents
            in the flashiest way possible.
          </p>
          <div className="mt-10 flex items-center  gap-x-6 ">
          
            <Link
              type="button"
              href="https://store.chet.fun"
              className="relative inline-flex items-center gap-x-1.5 rounded-md bg-gradient-to-r from-blue-800 to-blue-500 transition duration-100 ease-in-out px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:scale-110 active:scale-90"
            >
              <ArrowRightOnRectangleIcon
                className="-ml-0.5 h-5 w-5"
                aria-hidden="true"
              />
              Get Started
            </Link>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-white hover:translate-x-1 transition-all duration-50"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <video
              src="/videos/show_ui.mp4"
              alt="App screenshot"
              width={837}
              height={587}
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 transition-all duration-100 ease-in hover:-skew-x-6 hover:-skew-y-6"
              autoPlay
              muted
              loop
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}
