import Image from "next/image";

const people = [
  {
    name: "Zyrex",
    role: "Lead Script Developer",
    imageUrl: "/images/zyrex_pfp.webp",
    discordTag: "Zyrex#5659",
  },
  {
    name: "Decode",
    role: "Lead Web/ Bot Developer",
    imageUrl: "/images/decode_pfp.webp",
    discordTag: "decode#2634",
  },
  {
    name: "Dne",
    role: "Lead Script Developer",
    imageUrl: "/images/dne_pfp.webp",
    discordTag: "dne#4322",
  },
  {
    name: "arcana",
    role: "Script Developer",
    imageUrl: "/images/arcana_pfp.webp",
    discordTag: "arcana#0985",
  },
  {
    name: "Risky",
    role: "Financial Manager",
    imageUrl: "/images/risky_pfp.webp",
    discordTag: "risky#0009",
  },
  // More people...
];

export default function Team() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32" id="team">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Meet our team
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-400">
            We’re a dynamic group of individuals who are passionate about what
            we do.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
          {people.map((person) => (
            <li
              key={person.name}
              className="rounded-2xl bg-gray-800 py-10 px-8"
            >
              <Image
                className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                src={person.imageUrl}
                width={144}
                height={144}
                alt=""
              />
              <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-white">
                {person.name}
              </h3>
              <p className="text-sm leading-6 text-gray-400">{person.role}</p>
              <p className="text-sm leading-6 text-blue-500/80 font-bold">
                {person.discordTag}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
