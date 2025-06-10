'use client'
import { getRandomQuote } from '@/data/quotesData'
import ShinyText from '@/components/ShinyText'
import { useEffect, useState } from 'react'

export default function DevQuotes() {
  const [quote, setQuote] = useState(getRandomQuote())
  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  return (
    <ShinyText className="text-center text-lg/5 sm:text-lg/5" speed={3} disabled={false}>
      <blockquote>
        <p className="break-words">"{quote.text}"</p>
        <footer>{quote.author}</footer>
      </blockquote>
    </ShinyText>
  )
}
