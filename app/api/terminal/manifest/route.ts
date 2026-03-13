import { NextResponse } from 'next/server'
import terminalManifest from 'app/terminal-manifest.json'

export async function GET() {
  return NextResponse.json(terminalManifest)
}
