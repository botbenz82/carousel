export const generateRandomColors = (numColors: number): string[] => {
    const colors = new Set<string>();
  
    while (colors.size < numColors) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      colors.add(color);
    }
  
    return Array.from(colors);
  };