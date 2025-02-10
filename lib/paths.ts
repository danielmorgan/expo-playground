import { SkPoint } from "@shopify/react-native-skia";

export function hexagon(center: SkPoint, size: number): string {
  const pathCommands: string[] = [];
  
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30;
    const angleRad = (Math.PI / 180) * angleDeg;

    const x = center.x + size * Math.cos(angleRad);
    const y = center.y + size * Math.sin(angleRad);

    // Move to first point, then line to others
    if (i === 0) {
      pathCommands.push(`M ${x} ${y}`);
    } else {
      pathCommands.push(`L ${x} ${y}`);
    }
  }

  // Close the path
  pathCommands.push('Z');

  return pathCommands.join(' ');
}