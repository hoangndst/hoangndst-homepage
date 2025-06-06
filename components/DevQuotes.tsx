'use client'
import { getRandomQuote } from '@/data/quotesData'
import ScrambledText from '@/components/ScrambledText'
import { useEffect, useState } from 'react'

export default function DevQuotes() {
  const [quote, setQuote] = useState(getRandomQuote())
  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ScrambledText
      className="text-center text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-lg/5"
      radius={100}
      duration={1.2}
      speed={0.5}
      scrambleChars=".:"
    >
      <span className="break-words">{quote.text}</span>
      <br />
      {quote.author}
    </ScrambledText>
  )
}
