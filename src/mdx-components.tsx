import type { MDXComponents } from 'mdx/types';

/**
 * Let's not mess with the MDX components
 *
 * @param components
 * @returns
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children }) => (
      <a href={href} className="underline">
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table>{children}</table>
      </div>
    ),
    ...components,
  };
}
