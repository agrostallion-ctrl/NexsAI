'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * useReveal:
 * Elements ko viewport mein aane par animate (reveal) karne ke liye.
 * @param threshold - Kitna % element dikhne par trigger ho (0.0 to 1.0)
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1
) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Browser environment check
    if (typeof window === 'undefined') return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          // Ek baar reveal hone ke baad observer ko band kar dena performance ke liye achha hai
          observer.unobserve(element)
        }
      },
      { 
        threshold,
        // Root margin add kar sakte hain agar element thoda pehle trigger karna ho
        rootMargin: '0px 0px -50px 0px' 
      }
    )

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
      observer.disconnect()
    }
  }, [threshold])

  return { ref, visible }
}