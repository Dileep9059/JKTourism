import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const NotificationsTenders = () => {
  const [activeTab, setActiveTab] = useState("notifications");

  const notifications = [
    {
      id: 1,
      title: "Public Notice- Special Drive for Disposal of PM-UDAY application.",
      date: "05-12-2024",
    },
    {
      id: 2,
      title:
        "Public Notice- Special Verification Camps for the Applications for employment to 1984 Anti Sikh Riot Victims.",
      date: "27-11-2024",
    },
    {
      id: 3,
      title:
        "Notice for the award announced for land bearing khasra no. 221/2/1 & 221/2/3 of Village Nangli Razapur, for construction of 3rd phase of elevated road over Barapullah Nallah starting from Sarai Kale Khan to Mayur Vihar.",
      date: "08-07-2024",
    },
    {
      id: 4,
      title: "Public Notice- Special Drive for Disposal of PM-UDAY application.",
      date: "05-12-2024",
    },
    {
      id: 5,
      title:
        "Public Notice- Special Verification Camps for the Applications for employment to 1984 Anti Sikh Riot Victims.",
      date: "27-11-2024",
    },

  ];

  const tenders = [
    {
      id: 1,
      title:
        "Tender for Supply and Installation of LED Street Lights in Delhi Municipal Areas",
      date: "15-12-2024",
      lastDate: "25-12-2024",
      amount: "₹50,00,000",
    },
    {
      id: 2,
      title: "Construction of Community Hall at Sector 15, Rohini",
      date: "10-12-2024",
      lastDate: "20-12-2024",
      amount: "₹75,00,000",
    },
    {
      id: 3,
      title: "Construction of Community Hall at Sector 15, Rohini",
      date: "10-12-2024",
      lastDate: "20-12-2024",
      amount: "₹75,00,000",
    },

    {
      id: 4,
      title: "Construction of Community Hall at Sector 15, Rohini",
      date: "10-12-2024",
      lastDate: "20-12-2024",
      amount: "₹75,00,000",
    },

    {
      id: 5,
      title: "Construction of Community Hall at Sector 15, Rohini",
      date: "10-12-2024",
      lastDate: "20-12-2024",
      amount: "₹75,00,000",
    },

  ];

  const officials = [
    {
      id: 1,
      name: "Manoj Sinha",
      position: "Lieutenant Governor",
      shortName: "SVKS",
      image: "/Lieutenant-Governor.jpg",
    },
    {
      id: 2,
      name: "Omar Abdullah",
      position: "Chief Minister",
      shortName: "SRG",
      image: "/Chief-Minister.jpg",
    },
    { id: 3, name: "Sh. Ramesh Kumar, IAS ", position: "Divisional Commissioner Jammu", shortName: "Jammu", image: "/Divisional-Commissioner.webp" }
  ];

  return (
    <div
      className="w-full dark:bg-gray-900 py-8 sm:py-12 lg:py-16"
      style={{
        backgroundImage: `url(${import.meta.env.VITE_BASE.replace(/\/$/, '')}/background-images.jpg)`,
      }}
    >
      <div className="max-w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden container px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => setActiveTab("notifications")}
            variant="ghost"
            className={`rounded-none px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base border-b-2 transition-all duration-200
              ${activeTab === "notifications"
                ? "text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 bg-white dark:bg-gray-900"
                : "text-gray-600 dark:text-gray-300 border-transparent hover:text-indigo-600 hover:border-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Notifications
          </Button>

          <Button
            onClick={() => setActiveTab("tenders")}
            variant="ghost"
            className={`rounded-none px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base border-b-2 transition-all duration-200
              ${activeTab === "tenders"
                ? "text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400 bg-white dark:bg-gray-900"
                : "text-gray-600 dark:text-gray-300 border-transparent hover:text-emerald-600 hover:border-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            Tenders
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Notifications/Tenders List */}
          <div className="flex-1 lg:w-3/5 p-4 sm:p-6 lg:border-r border-gray-200 dark:border-gray-600">
            <div className="h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              <div className="space-y-4 pr-2">
                {activeTab === "notifications"
                  ? notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg p-4 sm:p-5 border-l-4 border-indigo-600 dark:border-indigo-400 transition-all duration-200 hover:shadow-md group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">
                            {notification.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Date: {notification.date}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                  : tenders.map((tender) => (
                    <div
                      key={tender.id}
                      className="bg-gray-50 dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg p-4 sm:p-5 border-l-4 border-emerald-600 dark:border-emerald-400 transition-all duration-200 hover:shadow-md group cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                            {tender.title}
                          </h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              Published: {tender.date}
                            </p>
                            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                              Last Date: {tender.lastDate}
                            </p>
                            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                              Est. Amount: {tender.amount}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* View All Button */}
            <div className="mt-6 text-center">
              <Button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 text-sm sm:text-base">
                View All {activeTab === "notifications" ? "Notifications" : "Tenders"}
              </Button>
            </div>
          </div>

          {/* Officials Section */}
          <div className="w-full lg:w-2/7 bg-gray-50 dark:bg-gray-800 lg:bg-white dark:lg:bg-gray-800 p-4 sm:p-6">
            <div className="h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 pr-2">
              <div className="space-y-6">
                {officials.map((official) => (
                  <div
                    key={official.id}
                    className="bg-white dark:bg-gray-700 lg:bg-gray-50 dark:lg:bg-gray-700 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-shadow p-4"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
                        {official.image ? (
                          <img
                            src={official.image}
                            alt={official.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg sm:text-xl">
                              {official.shortName}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">
                          {official.position}
                        </p>
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                          {official.name}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTenders;
