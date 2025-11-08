import React from "react";

type YoutubeProps = {
    /** Either a YouTube video id (e.g. "dQw4w9WgXcQ") or a full URL */
    idOrUrl: string;
    title?: string;
    start?: number; // seconds
    autoplay?: boolean;
    className?: string;
    useNoCookie?: boolean;
    allowFullScreen?: boolean;
};

/**
 * Usage:
 * <Youtube idOrUrl="dQw4w9WgXcQ" title="Example" start={30} />
 * or
 * <Youtube idOrUrl="https://youtu.be/dQw4w9WgXcQ" />
 */
export default function Youtube({
    idOrUrl,
    title = "YouTube video",
    start,
    autoplay = false,
    className,
    useNoCookie = true,
    allowFullScreen = true,
}: YoutubeProps) {
    const extractId = (input: string) => {
        // try pure id first
        if (/^[0-9A-Za-z_-]{11}$/.test(input)) return input;
        // try v= query or youtu.be short link
        const m =
            input.match(
                /(?:v=|\/vi\/|\/v\/|youtu\.be\/|\/embed\/)([0-9A-Za-z_-]{11})/
            ) || [];
        return m[1] ?? "";
    };

    const id = extractId(idOrUrl);
    if (!id) {
        // gracefully render nothing if id not found
        return null;
    }

    const params = new URLSearchParams();
    params.set("rel", "0");
    params.set("modestbranding", "1");
    params.set("controls", "1");
    if (start && Number.isFinite(start) && start > 0) params.set("start", String(Math.floor(start)));
    if (autoplay) params.set("autoplay", "1");

    const domain = useNoCookie ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
    const src = `${domain}/embed/${id}?${params.toString()}`;

    return (
        <div
            className={className}
            style={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9
                overflow: "hidden",
                borderRadius: "0.5rem",
            }}
        >
            <iframe
                src={src}
                title={title}
                loading="lazy"
                allow={`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share`}
                allowFullScreen={allowFullScreen}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                }}
            />
        </div>
    );
}