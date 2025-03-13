import { Group, SkFont, Text } from "@shopify/react-native-skia";
import { PieSliceData } from "victory-native";

export type PieLabelProps = {
  slice: PieSliceData;
  font: SkFont | null;
  position: { x: number; y: number };
};

export function PieLabel({ slice, font, position }: PieLabelProps) {
  const { x, y } = position;
  const fontSize = font?.getSize() ?? 0;
  const getLabelWidth = (text: string) =>
    font
      ?.getGlyphWidths(font.getGlyphIDs(text))
      .reduce((sum, value) => sum + value, 0) ?? 0;

  const value = `${slice.value}%`;
  const centerLabel = (font?.getSize() ?? 0) / 2;

  return (
    <Group transform={[{ translateY: -centerLabel }]}>
      <Text
        x={x - getLabelWidth(value) / 2}
        y={y + fontSize}
        text={value}
        font={font}
        color={"black"}
      />
    </Group>
  );
}
