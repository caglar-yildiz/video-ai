"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Top: 0 takes us all the way back to the top of the page
  // Behavior: smooth keeps it smooth!
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <div className="fixed bottom-8 right-8 z-[999]">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {isVisible && (
            <motion.button
              onClick={scrollToTop}
              aria-label="scroll to top"
              className="back-to-top hover:bg-dark flex h-10 w-10 cursor-pointer items-center justify-center rounded-md bg-primary text-white shadow-md transition delay-1000 duration-300 ease-in-out"
            >
              <span className="mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"></span>
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  )
}
