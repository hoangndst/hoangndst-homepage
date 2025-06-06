'use client'
import { getRandomQuote } from '@/data/quotesData'
import ScrambledText from '@/components/ScrambledText'
import { useEffect, useState } from 'react'

export default function DevQuotes() {
  const [quote, setQuote] = useState(getRandomQuote())
  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  return (
    <ScrambledText
      className="break-words text-center text-lg font-medium text-gray-500 dark:text-gray-400 sm:text-lg/5"
      radius={100}
      duration={1.2}
      speed={0.5}
      scrambleChars=".:"
    >
      <span>{quote.text}</span>
      <br />
      {quote.author}
    </ScrambledText>
  )
}
