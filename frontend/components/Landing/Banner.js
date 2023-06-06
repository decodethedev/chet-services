import { XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState } from "react";

export default function Banner() {
  const [show, setShow] = useState(true);

  if (!show) return null;
  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-800 py-2.5 px-6 sm:px-3.5 sm:before:flex-1">
      <svg
        viewBox="0 0 577 310"
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 w-[36.0625rem] -translate-y-1/2 transform-gpu blur-2xl"
      >
        <use href="#1d77c128-3ec1-4660-a7f6-26c7006705ad" />
      </svg>
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
        <p className="text-sm leading-6 text-gray-50">
          <strong className="font-semibold">Beta Access</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Get beta access to Chet to experience the best.
        </p>
        <Link
          href="https://discord.gg/GDYwkm5n4Q"
          className="flex-none rounded-full bg-gradient-to-r from-blue-800 to-blue-500 py-1 px-3.5 text-sm font-semibold text-white shadow-sm hover:scale-110 transition duration-100 active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
         Join our Discord <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
          onClick={() => setShow(false)}
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
