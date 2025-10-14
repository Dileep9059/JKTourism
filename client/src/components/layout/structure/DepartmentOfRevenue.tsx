import React from 'react';

const DepartmentOfRevenue = () => {
  return (
    <div
      className="relative bg-white dark:bg-black p-6"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${import.meta.env.VITE_BASE.replace(/\/$/, '')}/background-images.jpg)`,
        }}
      ></div>

      {/* Overlay (different in light and dark mode) */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30"></div>

      {/* Main Content */}
      <div className="relative z-10 w-[95%] mx-auto">
        <div className=" dark:bg-black/60 overflow-hidden w-full rounded-md">
          <div className="flex flex-col lg:flex-row w-full">
            {/* Left Content Section */}
            <div className="flex-1 p-6 lg:p-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 dark:text-white">
                Welcome to Department of Revenue
              </h1>

              <p className="text-gray-900 text-sm sm:text-base leading-relaxed mb-8 text-justify dark:text-white">
                Jammu & Kashmir is divided into Revenue Districts, each headed by a Deputy Commissioner who also functions
                as the District Magistrate and is assisted by Additional Deputy Commissioners, Sub-Divisional Magistrates,
                Tehsildars and Naib-Tehsildars. The District Administration performs a wide range of functions including
                land and revenue management, revenue courts, issuance of statutory certificates, registration of property,
                conduct of elections, relief and rehabilitation, land acquisition and implementation of government schemes.
                It also exercises magisterial powers, supervises delivery of welfare measures and acts as the enforcement
                machinery for government policies at the grassroots level. At the apex of the revenue hierarchy in Jammu &
                Kashmir is the Financial Commissioner (Revenue), who heads the Revenue Department, while the Divisional
                Commissioners of Jammu and Kashmir divisions oversee and coordinate the working of district administrations
                under their jurisdiction.
              </p>

              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 cursor-pointer font-semibold py-3 px-6 rounded transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                View More
              </button>
            </div>

            {/* Right Image Section */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-8 relative overflow-hidden">
              <img
                src={import.meta.env.BASE_URL.replace(/\/$/, '') + `/jk-assembly.jpg`}
                alt="JK Assembly"
                className="w-full sm:w-[80%] md:w-[60%] lg:w-[90%] h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentOfRevenue;
