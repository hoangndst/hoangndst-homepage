import type { Source } from '@/lib/content'
import { MdxSource } from './MdxSource'

export default function BlogSources({ sources }: { sources?: Source[] }) {
  if (!sources?.length) return null

  return (
    <section className="col-start-2 mt-8 pt-2">
      <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Sources
      </h2>
      <div className="mt-2 flex flex-col gap-1">
        {sources.map((source) => (
          <MdxSource key={source.url} {...source} />
        ))}
      </div>
    </section>
  )
}
