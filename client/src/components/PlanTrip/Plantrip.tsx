import { useEffect, useState } from "react";
import scss from "./trip.module.scss";
import clsx from "clsx";


const Plantrip = () => {

    const [activeTab, setActiveTab] = useState<"jammu" | "kashmir">(
        "kashmir"
    );

    const [selectedDay, setSelectedDay] = useState("");

    const handleScroll = (id: string) => {
        if (!id) return;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const dayParam = params.get("days");
            const hash = window.location.hash?.substring(1);

            const target = dayParam || hash;
            if (target) {
                setSelectedDay(target);
                handleScroll(target);
            }
        }
    }, []);

    return (
        <>
            <div className={scss.common_page}>
                <div className="banner">
                    <img
                        src={`${import.meta.env.VITE_BASE}assets/images/slider1.jpeg`}
                        alt="Banner"
                        className={clsx(
                            scss.banner_image,
                            "w-full !max-h-[400px] object-cover"
                        )}
                        loading="lazy"
                    />
                </div>
                <div className="container mx-auto">
                    <div className={scss.destination_title}>
                        <h2 className={clsx(scss.cattitle, "mt-5")}>Plan Your Trip</h2>
                    </div>

                    <div className={scss.connections}>
                        <h6 className={scss.title}>How to Reach JK</h6>
                        <div className={scss.connection_wrapper}>
                            <div className={scss.connection_block}>
                                <div className={scss.flip_card_inner}>
                                    <div className={scss.flip_card_front}>
                                        <div className={scss.connection_icon}>
                                            <img
                                                src={`${import.meta.env.VITE_BASE}assets/images/icons/air-icon.png`}
                                                alt="air icon"
                                            />
                                        </div>
                                        <h6>Air</h6>
                                    </div>
                                    <div className={scss.flip_card_back}>
                                        <p>
                                            The primary airport is Srinagar International Airport,
                                            with regular flights from major cities like Delhi and
                                            Mumbai. Jammu Airport also serves flights from various
                                            parts of the country.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={scss.connection_block}>
                                <div className={scss.flip_card_inner}>
                                    <div className={scss.flip_card_front}>
                                        <div className={scss.connection_icon}>
                                            <img
                                                src={`${import.meta.env.VITE_BASE}assets/images/icons/train-icon.png`}
                                                alt="road icon"
                                            />
                                        </div>
                                        <h6>Road</h6>
                                    </div>
                                    <div className={scss.flip_card_back}>
                                        <p>
                                            Highways connect J&K to the rest of the country. The
                                            Srinagar-Jammu National Highway is a popular route, with
                                            buses and taxis readily available.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className={scss.connection_block}>
                                <div className={scss.flip_card_inner}>
                                    <div className={scss.flip_card_front}>
                                        <div className={scss.connection_icon}>
                                            <img
                                                src={`${import.meta.env.VITE_BASE}assets/images/icons/road-icon.jpg`}
                                                alt="train icon"
                                            />
                                        </div>
                                        <h6>Train</h6>
                                    </div>
                                    <div className={scss.flip_card_back}>
                                        <p>
                                            The main railway station is Jammu Tawi, well-connected to
                                            cities such as Delhi, Kolkata, and Chennai. Notable trains
                                            include the Jammu Rajdhani, Jammu Mail, and Himsagar
                                            Express.​ A new train service is going to start to Katra
                                            and from there to Kashmir from April 19.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={scss.tabs_section}>
                        <div className={scss.tabs_header}>
                            <button
                                className={activeTab === "kashmir" ? scss.active_tab : ""}
                                onClick={() => setActiveTab("kashmir")}
                            >
                                Tour Plan Kashmir
                            </button>
                            <button
                                className={activeTab === "jammu" ? scss.active_tab : ""}
                                onClick={() => setActiveTab("jammu")}
                            >
                                Tour Plan Jammu
                            </button>
                        </div>
                        <div className={scss.tabs_content}>
                            {activeTab === "kashmir" ? (
                                <div>
                                    <div className={clsx(scss.navbar, "!bg-white/90")}>
                                        <label
                                            htmlFor="daySelector"
                                            className={scss.dropdown_label}
                                        >Jump to Plan:</label>
                                        <select
                                            id="daySelector"
                                            onChange={(e) => handleScroll(e.target.value)}
                                            className={scss.dropdown}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                Select Days
                                            </option>
                                            <option value="3-days">3 Days</option>
                                            <option value="4-days">4 Days</option>
                                            <option value="5-days">5 Days</option>
                                            <option value="6-days">6 Days</option>
                                            <option value="7-days">7 Days</option>
                                            <option value="10-days">10 Days</option>
                                        </select>
                                    </div>
                                    <div id="3-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 3 Days in Kashmir</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Srinagar. Enjoy a&nbsp;<b>Shikara ride</b>
                                                &nbsp; on Dal Lake and visit&nbsp;<b>Mughal Gardens</b>.
                                                Try fishing in Dal Lake in the evening.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore&nbsp;<b>Gulmarg</b>. Optional activities include
                                                taking the&nbsp;<b>Gulmarg Gondola</b>&nbsp;and skiing
                                                in winter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit&nbsp;<b>Pahalgam</b>, known for its scenic beauty
                                                and trekking opportunities.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="4-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 4 Days in Kashmir</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Srinagar. Enjoy a&nbsp;<b>Shikara ride</b>
                                                &nbsp; on Dal Lake and visit&nbsp;<b>Mughal Gardens</b>.
                                                Try fishing in Dal Lake in the evening.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore&nbsp;<b>Gulmarg</b>. Optional activities include
                                                taking the&nbsp;<b>Gulmarg Gondola</b>&nbsp;and skiing
                                                in winter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit&nbsp;<b>Pahalgam</b>, known for its scenic beauty
                                                and trekking opportunities.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Sonamarg</b>, renowned for its picturesque
                                                landscapes and as a base for treks.​ Be mesmerised by
                                                the massive size and beauty of Thajiwas glacier.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="5-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 5 Days in Kashmir</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Srinagar. Enjoy a&nbsp;<b>Shikara ride</b>
                                                &nbsp; on Dal Lake and visit&nbsp;<b>Mughal Gardens</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore&nbsp;<b>Gulmarg</b>. Optional activities include
                                                taking the&nbsp;<b>Gulmarg Gondola</b>&nbsp;and skiing
                                                in winter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit&nbsp;<b>Pahalgam</b>, known for its scenic beauty
                                                and trekking opportunities.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Sonamarg</b>, renowned for its picturesque
                                                landscapes and as a base for treks.​ Be mesmerised by
                                                the massive size and beauty of Thajiwas glacier.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Yusmarg</b>, a tranquil meadow ideal for
                                                nature walks and horse riding.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="6-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 6 Days in Kashmir</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Srinagar. Enjoy a&nbsp;<b>Shikara ride</b>
                                                &nbsp; on Dal Lake and visit&nbsp;<b>Mughal Gardens</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore&nbsp;<b>Gulmarg</b>. Optional activities include
                                                taking the&nbsp;<b>Gulmarg Gondola</b>&nbsp;and skiing
                                                in winter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit&nbsp;<b>Pahalgam</b>, known for its scenic beauty
                                                and trekking opportunities.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Sonamarg</b>, renowned for its picturesque
                                                landscapes and as a base for treks.​ Be mesmerised by
                                                the massive size and beauty of Thajiwas glacier.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Yusmarg</b>, a tranquil meadow ideal for
                                                nature walks and horse riding.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 6</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Doodhpathri</b>, a lesser-known destination
                                                offering lush green meadows and serene environments.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="7-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 7 Days in Kashmir</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Srinagar. Enjoy a&nbsp;<b>Shikara ride</b>
                                                &nbsp; on Dal Lake and visit&nbsp;<b>Mughal Gardens</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore&nbsp;<b>Gulmarg</b>. Optional activities include
                                                taking the&nbsp;<b>Gulmarg Gondola</b>&nbsp;and skiing
                                                in winter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit&nbsp;<b>Pahalgam</b>, known for its scenic beauty
                                                and trekking opportunities.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Sonamarg</b>, renowned for its picturesque
                                                landscapes and as a base for treks.​ Be mesmerised by
                                                the massive size and beauty of Thajiwas glacier.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Yusmarg</b>, a tranquil meadow ideal for
                                                nature walks and horse riding.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 6</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Doodhpathri</b>, a lesser-known destination
                                                offering lush green meadows and serene environments.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 7</div>
                                            <div className={scss.day_content}>
                                                Explore the historic city of <b>Jammu</b>, visiting{" "}
                                                <b>Raghunath Temple and Bahu Fort</b>.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="10-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 10 Days in Kashmir</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Srinagar. Enjoy a&nbsp;<b>Shikara ride</b>
                                                &nbsp; on Dal Lake and visit&nbsp;<b>Mughal Gardens</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore&nbsp;<b>Gulmarg</b>. Optional activities include
                                                taking the&nbsp;<b>Gulmarg Gondola</b>&nbsp;and skiing
                                                in winter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit&nbsp;<b>Pahalgam</b>, known for its scenic beauty
                                                and trekking opportunities.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Sonamarg</b>, renowned for its picturesque
                                                landscapes and as a base for treks.​ Be mesmerised by
                                                the massive size and beauty of Thajiwas glacier.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Yusmarg</b>, a tranquil meadow ideal for
                                                nature walks and horse riding.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 6</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Doodhpathri</b>, a lesser-known destination
                                                offering lush green meadows and serene environments.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 7</div>
                                            <div className={scss.day_content}>
                                                Explore the historic city of <b>Jammu</b>, visiting{" "}
                                                <b>Raghunath Temple and Bahu Fort</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Days 8-10</div>
                                            <div className={scss.day_content}>
                                                Explore the region of <b>Ladakh</b>, visiting{" "}
                                                <b>Leh, Pangong Lake, and monasteries</b>.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className={clsx(scss.navbar, "!bg-white/90")}>
                                        <label
                                            htmlFor="daySelector"
                                            className={clsx(scss.dropdown_label)}
                                        >
                                            Jump to Plan:
                                        </label>
                                        <select
                                            id="daySelector"
                                            onChange={(e) => handleScroll(e.target.value)}
                                            className={scss.dropdown}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                Select Days
                                            </option>
                                            <option value="3-days">3 Days</option>
                                            <option value="4-days">4 Days</option>
                                            <option value="5-days">5 Days</option>
                                            <option value="6-days">6 Days</option>
                                            <option value="7-days">7 Days</option>
                                            <option value="10-days">10 Days</option>
                                        </select>
                                    </div>
                                    <div id="3-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 3 Days in JAMMU</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Jammu. Visit the <b>Raghunath Temple</b> and
                                                take a walk around the local markets.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Vaishno Devi Temple</b>, one of the most
                                                famous pilgrimage sites in India. Optionally, take a
                                                helicopter ride to the temple.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit the historic <b>Bahu Fort</b>, which offers
                                                stunning views of <b>Jammu city</b>, and enjoy a
                                                peaceful evening at <b>Mansar Lake</b>.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="4-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 4 Days in JAMMU</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Jammu. Visit the <b>Raghunath Temple</b> and
                                                take a walk around the local markets.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Vaishno Devi Temple</b>, one of the most
                                                famous pilgrimage sites in India. Optionally, take a
                                                helicopter ride to the temple.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit the historic <b>Bahu Fort</b>, which offers
                                                stunning views of <b>Jammu city</b>, and enjoy a
                                                peaceful evening at <b>Mansar Lake</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Visit the serene <b>Mansar Lake</b> and explore the
                                                beautiful surroundings for a relaxing day
                                            </div>
                                        </div>
                                    </div>
                                    <div id="5-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 5 Days in JAMMU</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Jammu. Visit the <b>Raghunath Temple</b> and
                                                take a walk around the local markets.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Go for a pilgrimage to <b>Vaishno Devi Temple</b>. You
                                                can choose to trek or take the helicopter ride.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Bahu Fort</b> and explore its ancient
                                                architecture. Spend the evening by Tawi River or explore
                                                the Shalimar Gardens.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Explore the ancient <b>Ranbireshwar Temple</b> and
                                                nearby religious sites. Take a day trip to the stunning
                                                Mansar Lake.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Visit the beautiful <b>Patnitop</b>, known for its lush
                                                pine forests and scenic views.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="6-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 6 Days in JAMMU</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Jammu. Visit the <b>Raghunath Temple</b> and
                                                take a walk around the local markets.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Vaishno Devi Temple</b>, taking either the trek
                                                or the helicopter ride to reach the temple.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Bahu Fort</b> and enjoy the scenic views of
                                                the Tawi River. Spend the evening at Ranbireshwar
                                                Temple.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Discover the beauty of <b>Mansar Lake</b> and nearby
                                                temples. Optionally, go on a nature walk around the
                                                lake.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Take a day trip to <b>Patnitop</b> for a scenic view of
                                                the Himalayan range. Explore the meadows and indulge in
                                                adventure sports like paragliding.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 6</div>
                                            <div className={scss.day_content}>
                                                Visit the historic <b>Mubarak Mandi</b> Palace and
                                                explore the Jammu Museum for a deeper dive into the
                                                region’s history.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="7-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 7 Days in JAMMU</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Jammu. Visit the <b>Raghunath Temple</b> and
                                                soak in the local culture at the bustling markets.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Visit the <b>Vaishno Devi Temple</b>, trekking or taking
                                                the helicopter as per preference.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Bahu Fort</b>, enjoy the panoramic views, and
                                                visit <b>Ranbireshwar Temple</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Spend the day at <b>Mansar Lake</b>, surrounded by lush
                                                green forests, perfect for nature walks.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Head to <b>Patnitop</b> to experience its natural
                                                beauty, and enjoy outdoor activities like paragliding
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 6</div>
                                            <div className={scss.day_content}>
                                                Visit the beautiful <b>Shiv Khori caves</b>, a revered
                                                pilgrimage site dedicated to Lord Shiva.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 7</div>
                                            <div className={scss.day_content}>
                                                Explore Jammu's historic sites like <b>Mubarak Mandi</b>{" "}
                                                Palace and the Jammu Museum.
                                            </div>
                                        </div>
                                    </div>
                                    <div id="10-days" className={scss.daywise_plan}>
                                        <h5>How to Spend 10 Days in JAMMU</h5>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 1</div>
                                            <div className={scss.day_content}>
                                                Arrive in Jammu. Visit <b>Raghunath Temple</b> and
                                                explore local markets.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 2</div>
                                            <div className={scss.day_content}>
                                                Pilgrimage to <b>Vaishno Devi Temple</b>, trekking or
                                                via helicopter.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 3</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Bahu Fort</b> and enjoy the Tawi River views.
                                                Visit <b>Ranbireshwar Temple</b>.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 4</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Mansar Lake</b> and its surroundings.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 5</div>
                                            <div className={scss.day_content}>
                                                Visit <b>Patnitop</b> for scenic views and adventure
                                                activities like paragliding.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 6</div>
                                            <div className={scss.day_content}>
                                                Explore <b>Shiv Khori caves</b>, a revered religious
                                                site.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 7</div>
                                            <div className={scss.day_content}>
                                                Visit the ancient temples of <b>Baba Sidh Goria</b> and
                                                explore the local culture.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Days 8-9</div>
                                            <div className={scss.day_content}>
                                                Head to the town of Katra for scenic trekking and
                                                explore the Trikuta Hills.
                                            </div>
                                        </div>
                                        <div className={scss.day_row}>
                                            <div className={scss.day_box}>Day 10</div>
                                            <div className={scss.day_content}>
                                                Visit the famous <b>Surinsar Lake</b> and enjoy a quiet
                                                day amidst nature.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Plantrip