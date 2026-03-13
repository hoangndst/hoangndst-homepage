'use client'

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { TerminalSquare } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { completeInput } from 'lib/terminal/completion'
import {
  TerminalExecutionResult,
  TerminalManifest,
  executeTerminalCommand,
  resolveVirtualCwdFromRoute,
} from 'lib/terminal/engine'

type OutputHistoryItem = {
  id: string
  kind: 'output'
  text: string
}

type CommandHistoryItem = {
  id: string
  kind: 'command'
  promptBase: string
  command: string
}

type HistoryItem = OutputHistoryItem | CommandHistoryItem

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const mapExecutionToHistory = (
  promptBaseText: string,
  commandText: string,
  result: TerminalExecutionResult
): HistoryItem[] => {
  const items: HistoryItem[] = [
    { id: createId(), kind: 'command', promptBase: promptBaseText, command: commandText },
  ]
  result.output.forEach((line) => items.push({ id: createId(), kind: 'output', text: line }))
  return items
}

export default function TerminalNavigator() {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const outputRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [cwd, setCwd] = useState('/')
  const [promptUser, setPromptUser] = useState('root')
  const [promptHost, setPromptHost] = useState('web')
  const [manifest, setManifest] = useState<TerminalManifest | null>(null)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: createId(),
      kind: 'output',
      text: 'Last login: Fri Mar 13 on hoangndst-homepage',
    },
    { id: createId(), kind: 'output', text: 'Type "help" to see available commands.' },
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [commandCursor, setCommandCursor] = useState<number | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [lastTabInput, setLastTabInput] = useState<string | null>(null)
  const lastExecutionRef = useRef<{ command: string; at: number } | null>(null)

  useEffect(() => {
    const host = window.location.hostname.replace(/^www\./, '') || 'web'
    setPromptHost(host)
    setPromptUser('root')
  }, [])

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const response = await fetch('/api/terminal/manifest')
        if (!response.ok) return
        const data = (await response.json()) as TerminalManifest
        setManifest(data)
      } catch {
        // Fallback manifest already available in local state.
      }
    }

    fetchManifest()
  }, [])

  useEffect(() => {
    if (!manifest) {
      setCwd(pathname?.startsWith('/blog') ? '/blog' : '/')
      return
    }
    setCwd(resolveVirtualCwdFromRoute(pathname, manifest))
  }, [pathname, manifest])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [history, open])

  const promptBase = useMemo(
    () => `${promptUser}@${promptHost}:${cwd}`,
    [cwd, promptHost, promptUser]
  )

  const runCommand = (value: string) => {
    const raw = value.trim()
    if (!raw) return
    if (!manifest) {
      setHistory((prev) => [
        ...prev,
        { id: createId(), kind: 'command', promptBase, command: raw },
        { id: createId(), kind: 'output', text: 'terminal: loading manifest, please retry...' },
      ])
      return
    }
    const now = Date.now()
    const lastExecution = lastExecutionRef.current
    if (lastExecution && lastExecution.command === raw && now - lastExecution.at < 250) {
      return
    }
    lastExecutionRef.current = { command: raw, at: now }

    const result = executeTerminalCommand(raw, cwd, manifest)
    setSuggestions([])

    if (result.clear) {
      setHistory([])
    } else {
      setHistory((prev) => [...prev, ...mapExecutionToHistory(promptBase, raw, result)])
    }

    setCwd(result.nextCwd)
    setCommandHistory((prev) => [...prev, raw])
    setCommandCursor(null)
    setInput('')
    setLastTabInput(null)

    if (result.navigateTo) {
      router.push(result.navigateTo)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (event.repeat) return
      runCommand(input)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (commandHistory.length === 0) return

      const nextCursor =
        commandCursor === null ? commandHistory.length - 1 : Math.max(0, commandCursor - 1)

      setCommandCursor(nextCursor)
      setInput(commandHistory[nextCursor] || '')
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (commandHistory.length === 0) return
      if (commandCursor === null) return

      const nextCursor = commandCursor + 1
      if (nextCursor >= commandHistory.length) {
        setCommandCursor(null)
        setInput('')
        return
      }

      setCommandCursor(nextCursor)
      setInput(commandHistory[nextCursor] || '')
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      if (!manifest) return
      const isRepeatedTab = lastTabInput === input
      const completion = completeInput(input, cwd, manifest)
      setInput(completion.nextInput)
      setSuggestions(completion.suggestions)

      if (completion.suggestions.length > 1 && completion.nextInput === input && isRepeatedTab) {
        setHistory((prev) => [
          ...prev,
          { id: createId(), kind: 'output', text: completion.suggestions.join('   ') },
        ])
      }
      setLastTabInput(input)
      return
    }

    setLastTabInput(null)
  }

  return (
    <div className="pointer-events-none fixed bottom-8 right-8 z-[70] hidden md:flex md:flex-col md:items-end">
      {open && (
        <section
          className={`pointer-events-auto mb-2.5 overflow-hidden rounded-xl border border-slate-300/90 bg-slate-50 shadow-lg shadow-slate-900/15 dark:border-[#2d3348] dark:bg-[#0b1020] dark:shadow-black/40 ${
            maximized ? 'h-[70vh] w-[min(92vw,840px)]' : 'h-auto w-[min(90vw,620px)]'
          }`}
        >
          <header className="flex items-center justify-between border-b border-slate-300/90 bg-slate-100 px-3 py-2 dark:border-[#2d3348] dark:bg-[#131a2a]">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-gray-200">
              <button
                type="button"
                aria-label="Close terminal"
                className="inline-block h-2 w-2 rounded-full bg-red-400 transition-opacity hover:opacity-80"
                onClick={() => setOpen(false)}
              />
              <button
                type="button"
                aria-label="Minimize terminal"
                className="inline-block h-2 w-2 rounded-full bg-yellow-400 transition-opacity hover:opacity-80"
                onClick={() => setOpen(false)}
              />
              <button
                type="button"
                aria-label={maximized ? 'Restore terminal size' : 'Maximize terminal'}
                className="inline-block h-2 w-2 rounded-full bg-green-400 transition-opacity hover:opacity-80"
                onClick={() => setMaximized((v) => !v)}
              />
              <TerminalSquare className="ml-0.5 h-3.5 w-3.5" />
              <span className="ml-0.5">zsh — {promptHost}</span>
            </div>
          </header>

          <div
            ref={outputRef}
            className={`overflow-y-auto bg-slate-50 px-3 py-2.5 font-mono text-[13px] font-bold leading-6 text-slate-800 dark:bg-[#0b1020] dark:text-gray-100 ${
              maximized ? 'h-[calc(70vh-38px)]' : 'h-72'
            }`}
            role="button"
            tabIndex={0}
            aria-label="Terminal output area"
            onClick={() => inputRef.current?.focus()}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                inputRef.current?.focus()
              }
            }}
          >
            {history.map((item) => (
              <div
                key={item.id}
                className="whitespace-pre-wrap font-mono text-[13px] leading-6 text-slate-800 dark:text-gray-100"
              >
                {item.kind === 'command' ? (
                  <>
                    <span className="text-emerald-700 dark:text-emerald-300">
                      {item.promptBase}
                    </span>
                    <span className="mr-1.5 text-emerald-700 dark:text-emerald-300">$</span>
                    <span className="text-slate-800 dark:text-gray-100">{item.command}</span>
                  </>
                ) : (
                  <span>{item.text}</span>
                )}
              </div>
            ))}
            <label htmlFor="mini-terminal-input" className="sr-only">
              Terminal command input
            </label>
            <div className="flex items-baseline gap-0 font-mono text-[13px] leading-6 tracking-normal">
              <span className="text-emerald-700 dark:text-emerald-300">{promptBase}</span>
              <span className="mr-1.5 text-emerald-700 dark:text-emerald-300">$</span>
              <input
                id="mini-terminal-input"
                ref={inputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value)
                  setLastTabInput(null)
                }}
                onKeyDown={onKeyDown}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[13px] font-bold leading-6 tracking-normal text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 dark:text-gray-100 dark:placeholder:text-gray-500"
                autoComplete="off"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>
            {suggestions.length > 1 && (
              <p className="mt-1 truncate font-mono text-[11px] text-slate-500 dark:text-gray-500">
                {suggestions.join('   ')}
              </p>
            )}
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? 'Hide mini terminal' : 'Show mini terminal'}
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      >
        <TerminalSquare className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </div>
  )
}
