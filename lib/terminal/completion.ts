import { TerminalManifest } from './engine'

const COMMANDS = ['ls', 'cd', 'pwd', 'read', 'clear', 'help']

type CompletionResult = {
  nextInput: string
  suggestions: string[]
}

const hasTrailingSpace = (value: string) => /\s$/.test(value)

const getCommonPrefix = (values: string[]) => {
  if (values.length === 0) return ''
  if (values.length === 1) return values[0]

  let prefix = values[0]
  for (let i = 1; i < values.length; i += 1) {
    while (!values[i].startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1)
    }
    if (!prefix) break
  }
  return prefix
}

const normalizePath = (path: string) => {
  const parts = path.split('/').filter(Boolean)
  return `/${parts.join('/')}`.replace(/\/+/g, '/') || '/'
}

const getParentPath = (path: string) => {
  const normalized = normalizePath(path)
  if (normalized === '/') return null
  const segments = normalized.split('/').filter(Boolean)
  if (segments.length <= 1) return '/'
  return `/${segments.slice(0, -1).join('/')}`
}

const suggestForCd = (cwd: string, manifest: TerminalManifest) => {
  const localDirectories = manifest.directories
    .filter((entry) => entry.path !== '/' && getParentPath(entry.path) === cwd)
    .map((entry) => entry.name)
  return ['.', '..', '/', ...localDirectories]
}

const suggestForRead = (cwd: string, manifest: TerminalManifest) => {
  return manifest.files
    .filter((entry) => getParentPath(entry.path) === cwd)
    .map((entry) => entry.name)
}

const filterByPrefix = (candidates: string[], prefix: string) =>
  candidates.filter((candidate) => candidate.startsWith(prefix)).sort((a, b) => a.localeCompare(b))

const replaceCurrentToken = (rawInput: string, replacement: string) => {
  const trailing = hasTrailingSpace(rawInput)
  const tokens = rawInput.trim().length > 0 ? rawInput.trim().split(/\s+/) : []

  if (tokens.length === 0) {
    return `${replacement} `
  }

  if (trailing) {
    return `${rawInput}${replacement}`
  }

  tokens[tokens.length - 1] = replacement
  return `${tokens.join(' ')}`
}

export const completeInput = (
  rawInput: string,
  cwd: string,
  manifest: TerminalManifest
): CompletionResult => {
  const trailing = hasTrailingSpace(rawInput)
  const trimmed = rawInput.trim()

  if (!trimmed) {
    return { nextInput: rawInput, suggestions: COMMANDS }
  }

  const tokens = trimmed.split(/\s+/)
  const command = tokens[0]

  if (tokens.length === 1 && !trailing) {
    const matchedCommands = filterByPrefix(COMMANDS, command)
    if (matchedCommands.length === 0) {
      return { nextInput: rawInput, suggestions: [] }
    }

    if (matchedCommands.length === 1) {
      return { nextInput: `${matchedCommands[0]}`, suggestions: matchedCommands }
    }

    const commonPrefix = getCommonPrefix(matchedCommands)
    if (commonPrefix.length > command.length) {
      return { nextInput: `${commonPrefix}`, suggestions: matchedCommands }
    }

    return { nextInput: rawInput, suggestions: matchedCommands }
  }

  const currentToken = trailing ? '' : tokens[tokens.length - 1]

  if (command === 'cd') {
    const suggestions = filterByPrefix(suggestForCd(cwd, manifest), currentToken)
    if (suggestions.length === 0) return { nextInput: rawInput, suggestions: [] }

    if (suggestions.length === 1) {
      return {
        nextInput: replaceCurrentToken(rawInput, suggestions[0]),
        suggestions,
      }
    }

    const commonPrefix = getCommonPrefix(suggestions)
    if (commonPrefix.length > currentToken.length) {
      return {
        nextInput: replaceCurrentToken(rawInput, commonPrefix),
        suggestions,
      }
    }

    return { nextInput: rawInput, suggestions }
  }

  if (command === 'read') {
    const fileCandidates = suggestForRead(cwd, manifest)
    const suggestions = filterByPrefix(fileCandidates, currentToken)
    if (suggestions.length === 0) return { nextInput: rawInput, suggestions: [] }

    if (suggestions.length === 1) {
      return {
        nextInput: replaceCurrentToken(rawInput, suggestions[0]),
        suggestions,
      }
    }

    const commonPrefix = getCommonPrefix(suggestions)
    if (commonPrefix.length > currentToken.length) {
      return {
        nextInput: replaceCurrentToken(rawInput, commonPrefix),
        suggestions,
      }
    }

    return { nextInput: rawInput, suggestions }
  }

  return { nextInput: rawInput, suggestions: [] }
}
