import {
  BoltIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  LightBulbIcon,
  LockClosedIcon,
  ServerIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";

const features = [
  {
    name: "Experienced developers.",
    description:
      "We have experience. We are more than qualified to manage our utility, as we all have been doing so for over two years. Our team comprises developers from different scripts: Abyss, Pika Hub, and Zyrex Hub.",
    icon: UserGroupIcon,
  },
  {
    name: "Blazing fast updates.",
    description:
      "We update at the speed of light. There&apos;s no need to hassle over patches or missing features, as we frequently work to improve and advance.",
    icon: BoltIcon,
  },
  {
    name: "Amazing customer support.",
    description:
      "We have friendly customer support. We are always willing to help you with issues you have. As we work to enhance our utility, we are always open to suggestions.",
    icon: ChatBubbleLeftRightIcon,
  },
];

export default function SecondaryFeatures() {
  return (
    <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-blue-400">
                It&apos;s made by cheaters, for cheaters.
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Competent developers
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Our team consists of experienced developers with individual
                fields of expertise, working to improve and polish our utility
                to make it seem first-class.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon
                        className="absolute top-1 left-1 h-5 w-5 text-blue-500"
                        aria-hidden="true"
                      />
                      {/* {feature.name} */}
                    </dt>{" "}
                    <dd className="text-white font-semibold">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          
          <Image
              src="/images/ui.png"
              alt="External UI"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              width={2432}
              height={1442}
            />
        </div>
      </div>
    </div>
  );
}
