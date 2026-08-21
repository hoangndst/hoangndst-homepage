import Image from '@/components/Image'

export function MdxFigure({
  alt,
  caption,
  height = 800,
  src,
  width = 1400,
}: {
  alt: string
  caption?: string
  height?: number
  src: string
  width?: number
}) {
  return (
    <figure className="not-typeset my-10">
      <Image
        alt={alt}
        className="h-auto w-full border border-border"
        height={height}
        sizes="(min-width: 768px) 70ch, 100vw"
        src={src}
        width={width}
      />
      {caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}
