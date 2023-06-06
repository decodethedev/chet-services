import {
  BoltIcon,
  BoltSlashIcon,
  CloudArrowUpIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ServerIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const features = [
  {
    name: "Stay hidden from prying eyes.",
    description:
      " Our external utility can suppress itself from process scanners, such as Process Hacker and Process Monitor.",
    icon: EyeSlashIcon,
  },
  {
    name: "It's clean and easy to use",
    description:
      'Unlike most "streamable" utilities, we don\'t leave our users to configure tables. Our utility presents an easily accessible external user interface, making it effortless to configure and use.',
    icon: BoltIcon,
  },
  {
    name: "We're not douchebags.",
    description:
      "We won't charge you extra for access to the external version - it comes with any chet.fun subscription you have.",
    icon: UserCircleIcon,
  },
];

// export default function ExternalUI() {
//   return (
//     <div className="overflow-hidden bg-[#192338] py-24 sm:py-32">
//       <div className="mx-auto max-w-7xl px-6 lg:px-8">

//         <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
//           <div className="lg:ml-auto lg:pl-4 lg:pt-4">

//             <div className="lg:max-w-lg">
//               <h2 className="text-base font-semibold leading-7 text-blue-600">Stay hidden</h2>
//               <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Hidden Desktop U.I</p>
//               <p className="mt-6 text-lg leading-8 text-gray-400">
//                 Every Chet customers get to use our Premium U.I Client, powered by your executors, which allows you to use Chet's features without any traces of Chet being present on your computer.
//               </p>
//               <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-400 lg:max-w-none">
//                 {features.map((feature) => (
//                   <div key={feature.name} className="relative pl-9">
//                     <dt className="inline font-semibold text-white">
//                       <feature.icon className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
//                       {feature.name}
//                     </dt>{' '}
//                     <dd className="inline">{feature.description}</dd>
//                   </div>
//                 ))}
//               </dl>
//             </div>
//           </div>
//           <div className="flex items-start justify-end lg:order-first">
//             <Image
//               src="/images/external_ui.png"
//               alt="External UI"
//               className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
//               width={2432}
//               height={1442}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default function Example() {
  return (
    <div className="bg-[#192338] py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
            <div className="lg:row-start-2 lg:max-w-md">
              <div class="text-lg font-bold inline-flex items-center leading-sm uppercase px-3 py-1 bg-blue-200 text-blue-700 rounded- mb-3 rounded-full">
                <BoltIcon />
                Upcoming
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Undetectability to the next level.
                <br />
                <span className="text-blue-400">
                  We introduce to you - chet.fun&apos;s external utility.
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Customers at chet.fun can enjoy using our powerful external user
                interface through sxlib. It guarantees a satisfactory undercover
                cheating experience for its users.
              </p>
            </div>
            <Image
              src="/images/external_ui.png"
              alt="Ui"
              className="relative -z-20 min-w-full max-w-xl shadow-xl ring-1 ring-white/10 lg:row-span-4 lg:w-[64rem] lg:max-w-none"
              width={2432}
              height={1442}
            />
            <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">
              <dl className="max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt className="ml-9 inline-block font-semibold text-white">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-blue-600"
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div
            className="pointer-events-none absolute left-12 top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-3xl lg:bottom-[-12rem] lg:top-auto lg:translate-y-0 lg:transform-gpu"
            aria-hidden="true"
          >
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#8d80ff] to-[#3540c0] opacity-25"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
