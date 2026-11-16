/**
 * Rendu Markdown des leçons et ressources (SPEC § Rendu des leçons) — composant SERVEUR.
 *
 * Chaîne : remark-gfm + remark-math → rehype-raw (HTML des fichiers, ex. <details>) → rehype-sanitize (liste blanche)
 * → rehype-katex (formules) → rehype-highlight (code) → rehype-slug (ancres identiques à lesson.headings).
 * Les blocs ```mermaid sont rendus côté client (MermaidDiagram). Encadrés 💡 / ⚠️ / 🔗 → blockquote[data-callout].
 * Liens externes : target=_blank rel="noopener noreferrer".
 *
 *   <Markdown source={lesson.body} />
 */
import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";
import { MermaidDiagram } from "./mermaid";

const schema: SanitizeSchema = {
  ...defaultSchema,
  // Pas de préfixe « user-content- » : les ancres sont posées après le nettoyage par rehype-slug.
  clobberPrefix: "",
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary", "kbd", "mark", "figure", "figcaption"],
  attributes: {
    ...defaultSchema.attributes,
    details: ["open"],
    code: [...(defaultSchema.attributes?.code ?? []), ["className", /^language-./, "math-inline", "math-display"]],
    span: [...(defaultSchema.attributes?.span ?? []), ["className", "math-inline", "math-display"]],
    div: [...(defaultSchema.attributes?.div ?? []), ["className", "math-display"]],
  },
};

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

function calloutKind(children: React.ReactNode): string | undefined {
  const t = textOf(children).trimStart();
  if (t.startsWith("💡")) return "tip";
  if (t.startsWith("⚠️") || t.startsWith("⚠")) return "warn";
  if (t.startsWith("🔗")) return "link";
  if (t.startsWith("⏱")) return "meta";
  return undefined;
}

const components: Components = {
  a: ({ href, children, ...props }) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote data-callout={calloutKind(children)} {...props}>
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }) => {
    const child = React.Children.toArray(children)[0];
    if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(child) && /\blanguage-mermaid\b/.test(child.props.className ?? "")) {
      return <MermaidDiagram code={textOf(child.props.children)} />;
    }
    return <pre {...props}>{children}</pre>;
  },
  table: ({ children, ...props }) => <table {...props}>{children}</table>,
};

export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("prose-nf", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeKatex, [rehypeHighlight, { detect: false, plainText: ["mermaid", "text", "txt"] }], rehypeSlug]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
