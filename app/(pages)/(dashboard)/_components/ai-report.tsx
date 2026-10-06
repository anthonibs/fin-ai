import Markdown from "react-markdown";

interface AiReportMarkdownProps {
  content: string;
}

export function AiReportMarkdown({ content }: AiReportMarkdownProps) {
  return (
    <div className="text-foreground space-y-4 text-sm">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-primary mt-6 mb-3 border-b pb-2 text-2xl font-bold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-foreground border-border/60 mt-6 mb-2 flex items-center gap-2 border-b pb-1.5 text-lg font-semibold tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-foreground/90 mt-4 mb-2 text-base font-semibold">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground my-2.5 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="text-muted-foreground my-3 ml-4 list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="text-muted-foreground my-3 ml-4 list-decimal space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="marker:text-primary pl-1 leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-foreground font-semibold">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-primary/50 bg-muted/30 text-muted-foreground my-4 rounded-r-md border-l-4 px-4 py-2 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border/80 my-6" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
