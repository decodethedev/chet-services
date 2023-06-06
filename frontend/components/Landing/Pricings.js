import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

// const frequencies = [
//   { value: "monthly", label: "Monthly", priceSuffix: "/month" },
//   { value: "annually", label: "Annually", priceSuffix: "/year" },
// ];
const tiers = [
  {
    name: "Starting",
    id: "tier-starting",
    href: "https://store.chet.fun",
    price: { monthly: "$2" },
    description:
      "The perfect plan for individuals on budget that lasts for 1 month.",
    features: [
      "1 Month of Chet",
      "Unlimited executions",
      "Unlimited updates",
      "Blazing fast support",
      "All games",
    ],
    mostPopular: false,
  },
  {
    name: "Basic",
    id: "tier-basic",
    href: "https://store.chet.fun",
    price: { monthly: "$5.50" },
    description:
      "A plan that scales with your haxing needs. Lasts for 3 months.",
    features: [
      "3 Months of Chet",
      "Unlimited executions",
      "Unlimited updates",
      "Blazing fast support",
      "All games",
    ],
    mostPopular: false,
  },
  {
    name: "Lifetime",
    id: "tier-lifetime",
    href: "https://store.chet.fun",
    price: { monthly: "$15" },
    description: "The best plan for individuals that lasts FOREVER",
    features: [
      "Lifetime license of Chet",
      "Unlimited executions",
      "Unlimited updates",
      "Blazing fast support",
      "All games",
    ],
    mostPopular: true,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricings() {
  //   const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div className="bg-gray-900 py-24 sm:py-32" id="pricings">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pricing plans for any individuals
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-300">
          Choose an affordable plan that’s packed with the best features
          according to your needs.
        </p>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular
                  ? "bg-white/5 ring-2 ring-blue-500 "
                  : "ring-1 ring-white/10",
                "rounded-3xl p-8 xl:p-10"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className="text-lg font-semibold leading-8 text-white"
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-gradient-to-r from-blue-800 to-blue-500 py-1 px-2.5 text-xs font-semibold leading-5 text-white">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-300">
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-white">
                  {tier.price["monthly"]}
                </span>
              </p>
              <Link
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-gradient-to-r from-blue-800 to-blue-500 text-white shadow-sm hover:bg-blue-400 focus-visible:outline-blue-500 transition duration-100 hover:scale-110 active:scale-90"
                    : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
                  "mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                )}
              >
                Buy plan
              </Link>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-300 xl:mt-10"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-white"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
