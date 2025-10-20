import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaAndroid } from "react-icons/fa";
import { IoIosAppstore } from "react-icons/io";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, LogIn, Wallpaper } from "lucide-react";
import { axiosPrivate } from "@/axios/axios";
import { d } from "@/components/utils/crypto";

type CardCount = {
  loginCount: number;
  iosCount: number;
  androidCount: number;
  activeAccounts: number;
};
export function SectionCards() {
  const [cardCounts, setCardCounts] = useState<CardCount>({
    iosCount: 0,
    androidCount: 0,
    loginCount: 0,
    activeAccounts: 0,
  } as CardCount);

  async function getCounts(): Promise<CardCount> {
    const res = await axiosPrivate.get("/api/dashboard/get-card-count");
    return JSON.parse(await d(res?.data));
  }

  useEffect(() => {
    try {
      (async () => {
        const json = await getCounts();
        setCardCounts(json);
      })();
    } catch (error: any) {
      toast.error("Unable to get Counts.");
    }
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-3 mb-3">
        <Card className="bg-gradient-to-tr from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/20 shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Total Downloads
              </CardDescription>
              <CardTitle className="text-blue-900 dark:text-white text-4xl font-extrabold">
                {cardCounts?.iosCount + cardCounts?.androidCount}
              </CardTitle>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                All time
              </p>
            </div>
            <Download className="h-12 w-12 text-blue-500 opacity-80" />
          </CardHeader>
          <CardFooter className="flex justify-between text-sm mt-4">
            <div className="flex items-center gap-2">
              <IoIosAppstore className="h-6 w-6 text-blue-500" />
              <span>{cardCounts?.iosCount ?? 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaAndroid className="h-6 w-6 text-green-600" />
              <span>{cardCounts?.androidCount ?? 0}</span>
            </div>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-tr from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/20 shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-purple-700 dark:text-purple-300">
                Login
              </CardDescription>
              <CardTitle className="text-purple-900 dark:text-white text-4xl font-extrabold">
                {cardCounts.loginCount}
              </CardTitle>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Today
              </p>
            </div>
            <LogIn className="h-12 w-12 text-purple-500 opacity-80"/>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-tr from-teal-50 to-teal-100 dark:from-teal-900/40 dark:to-teal-800/20 shadow-md border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription className="text-teal-700 dark:text-teal-300">
                Active Accounts
              </CardDescription>
              <CardTitle className="text-teal-900 dark:text-white text-4xl font-extrabold">
                {cardCounts.activeAccounts}
              </CardTitle>
              <p className="text-sm text-teal-600 dark:text-teal-400">
                Currently
              </p>
            </div>
            <Wallpaper className="h-12 w-12 text-teal-500 opacity-80"/>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
