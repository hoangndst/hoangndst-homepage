export type TerminalDirectory = {
  name: string
  path: string
  route: string
}

export type TerminalFile = {
  name: string
  path: string
  route: string
}

export type TerminalManifest = {
  directories: TerminalDirectory[]
  files: TerminalFile[]
}

export type TerminalExecutionResult = {
  output: string[]
  nextCwd: string
  navigateTo?: string
  clear?: boolean
}

const HELP_TEXT = [
  'Available commands:',
  '  ls                 List files and folders',
  '  cd <dir>           Change directory (supports ., .., /)',
  '  pwd                Print current directory',
  '  read <file>.mdx    Open a readable file in current directory',
  '  clear              Clear terminal history',
  '  help               Show this help message',
]

const formatAsColumns = (items: string[], columns = 3) => {
  if (items.length === 0) return []
  const maxLength = Math.max(...items.map((item) => item.length))
  const colWidth = maxLength + 4
  const lines: string[] = []

  for (let i = 0; i < items.length; i += columns) {
    const row = items.slice(i, i + columns)
    const line = row
      .map((item, index) => (index === row.length - 1 ? item : item.padEnd(colWidth, ' ')))
      .join('')
    lines.push(line)
  }

  return lines
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

const getChildren = (cwd: string, manifest: TerminalManifest) => {
  const directories = manifest.directories
    .filter((entry) => entry.path !== '/' && getParentPath(entry.path) === cwd)
    .map((entry) => `${entry.name}/`)
  const files = manifest.files
    .filter((entry) => getParentPath(entry.path) === cwd)
    .map((entry) => entry.name)

  return [...directories, ...files].sort((a, b) => a.localeCompare(b))
}

const resolvePath = (cwd: string, input: string) => {
  if (!input || input === '.') return cwd
  if (input === '/') return '/'

  const isAbsolute = input.startsWith('/')
  const segments = (isAbsolute ? input : `${cwd}/${input}`).split('/')
  const stack: string[] = []

  segments.forEach((segment) => {
    if (!segment || segment === '.') return
    if (segment === '..') {
      stack.pop()
      return
    }
    stack.push(segment)
  })

  return normalizePath(`/${stack.join('/')}`)
}

const isValidDirectory = (path: string, manifest: TerminalManifest) => {
  return path === '/' || manifest.directories.some((entry) => entry.path === path)
}

const getCommand = (rawInput: string) => {
  const value = rawInput.trim()
  if (!value) return { command: '', args: [] as string[] }
  const args = value.split(/\s+/)
  return { command: args[0].toLowerCase(), args: args.slice(1) }
}

export const executeTerminalCommand = (
  rawInput: string,
  cwd: string,
  manifest: TerminalManifest
): TerminalExecutionResult => {
  const { command, args } = getCommand(rawInput)

  if (!command) {
    return { output: [], nextCwd: cwd }
  }

  if (command === 'help') {
    return { output: HELP_TEXT, nextCwd: cwd }
  }

  if (command === 'clear') {
    return { output: [], nextCwd: cwd, clear: true }
  }

  if (command === 'pwd') {
    return { output: [cwd], nextCwd: cwd }
  }

  if (command === 'ls') {
    const children = getChildren(cwd, manifest)
    if (children.length === 0) {
      return { output: [], nextCwd: cwd }
    }

    return {
      output: formatAsColumns(children),
      nextCwd: cwd,
    }
  }

  if (command === 'cd') {
    const targetArg = args[0] || '/'
    const targetPath = resolvePath(cwd, targetArg)

    if (!isValidDirectory(targetPath, manifest)) {
      return {
        output: [`cd: no such directory: ${targetArg}`],
        nextCwd: cwd,
      }
    }

    return {
      output: [],
      nextCwd: targetPath,
      navigateTo: targetPath,
    }
  }

  if (command === 'read') {
    const fileName = args[0]
    if (!fileName) {
      return {
        output: ['read: missing file name. Example: read post-name.mdx'],
        nextCwd: cwd,
      }
    }

    const normalizedArg = fileName.endsWith('.mdx') ? fileName : `${fileName}.mdx`
    const resolvedPath = normalizePath(
      normalizedArg.startsWith('/') ? normalizedArg : `${cwd}/${normalizedArg}`
    )
    const targetFile = manifest.files.find((entry) => entry.path === resolvedPath)

    if (!targetFile) {
      return {
        output: [`read: file not found: ${normalizedArg}`],
        nextCwd: cwd,
      }
    }

    return {
      output: [`Opening ${targetFile.name}...`],
      nextCwd: cwd,
      navigateTo: targetFile.route,
    }
  }

  return {
    output: [`command not found: ${command}`, 'Type "help" to view supported commands.'],
    nextCwd: cwd,
  }
}

export const resolveVirtualCwdFromRoute = (pathname: string, manifest: TerminalManifest) => {
  if (!pathname || pathname === '/') return '/'

  const matchedFile = manifest.files.find((entry) => entry.route === pathname)
  if (matchedFile) {
    return getParentPath(matchedFile.path) || '/'
  }

  const matchedDirectory = manifest.directories
    .slice()
    .sort((a, b) => b.path.length - a.path.length)
    .find((entry) => pathname === entry.route || pathname.startsWith(`${entry.route}/`))

  return matchedDirectory?.path || '/'
}
