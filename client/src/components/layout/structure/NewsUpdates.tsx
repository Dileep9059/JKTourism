import React, { useEffect, useRef, useState } from "react";
import { ExternalLink, Clock, User } from "lucide-react";



const NewsUpdates = () => {
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const newsArticles = [
    {
      id: 1,
      title: "Flamethrower In Hand, US Politician Burns Quran, Sparks Outrage",
      category: "Politics",
      readTime: "4 min read",
      author: "News Team",
      image:
        "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=200&fit=crop&crop=center",
      excerpt:
        "Controversial incident sparks international debate and diplomatic tensions.",
    },
    {
      id: 2,
      title:
        "Dubai Princess, Who Dumped Husband In Insta Post, Gets Engaged To Rapper",
      category: "Entertainment",
      readTime: "3 min read",
      author: "Entertainment Correspondent",
      image:
        "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=200&fit=crop&crop=center",
      excerpt:
        "Royal family member makes headlines with unexpected engagement announcement.",
    },
    {
      id: 3,
      title:
        "Bihar Minister Chased By Locals For 1 Km, Attacked Over 9 Deaths In Accident",
      category: "Politics",
      readTime: "5 min read",
      author: "Political Reporter",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=200&fit=crop&crop=center",
      excerpt:
        "Public outrage erupts following tragic accident involving government officials.",
    },
    {
      id: 4,
      title: "Swing is King: Mr. Hemant's Strategy Finally Explained In Detail",
      category: "Finance",
      readTime: "6 min read",
      author: "Financial Analyst",
      image:
        "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop&crop=center",
      excerpt:
        "Investment strategy breakdown reveals market manipulation techniques.",
    },
    {
      id: 5,
      title: "MIG 21 - 6 Decades Of Triumphs, Tragedies, And A Legacy To Remember",
      category: "Defense",
      readTime: "8 min read",
      author: "Defense Correspondent",
      image:
        "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=200&fit=crop&crop=center",
      excerpt:
        "A comprehensive look at the legendary fighter aircraft that shaped aviation history.",
    },
    {
      id: 6,
      title:
        "Opinion: India To Kabul To Pak: The Plot Behind Chinese Foreign Minister's Many Tours",
      category: "Geopolitics",
      readTime: "6 min read",
      author: "Political Analyst",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=200&fit=crop&crop=center",
      excerpt:
        "Analysis of China's diplomatic strategy across South Asian nations.",
    },
  ];

  // Create multiple copies for infinite scroll
  const infiniteArticles = [...newsArticles, ...newsArticles, ...newsArticles];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    const scrollSpeed = 1; // Adjust speed as needed

    const scroll = () => {
      if (!isScrolling && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Calculate the width of one set of articles (original articles)
        const singleSetWidth = (320 + 24) * newsArticles.length; // card width + gap

        // Reset scroll position for infinite effect when we've scrolled past one full set
        if (scrollContainer.scrollLeft >= singleSetWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const handleMouseEnter = () => setIsScrolling(true);
    const handleMouseLeave = () => setIsScrolling(false);

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isScrolling, newsArticles.length]);

  return (
    <div className=" transition-all duration-500 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-black"


    >
      {/* Page Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-sky-200 dark:border-gray-700"

      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent transition-all duration-300">
              Latest News & Updates
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Stay updated with the latest breaking news and stories
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Infinite News Carousel */}
        <div className="relative mb-8 overflow-hidden">
          {/* Scrolling Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 px-4"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
              overflow: "hidden", // Hide scrollbar completely
              width: "100%",
              whiteSpace: "nowrap"
            }}
          >
            {/* Hide scrollbar for Webkit (Chrome, Safari) */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {infiniteArticles.map((article, index) => (
              <div
                key={`${article.id}-${Math.floor(index / newsArticles.length)}-${index}`}
                className="flex-shrink-0 w-80 group transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-sky-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop&crop=center`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>



                </div>

                {/* Content */}
                <div className="p-5">
                  <h3
                    className="font-bold text-lg mb-3 text-gray-800 group-hover:text-sky-600 dark:text-gray-100 dark:group-hover:text-blue-400 leading-tight"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    className="text-sm mb-4 text-gray-600 dark:text-gray-400 leading-relaxed"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <User size={12} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays for smooth infinite effect */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-sky-100 via-blue-50/80 to-transparent dark:from-gray-900 dark:via-gray-800/80 dark:to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-sky-100 via-blue-50/80 to-transparent dark:from-gray-900 dark:via-gray-800/80 dark:to-transparent pointer-events-none z-10"></div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1">
            <span className="relative z-10 flex items-center gap-2">
              View All News
              <ExternalLink
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
            <div className="absolute inset-0 rounded-full transition-opacity duration-300 bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-500 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-600 opacity-0 group-hover:opacity-100"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsUpdates;