import clsx from "clsx";
import scss from "./footerlogos.module.scss";

const footerLogos = [
    { src: "/images/sm1.png", alt: "india.gov.in" },
    { src: "/images/sm2.png", alt: "myGov" },
    { src: "/images/sm3.png", alt: "data.gov.in" },
    { src: "/images/sm4.png", alt: "Jammu & Kashmir" },
    { src: "/images/sm5.png", alt: "Digital India" },
];

const FooterLogos = () => {
    return (
        <div
            className={clsx(
                scss.footerlogo,
                "border-t  py-10 flex justify-center items-center flex-wrap gap-14 mt-5"
            )}
        >
            {footerLogos.map((logo, index) => (
                <img
                    key={index}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-24 w-auto object-contain"
                />
            ))}
        </div>
    )
}

export default FooterLogos