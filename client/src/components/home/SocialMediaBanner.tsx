import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import clsx from "clsx";
import scss from "./slider.module.scss";
import FooterLogos from "../footer/FooterLogos";

const SocialMediaBanner = () => {
  const icons = [
    {
      icon: <FaXTwitter size={24} className="sm:size-6 md:size-8 lg:size-10" />,
      color: "bg-black",
      link: "https://x.com/jandktourism",
    },
    {
      icon: (
        <FaFacebookF size={24} className="sm:size-6 md:size-8 lg:size-10" />
      ),
      color: "bg-blue-600",
      link: "https://www.facebook.com/JKTourismOfficial/",
    },
    {
      icon: <FaYoutube size={24} className="sm:size-6 md:size-8 lg:size-10" />,
      color: "bg-red-600",
      link: "https://www.youtube.com/@JKTourismOfficial",
    },
    {
      icon: (
        <FaInstagram size={24} className="sm:size-6 md:size-8 lg:size-10" />
      ),
      color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
      link: "https://www.instagram.com/jktourismofficial",
    },
  ];

  return (
    <div className="relative w-full">
      {/* Wave Pattern - Adjusted for mobile */}

      <div className="relative pb-6">
        <img
          src="/images/media_bg.png"
          alt="media background image"
          className={scss.media_bg}
        />
        <div className="relative w-full h-12 md:h-20">
          <img
            src="/images/Vector2.png"
            alt="Wave Pattern"
            width={500}
            height={500}
            className="absolute w-full"
            style={{ top: "-90%" }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-20 pt-2 md:pt-5 xl:pt-2 xxl:pt-5 w-full bg-center px-4 sm:px-6 lg:px-24 text-center">
          {/* Heading - Responsive sizing */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-black mb-2 font-[pacifico]">
            Engage with us on Social Media
          </h2>

          {/* Divider - Responsive sizing */}
          <div className={clsx("position-relative flex justify-center mt-6")}>
            <img
              src="/images/Layer_1.png"
              alt="Decorative Divider"
              width={600}
              height={30}
              className="object-contain"
            />
          </div>

          {/* Social Icons - Responsive grid */}
          <div
            className={clsx(
              scss.social_logo_wrapper,
              "position-relative flex justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 my-6 sm:my-8 md:my-12"
            )}
          >
            {icons.map((item, index) => (
              <a
                href={item.link}
                target="_blank"
                key={index}
                className={`position-relative rounded-full p-3 sm:p-4 md:p-5 xxl:p-7 ${item.color} text-white shadow-lg hover:scale-105 sm:hover:scale-110 transition-transform duration-300 relative border-2 sm:border-3 md:border-4 border-white`}
              >
                <div className={scss.star_wrapper}>
                  <img src="/images/star-icon.png" alt="star icon" />
                  <img src="/images/star-icon.png" alt="star icon" />
                  <img src="/images/star-icon.png" alt="star icon" />
                  <img src="/images/star-icon.png" alt="star icon" />
                </div>
                {item.icon}
                <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-300 rounded-full animate-ping opacity-75"></span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <FooterLogos />
    </div>
  );
};

export default SocialMediaBanner;
