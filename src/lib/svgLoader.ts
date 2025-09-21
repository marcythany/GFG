// SVG loader utility for inline SVG rendering with color theming support
const svgCache = new Map<string, string>();

/**
 * Loads and caches SVG content from the public folder
 * @param svgPath - Path to SVG file relative to public folder (e.g., '/epic-games.svg')
 * @returns Promise resolving to processed SVG content
 */
export async function loadSvgContent(svgPath: string): Promise<string> {
  // Check cache first
  if (svgCache.has(svgPath)) {
    return svgCache.get(svgPath)!;
  }

  try {
    // Fetch SVG content
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${svgPath}`);
    }

    let svgContent = await response.text();

    // Process SVG content to replace hardcoded colors with currentColor and remove fixed sizing
    svgContent = processSvgContent(svgContent);

    // Cache the processed content
    svgCache.set(svgPath, svgContent);

    return svgContent;
  } catch (error) {
    console.error(`Error loading SVG ${svgPath}:`, error);
    // Return a fallback SVG
    return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
  }
}

/**
 * Processes SVG content to replace hardcoded fill colors with currentColor and remove fixed sizing
 * @param svgContent - Raw SVG content
 * @returns Processed SVG content
 */
function processSvgContent(svgContent: string): string {
  // Replace hardcoded fill colors with currentColor
  // This regex matches fill="..." attributes with hex colors, named colors, or rgb values
  const colorRegex =
    /fill="(#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?:[0-9a-fA-F]{2})?|rgb\([^)]+\)|rgba\([^)]+\)|[a-zA-Z]+)"/g;

  svgContent = svgContent.replace(colorRegex, 'fill="currentColor"');

  // Remove width and height attributes from the <svg> tag to allow container-based sizing
  svgContent = svgContent.replace(
    /<svg([^>]*)\s+width="[^"]*"([^>]*)>/g,
    '<svg$1$2>',
  );
  svgContent = svgContent.replace(
    /<svg([^>]*)\s+height="[^"]*"([^>]*)>/g,
    '<svg$1$2>',
  );

  return svgContent;
}

/**
 * Preloads SVG content for better performance
 * @param svgPaths - Array of SVG paths to preload
 */
export async function preloadSvgs(svgPaths: string[]): Promise<void> {
  const promises = svgPaths.map((path) => loadSvgContent(path));
  await Promise.all(promises);
}
