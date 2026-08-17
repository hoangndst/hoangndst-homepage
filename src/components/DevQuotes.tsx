'use client'
import { quotes, getRandomQuote } from '@/data/quotesData'
import { useEffect, useState } from 'react'

export default function DevQuotes() {
  const [quote, setQuote] = useState(() => quotes[0])
  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  return (
    <blockquote className="border-primary/60 border-l pl-4">
      <p className="text-foreground text-base leading-7 text-pretty">“{quote.text}”</p>
      <footer className="text-muted-foreground mt-3 text-xs">{quote.author}</footer>
    </blockquote>
  )
}
