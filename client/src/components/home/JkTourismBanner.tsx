import scss from "./slider.module.scss";
import clsx from "clsx";



const JkTourismBanner = () => {
  return (
    <section className={clsx(scss.mob_app, "relative overflow-hidden px-4 ")}>
      <div className={scss.dark_wave}>
        <img src={`${import.meta.env.VITE_BASE}images/Vector.png`} alt="dark wave image" />
      </div>
      <div className="container  relative rounded-2xl sm:rounded-3xl overflow-hidden mx-auto">
        {/* Background Image + Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={`${import.meta.env.VITE_BASE}images/JKTMobileAppBg.jpg`}
            alt="JK Tourism Background"
            className="object-cover object-center absolute inset-0 w-full h-full"
          // priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6C0200] to-[#6c020000]" />
        </div>
        {/* Main Content */}
        <div className="relative z-20 flex flex-col align-items-center lg:flex-row items-center justify-between px-4 sm:px-8 md:px-16 lg:px-8 py-8 sm:py-16 md:py-10 gap-6 sm:gap-10">
          {/* Text Section */}
          <div className="max-w-3xl space-y-4 sm:space-y-6 text-white text-center lg:text-left lg:mx-10">
            <div className={scss.common_title}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className={`font-[Pacifico] block`}>
                  JK Tourism
                </span>
                <span
                  className={`font-[Pacifico] block text-xl sm:text-3xl md:text-4xl mt-1 sm:mt-2`}
                  style={{ color: "#FF9F03" }}
                >
                  Mobile Application
                </span>
              </h1>

              <div className="flex sm:justify-center lg:justify-start my-6">
                <img
                  src={`${import.meta.env.VITE_BASE}images/dark_btm_line.svg`}
                  alt="Decorative Divider"
                  width={350}
                  height={30}
                  className="object-contain"
                  loading="lazy"
                />
              </div>

              <p className="leading-relaxed px-1 sm:px-0 font-light">
                Discover the beauty of Jammu & Kashmir with the official
                JKTourism mobile app. From destinations and itineraries to local
                crafts and travel tips, everything is just a tap away.
              </p>
            </div>

            <div className={scss.app_download}>
              <a href="">
                <img src={`${import.meta.env.VITE_BASE}images/playstore-img.png`} alt="playstore icon" />
              </a>
              <a href="">
                <img src={`${import.meta.env.VITE_BASE}images/appstore-img.png`} alt="appstore icon" />
              </a>
            </div>
          </div>

          {/* Mobile App Images - Adjusted for mobile */}
          <div className="flex gap-3 sm:gap-6 justify-center items-center lg:justify-end flex-wrap sm:flex-nowrap mt-4 sm:mt-0 lg:h-[52vh]">
            <div className="relative w-48 sm:w-54 xs:w-60 md:w-64 lg:w-full ">
              <img
                src={`${import.meta.env.VITE_BASE}images/Layer_1 (1).png`}
                alt="Mobile App Login"
                width={550}
                height={1400}
                className="drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JkTourismBanner;
