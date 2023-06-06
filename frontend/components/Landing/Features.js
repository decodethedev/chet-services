import {
  ArrowPathIcon,
  BanknotesIcon,
  CloudArrowUpIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";
import { ComputerDesktopIcon, EyeIcon } from "@heroicons/react/24/outline";

const features = [
  {
    name: "User-friendly Interface",
    description:
      "Introducing an intuitive, responsive layout that's easy to navigate, ensuring you can access our features hassle-free.",
    href: "#",
    icon: ComputerDesktopIcon,
  },
  {
    name: "Stream-proof",
    description:
      "Our user interface can conceal itself from streaming applications and is configurable for external use. We allow our users to experience worry-free closet cheating.",
    href: "#",
    icon: LockClosedIcon,
  },
  {
    name: "Hack vs. Hack",
    description:
      "We take pride in its ability to withstand other cheaters through its competition-crushing features, such as our unique resolver and robust desync.",
    href: "#",
    icon: BanknotesIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-transparent py-24 sm:py-24" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">
            Our Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            It&apos;s packed with power.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            One of our main focuses is the user experience for our customers,
            which is why we harbor numerous features that set us apart from our
            competitors.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon
                    className="h-5 w-5 flex-none text-blue-400"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-blue-400"
                    >
                      {/* Learn more <span aria-hidden="true">→</span> */}
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
