import scss from "./review.module.scss";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import clsx from "clsx";
import type { Review } from "../utils/types";

function Reviewtab({ reviews }: { reviews: Review[] }) {
  return (
    <div className={scss.reviewmain}>
      {reviews?.length === 0 && <>No reviews found.</>}

      {reviews?.length > 0 &&
        reviews?.map((review, index) => (
          <div className={scss.rtitem} key={index}>
            <div className={scss.rtcontent}>
              <div className={scss.post_excerpt}>
                <FaQuoteLeft className={scss.quoteicon} />
                <p>{review?.content}</p>
              </div>
              <div className={scss.clientinfo}>
                <div className={scss.rtcinfo}>
                  <div className={scss.clientimg}>
                    <img src={`${import.meta.env.VITE_BASE}assets/images/slider1.jpeg`} alt="" title="" />
                  </div>
                  <div
                    className={clsx(
                      scss.clientrfcinfo,
                      "d-flex flex-column gap-2"
                    )}
                  >
                    <span>{review.name}</span>
                    {/* <h3>London</h3> */}
                  </div>
                </div>
                <div className={scss.ratingicon}>
                  {[...Array(review?.rating || 0)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                  <span>({review?.rating})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Reviewtab;
