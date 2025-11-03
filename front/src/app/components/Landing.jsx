"use client";
import Image from "next/image";
import img from "../../../public/land-dero.png";
import Navbar from "./Navbar";
import lg1 from "../../../public/lgo.png";
import lg2 from "../../../public/lg2.png";
import { useRouter } from "next/navigation";
export default function Landing() {
  const router = useRouter();
  return (
    <>
      <Navbar className="fixed top-0 left-0 w-full z-50" />
      <div className="relative h-screen w-full pt-16">
        <Image src={img} alt="Logo" layout="fill" objectFit="cover" priority />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div>
          <h1 className="text-5xl text-black/80 font-raleway font-bold">
            Join, Collaborate and Create
          </h1>
        </div>

        <div className="w-3xl justify-center items-center text-center text-black/80 mt-4 text-xl font-raleway-300">
          <h3>
            Join or create groups, launch live sessions, and solve problems
            together with our integrated chat and interactive whiteboard.
          </h3>
        </div>
        <div className="mt-6 flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 text-gray-800 shadow-md hover:bg-white/90 transition border-2 border-white/50 w-48 justify-center font-raleway-300 cursor-pointer"
            onClick={() => {
              router.push("/signup");
            }}
          >
            <div className="flex items-center gap-4">
              <Image src={lg2} alt="Logo" width={16} height={16} />
              <div>Sign Up</div>
            </div>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 text-gray-800 shadow-md hover:bg-white/90 transition border-2 border-white/50 w-48 justify-center font-raleway-300 cursor-pointer"
            onClick={() => {
              router.push("/canvas");
            }}
          >
            <div className="flex items-center gap-4">
              <Image src={lg1} alt="Logo" width={16} height={16} />
              <div>Try it out</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
