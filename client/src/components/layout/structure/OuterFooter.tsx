import clsx from "clsx";

import React, { useEffect, useRef, useState } from "react";
import scss from "./footer.module.scss";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

import axiosInstance from "@/axios/axios";
import { d, e } from "@/components/utils/crypto";
import { Link } from "react-router-dom";

interface FooterLink {
  label: string;
  href?: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface ContactInfo {
  title: string;
  address: string;
  details: {
    label: string;
    value: string;
  }[];
  email: {
    label: string;
    value: string;
  };
}

type QA = {
  question: string;
  answer: string;
};

type Categories = {
  [category: string]: QA[];
};

const OuterFooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState("kashmir");
  const [visitorCount, setVisitorCount] = useState(100);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { text: any; isUser: boolean }[]
  >([]);
  const [botMessage, setBotMessage] = useState("");

  const [botThinking, setBotThinking] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function getVisitorCount() {
      try {
        const resp = await axiosInstance.post(
          "/api/auth/visitor-count"
        );
        if (resp?.status === 200) {
          const data = await d(resp?.data);
          setVisitorCount(parseInt(JSON.parse(data)));
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    }
    getVisitorCount();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, botMessage]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const loadQuestions = (category: string) => {
    setSelectedCategory(category);
  };

  const displayAnswer = (qa: { question: string; answer: string }) => {
    const userMsg = { text: qa.question, isUser: true };
    setChatHistory((prevHistory) => [...prevHistory, userMsg]);
    setBotMessage("");

    // Simulate typing effect for bot's answer
    let i = 0;
    const fullText = qa.answer;
    setBotThinking((prev) => !prev);
    setTimeout(() => {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { text: fullText, isUser: false },
      ]);
      setBotThinking((prev) => !prev);
    }, 1000);
  };

  const goBack = () => {
    setSelectedCategory(null);
  };

  const sendMessage = async () => {
    const input = document.getElementById("chatInput") as HTMLInputElement;
    const message = input.value.trim();
    if (!message) {
      toast.error("Please enter ");
      return;
    }

    const userMsg = { text: message, isUser: true };
    setChatHistory((prevHistory) => [...prevHistory, userMsg]);
    setBotThinking(true);

    try {
      const b = {
        include_sources: true,
        prompt: userMsg.text,
        stream: true,
        system_prompt:
          "You are a helpful assistant. Answer the user's question using as much relevant detail from the provided context as possible. Write complete, informative, and natural-sounding answers. Do not use phrases like 'according to the context' or 'based on the context'. If the information is not in the context, say so.., only use the documents given to you",
        use_context: true,
      };
      const bb = {
        message: userMsg.text,
      };
      try {
        const res = await axiosInstance.post("/api/chatbot/ask", await e(bb));

        let botResponse = (
          <ReactMarkdown>
            {JSON.parse(await d(res?.data?.message))}
          </ReactMarkdown>
        );

        // Add an initial empty bot message to update progressively
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { text: "", isUser: false },
        ]);

        // Update the last bot message with the current accumulated response
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
          if (
            updatedHistory.length > 0 &&
            !updatedHistory[updatedHistory.length - 1].isUser
          ) {
            updatedHistory[updatedHistory.length - 1] = {
              text: botResponse,
              isUser: false,
            };
          } else {
            // In case no bot message yet, add one
            updatedHistory.push({ text: botResponse, isUser: false });
          }
          return updatedHistory;
        });
      } catch (error: any) {
        toast.error(JSON.parse(await d(error?.response?.data?.message)));
      }

      setBotThinking(false);
    } catch (error) {
      console.error(error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          text: "Sorry, I encountered an error and couldn't respond to your message.",
          isUser: false,
        },
      ]);
      setBotThinking(false);
    }

    input.value = "";
  };

  return (
    <>
      <footer
        className={clsx(
          scss.custom_footer,
          "bg-[url('/images/JKTFooter.png')] bg-cover bg-center text-white relative hidden lg:block"
        )}
      >
        <div className="bg-black/20">
          <div className="container mx-auto xl:pt-8 py-8 sm:py-6 lg:px-8 sm:px-6">
            <div className={scss.footer_wrapper}>
              <div
                className={clsx(
                  scss.footer_block,
                  "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 pb-4"
                )}
              >
                {sections.map((section, index) => (
                  <div key={index}>
                    <h2 className="font-bold text-orange-400 mb-3 sm:mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-2 sm:space-y-3 text-sm lg:text-2xl sm:text-base leading-relaxed m-3">
                      {section.links.map((link, idx) => (
                        <li key={idx}>
                          <Link
                            to={link.href || "#"}
                            className="hover:text-orange-400 transition-colors duration-150"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className={scss.contact_details}>
                <h2 className="font-bold text-orange-400 mb-3 sm:mb-4">
                  Directorate of Tourism
                </h2>
                <div className={scss.tabsContainer}>
                  <ul className={scss.tabHeader}>
                    <li
                      className={clsx(scss.tabItem, {
                        [scss.active]: activeTab === "kashmir",
                      })}
                      onClick={() => setActiveTab("kashmir")}
                    >
                      Kashmir
                    </li>
                    <li
                      className={clsx(scss.tabItem, {
                        [scss.active]: activeTab === "jammu",
                      })}
                      onClick={() => setActiveTab("jammu")}
                    >
                      Jammu
                    </li>
                  </ul>
                  <div className={scss.tabContent}>
                    {activeTab === "kashmir" && (
                      <div>
                        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5">
                          SRINAGAR - KASHMIR, Tourist Reception Centre
                        </p>
                        <div className="space-y-1 sm:space-y-2 text-sm sm:text-xl text-white">
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Tele/Fax
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              0194 - 2502274
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              EPBX:
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              0194 - 2502270, 2502271
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Mobile:
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              0191-2560401
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Email:
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              info[at]jktdc[dot]co[dot]in
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                    {activeTab === "jammu" && (
                      <div>
                        <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5">
                          Tourist Reception Centre, Residency Road, Vir Marg,
                          Jammu Tawi - 180001
                        </p>
                        <div className="space-y-1 sm:space-y-2 text-sm sm:text-xl text-white">
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Toll Free
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              1800 890 8457 (Jammu)
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Tele/Fax:
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              0191-2549065
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Mobile:
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              94191-78000
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-orange-400 text-lg">
                              Email:
                            </span>{" "}
                            <span className="text-gray-100 text-lg">
                              tntjammu[at]jktdc[dot]co[dot]in
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-6 sm:mt-8 border-t border-gray-700 text-sm lg:text-xl sm:text-base text-gray-300">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                <p className="mb-0">
                  Design & Developed by{" "}
                  <a
                    href="https://bisag-n.gov.in/"
                    target="_blank"
                    className="font-bold text-white hover:text-orange-400 cursor-pointer"
                  >
                    BISAG-N
                  </a>
                  , &copy; {new Date().getFullYear()} . All Rights Reserved.
                </p>
                <p className="m-0 flex flex-row gap-4 items-center">
                  Visitors
                  <span className="text-white font-semibold bg-gradient-to-r from-red-500 to-orange-400 p-2 rounded-2xl text-center">
                    {visitorCount.toString().padStart(10, "0")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* chatbot design  */}


      {/* <button
        onClick={toggleChat}
        className={clsx("group space-x-2 p-2", scss.chatToggleBtn)}
      >
        <div className={clsx(scss.chatButton)}>
          <div className={clsx(scss.askImg)}>
            <img src={`${import.meta.env.VITE_BASE}images/customer-icon.png`} className="w-6 h-6" />
          </div>
          <div
            className={clsx("transition-opacity duration-300", scss.askJannat)}
          >
            Ask <span>Jannat</span>
          </div>
        </div>
      </button> */}


      {isOpen && (
        <div className={scss.chatWidget}>
          <header>
            <div className={clsx("flex")}>
              {selectedCategory && (
                <button className={clsx(scss.backBtn, "me-0")} onClick={goBack}>
                  ❮
                </button>
              )}
              <div className={scss.chat_profile}>
                <img src={`${import.meta.env.VITE_BASE}images/customer-icon.png`} />
                <h1>Ask Jannat</h1>
              </div>
            </div>
            <img
              src={`${import.meta.env.VITE_BASE}images/jk-tourism-logo.png`}
              alt="Logo"
            />
          </header>
          <div className={scss.chatbox}>
            <div className={scss.carousel}>
              <div className={scss.carouselImages}>
                <img src={`${import.meta.env.VITE_BASE}images/JKTimg25.jpg`} alt="Slide 1" />
                <img src={`${import.meta.env.VITE_BASE}images/expBg.jpg`} alt="Slide 2" />
                <img src={`${import.meta.env.VITE_BASE}images/jk-img-01.jpg`} alt="Slide 3" />
                <img src={`${import.meta.env.VITE_BASE}images/jk-img-02.jpg`} alt="Slide 4" />
                <img src={`${import.meta.env.VITE_BASE}images/JKTimg25.jpg`} alt="Slide 1" />
                <img src={`${import.meta.env.VITE_BASE}images/expBg.jpg`} alt="Slide 2" />
                <img src={`${import.meta.env.VITE_BASE}images/jk-img-01.jpg`} alt="Slide 3" />
                <img src={`${import.meta.env.VITE_BASE}images/jk-img-02.jpg`} alt="Slide 4" />
              </div>
            </div>
            <div className={scss.chatbox_wrapper}>
              {!selectedCategory ? (
                <div className={scss.categoryButtons}>
                  {Object.keys(categories).map((category) => (
                    <button
                      key={category}
                      onClick={() => loadQuestions(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={scss.questionList}>
                  {categories[selectedCategory].map((qa: QA, index: number) => (
                    <div
                      key={index}
                      className={scss.questionItem}
                      onClick={() => displayAnswer(qa)}
                    >
                      <span>{qa.question}</span>
                      <span>›</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={scss.chatHistory}>
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`${msg.isUser ? scss.userMessage : scss.botMessage
                      } ${scss.chatMessage}`}
                  >
                    {msg.text}
                  </div>
                ))}

                {botThinking && (
                  <div className="flex w-full items-center justify-center gap-x-2 mt-2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-[#d991c2]"></div>
                    <div className="h-3 w-3 animate-pulse rounded-full bg-[#9869b8]"></div>
                    <div className="h-3 w-3 animate-pulse rounded-full bg-[#6756cc]"></div>
                  </div>
                )}

                {botMessage && (
                  <div className={`${scss.botMessage} ${scss.chatMessage}`}>
                    {botMessage}
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={chatEndRef}></div>
              </div>
            </div>
          </div>
          <div className={scss.chatInputContainer}>
            <input
              type="text"
              id="chatInput"
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default OuterFooter;

const categories: Categories = {
  "Tourist Destinations": [
    {
      question: "What are the top tourist places in Jammu & Kashmir?",
      answer:
        "Srinagar (Dal Lake, Mughal gardens), Gulmarg, Pahalgam, Sonamarg, Jammu city & Vaishno Devi, Patnitop, Bhaderwah, Amarnath, Lolab and Gurez valleys",
    },
    {
      question: "Can you suggest must-visit places in Srinagar?",
      answer:
        "Dal Lake (shikara rides, houseboats), Shalimar Bagh, Nishat Bagh, Pari Mahal, Shankaracharya Temple",
    },
    {
      question: "What are some offbeat destinations in J&K?",
      answer: "Yusmarg, Doodhpathri, Sanasar, Gurez Valley, Lolab Valley",
    },
    {
      question: "Is it safe to visit Gulmarg in winter?",
      answer:
        "Yes—Gulmarg is a top winter-sports area, great for skiing; temperatures drop to around 0 °C",
    },
    {
      question: "What can I do in Pahalgam?",
      answer:
        "River rafting on Lidder, trek to Aru/Betaab Valley, scenic walks, trout fishing",
    },
  ],
  "Travel & Transport": [
    {
      question: "How do I reach Jammu from Delhi?",
      answer:
        "By flight (Jammu Airport), train (multiple daily), long-distance bus or self-drive (~600 km).",
    },
    {
      question: "What is the best way to reach Srinagar?",
      answer:
        "Fly directly to Srinagar; optional road via Jammu‑Srinagar highway (~300 km).",
    },
    {
      question: "Are there direct flights to Leh from Mumbai?",
      answer: "Yes, but vary seasonally—check airlines like Air India, IndiGo.",
    },
    {
      question: "Is it safe to travel by road from Jammu to Srinagar?",
      answer:
        "The highway is scenic but prone to landslides, especially during monsoon. Travel during daylight is recommended.",
    },
    {
      question: "What permits are required for Leh-Ladakh?",
      answer:
        "Indian visitors don’t need permits, but foreigners need Inner‑Line Permit (ILP) — obtainable online or at the airport.",
    },
  ],
  Accommodation: [
    {
      question: "Suggest some budget hotels in Jammu.",
      answer:
        "Options include small guesthouses near Raghunath Bazaar, hotels in Gandhi Nagar. Can book online or via call on our official website JKtdc. Click here",
    },
    {
      question: "Are houseboats available for stay in Srinagar?",
      answer:
        "Yes, many houseboats on Dal and Nigeen Lake, varying from simple to luxury; book via tourism websites or trusted platforms. Click here",
    },
    {
      question: "How can I book government guest houses?",
      answer:
        "Through JK Tourism’s official portal or call tourism department.",
    },
    {
      question: "Are there resorts in Pahalgam for families?",
      answer:
        "Resorts around Lidder River and Aru valley suited for families—book through JK Tourism or travel agencies.",
    },
    {
      question: "Can I book accommodation directly through this website?",
      answer:
        "Yes—our chatbot can link you to official booking forms for accommodations.",
    },
  ],
  "Weather & Best Time to Visit": [
    {
      question: "What is the best time to visit Kashmir?",
      answer:
        "March–August (spring and summer), especially April–July; winter (Nov–Feb) is good for snow lovers",
    },
    {
      question: "Is it too cold in Gulmarg during December?",
      answer: "Very cold—temperatures near or below 0 °C, heavy snowfall",
    },
    {
      question: "When is tulip season in Srinagar?",
      answer: "Late March to mid-April at Indira Gandhi Memorial Tulip Garden.",
    },
    {
      question: "What’s the weather like in Leh during July?",
      answer: "Summer in Ladakh—clear skies, 15–25 °C by day, chilly nights.",
    },
    {
      question: "Can I visit Jammu during monsoon?",
      answer:
        "Yes—Jammu sees milder monsoon than mountains; best time is Sept–March, though monsoons are still manageable.",
    },
  ],
  "Festivals & Culture": [
    {
      question: "What festivals are celebrated in J&K?",
      answer:
        "Amarnath Yatra (July), Hemis festival (late June/July in Leh), Navaratri, Diwali, Tulip Festival (April), Baisakhi, Eid.",
    },
    {
      question: "When is the Hemis festival held?",
      answer:
        "Celebrated in Ladakh’s Hemis Monastery, usually in late June or July.",
    },
    {
      question: "Are there local fairs or cultural events in Jammu?",
      answer:
        "Heritage festivals, Akhnoor fairs, Baisakhi mela at Raghunath Temple.",
    },
    {
      question: "Can I attend traditional Kashmiri music performances?",
      answer:
        "Available in Srinagar (Shikara evenings), cultural events in Mughal gardens, local venues.",
    },
    {
      question: "Where can I experience authentic local culture?",
      answer:
        "Stay in houseboats, attend cultural shows, visit saffron fields, artisan villages.",
    },
  ],
  "Adventure & Activities": [
    {
      question: "What are the best trekking routes in Kashmir?",
      answer:
        "Kashmir Great Lakes, Tarsar‑Marsar, Kolahoi Glacier, Aru Valley routes",
    },
    {
      question: "Can I do skiing in Gulmarg?",
      answer: "Yes—skiing, snowboarding, gondola to Apharwat slopes",
    },
    {
      question: "Are there water sports in Jammu?",
      answer:
        "Limited; better options in Jammu region include river rafting at Bhadarwah/Patnitop.",
    },
    {
      question: "What adventure sports are available in Ladakh?",
      answer:
        "Trekking, Himalayan biking, rafting, mountaineering, high-altitude camping.",
    },
    {
      question: "Is white-water rafting possible in J&K?",
      answer: "Available on Lidder River (Pahalgam), Zanskar River (Ladakh).",
    },
  ],
  "Tour Packages": [
    {
      question: "Do you offer tour packages?",
      answer: "Yes—day tours, multi‑day Kashmir/Ladakh/Amarnath. Click here",
    },
    {
      question: "Can I customize my tour?",
      answer: "Yes—tailor by duration, places, budget.",
    },
    {
      question: "Are there packages for honeymooners?",
      answer: "Yes—romantic stays on houseboats, Gulmarg, Pahalgam.",
    },
    {
      question: "What are the charges for 5-day Kashmir tour?",
      answer:
        "Approx INR 8,000–15,000 per person (depending on hotels & vehicle).",
    },
    {
      question: "Are group tours available?",
      answer: "Yes—available, often with discounts for 4+ persons.",
    },
  ],
  "Permits & Guidelines": [
    {
      question: "Do I need permits to visit Ladakh?",
      answer:
        "Indian visitors — no permit; foreigners — ILP mandatory for Leh‑Ladakh & Zanskar.",
    },
    {
      question: "Are there any restrictions for foreign tourists?",
      answer: "ILP required; certain border zones restricted.",
    },
    {
      question: "How do I apply for inner line permits?",
      answer:
        "Online via official JK government/UT websites or at Leh airport.",
    },
    {
      question: "What are COVID guidelines for tourists?",
      answer:
        "Standard precautions; testing and vaccination not currently mandatory (check latest updates).",
    },
    {
      question: "Do I need a guide for trekking?",
      answer:
        "Recommended for remote treks (e.g. Kashmir Great Lakes); local guides and porters available.",
    },
  ],
  "Food & Local Cuisine": [
    {
      question: "What are the famous foods in Kashmir?",
      answer:
        "Wazwan (multi‑course meat feast), Rogan josh, Dum aloo, Yakhni, Gaadno chaman (fried cheese), Kashmiri pulao.",
    },
    {
      question: "Where can I try authentic Wazwan cuisine?",
      answer:
        "At upscale restaurants in Srinagar and Pahalgam, or arranged in local homes during tours.",
    },
    {
      question: "Are there vegetarian restaurants in Srinagar?",
      answer: "Plenty—local cafés and houseboats offer veg options.",
    },
    {
      question: "Can I find North Indian food in Leh?",
      answer: "Available in guesthouses and cafes catering to tourists.",
    },
    {
      question: "What is noon chai?",
      answer:
        "Pink-salted Kashmiri tea, served with kahwa (green tea with spices).",
    },
  ],
  "Shopping & Souvenirs": [
    {
      question: "Where can I buy Kashmiri handicrafts?",
      answer:
        "Srinagar’s Lal Chowk, Polo View Market; artisan shops in Jammu and Pahalgam.",
    },
    {
      question: "Are Pashmina shawls authentic in local markets?",
      answer:
        "Look for store certification and Jamavar weaving; recommended areas include Srinagar bazaars.",
    },
    {
      question: "What souvenirs should I buy from J&K?",
      answer:
        "Pashmina shawls, dry fruits (walnuts, almonds), papier-mâché, saffron, Kashmiri spices.",
    },
    {
      question: "Are dry fruits cheaper in Srinagar?",
      answer: "Yes—abundant and relatively cheaper in Srinagar markets.",
    },
    {
      question: "What is the best place to shop in Jammu?",
      answer:
        "Raghunath Bazaar for local crafts, Bagh-e-Bahu for spices and jams",
    },
  ],
  "General Inquiries": [
    {
      question: "Is Jammu & Kashmir safe for tourists now?",
      answer:
        "Generally safe; remain alert in recent sensitive zones; major routes and tourist hubs are secure.",
    },
    {
      question: "What language is spoken in Kashmir?",
      answer: "Kashmiri, Urdu, Dogri, Hindi, English.",
    },
    {
      question: "Is mobile network available in remote areas?",
      answer:
        "Available in towns; remote valleys may have limited coverage—prepaid SIMs recommended.",
    },
    {
      question: "Are ATMs available in Gulmarg and Pahalgam?",
      answer:
        "Available in Srinagar, Gulmarg, Pahalgam; carry cash for remote treks.",
    },
    {
      question: "How can I contact the tourism office?",
      answer:
        "JK Tourism (Jammu & Srinagar offices); details available on official website. Chatbot can connect you directly.",
    },
  ],
};

const sections: FooterSection[] = [
  {
    title: "TOP DESTINATIONS",
    links: [
      { label: "Gurez Valley", href: "/category/Valleys/Gurez" },
      { label: "Gulmarg", href: "/category/Meadows/Gulmarg" },
      { label: "Dal lake", href: "/category/Lakes/Dal" },
      { label: "Pahalgam", href: "/category/Valleys/Pahalgam" },
    ],
  },
  {
    title: "QUICK LINKS",
    links: [
      { label: "Medical Facilities", href: "/amenities" },
      { label: "Wayside Amenities", href: "/amenities" },
      { label: "Registered Travel Operators", href: "/travel-agent" },
      { label: "Registered Travel Guides", href: "/tour-guide" },
      { label: "Contact us", href: "/contact-us" },
      { label: "Hotel Registration", href: "/hotel-registration" },
    ],
  },
  {
    title: "Legal Links",
    links: [
      { label: "Privacy Policy", href: "/policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

const contactInfo: ContactInfo[] = [
  {
    title: "Directorate of Tourism – Kashmir",
    address: "SRINAGAR - KASHMIR, Tourist Reception Centre",
    details: [
      { label: "Tele/Fax:", value: "0194 - 2502274" },
      { label: "EPBX:", value: "0194 - 2502270, 2502271" },
      { label: "Mobile:", value: "0191-2560401" },
    ],
    email: { label: "Email:", value: "info[at]jktdc[dot]co[dot]in" },
  },
  {
    title: "Directorate of Tourism – Jammu",
    address:
      "Tourist Reception Centre, Residency Road, Vir Marg, Jammu Tawi - 180001",
    details: [
      { label: "Toll Free:", value: "1800 890 8457 (Jammu)" },
      { label: "Tele/Fax:", value: "0191-2549065" },
      { label: "Mobile:", value: "94191-78000" },
    ],
    email: { label: "Email:", value: "tntjammu[at]jktdc[dot]co[dot]in" },
  },
];
