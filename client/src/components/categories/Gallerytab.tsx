import React from "react";
import clsx from 'clsx';
import scss from "./gallerytab.module.scss";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const Gallerytab = ({ galleryImages }: { galleryImages: string[] }) => {
  // Initialize Fancybox when the component mounts
  React.useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      // You can add options here if needed
    });
  }, []);

  return (
    <div className={clsx(scss.gallerymainContainer)}>
      <div className={scss.gallerymain}>
        {galleryImages?.map((image, index) => (
          <div className={clsx(scss.galleryItem)} key={index}>
            <a className={scss.gallery_img} href={`${import.meta.env.VITE_APP_API_BASE_URL
              }/files/load-file-by-path?path=${image}`} data-fancybox data-caption="Single image">
              <img src={`${import.meta.env.VITE_APP_API_BASE_URL
                }/files/load-file-by-path?path=${image}`}
                width={920}
                height={700}
                alt="Image" 
                loading="lazy"/>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallerytab;