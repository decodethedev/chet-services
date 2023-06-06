import { useRouter } from "next/router";
import { useEffect } from "react";
import { Cookies } from "react-cookie";

export default function LogoutPage() {
  const cookies = new Cookies();
  const router = useRouter();

  useEffect(() => {
    console.log("Logging out...");
    cookies.set("token", "", {
      path: "/",
      expires: new Date(Date.now()),
      sameSite: "strict",
    });
    // cookies.remove("token");
    router.push("/dashboard/login");
  }, []);
  return <div></div>;
}
