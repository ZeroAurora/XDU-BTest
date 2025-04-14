<script lang="ts">
  interface Props {
    aqi: number;
    color: number[];
  }
  let props: Props = $props();

  // SVG drawing constants
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  const arcWidth = 5;
  const arcStartAngle = -Math.PI;
  const arcEndAngle = 0;
  const pointerSize = 10;
  const fontSize = 40;

  // SVG path for arc segments
  function describeArc(
    x: number,
    y: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number,
  ): string {
    const startInnerX = x + innerRadius * Math.cos(startAngle);
    const startInnerY = y + innerRadius * Math.sin(startAngle);
    const endInnerX = x + innerRadius * Math.cos(endAngle);
    const endInnerY = y + innerRadius * Math.sin(endAngle);
    const startOuterX = x + outerRadius * Math.cos(startAngle);
    const startOuterY = y + outerRadius * Math.sin(startAngle);
    const endOuterX = x + outerRadius * Math.cos(endAngle);
    const endOuterY = y + outerRadius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

    // prettier-ignore
    return [
      "M", startInnerX, startInnerY,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, endInnerX, endInnerY,
      "L", endOuterX, endOuterY,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, startOuterX, startOuterY,
      "Z"
    ].join(" ");
  }

  const normalizedAQI = $derived(Math.min(Math.max(props.aqi, 0), 500) / 500);
  const aqiAngle = $derived(arcStartAngle + normalizedAQI * Math.PI);
  const backgroundPath = $derived(
    describeArc(centerX, centerY, radius, radius + arcWidth, arcStartAngle, arcEndAngle),
  );
  const indicatorPath = $derived(
    describeArc(centerX, centerY, radius, radius + arcWidth, arcStartAngle, aqiAngle),
  );
  const colorString = $derived(`rgb(${props.color[0]}, ${props.color[1]}, ${props.color[2]})`);
  const pointerX = $derived(centerX + (radius + arcWidth / 2) * Math.cos(aqiAngle));
  const pointerY = $derived(centerY + (radius + arcWidth / 2) * Math.sin(aqiAngle));
  const textX = $derived(centerX);
  const textY = $derived(centerY - fontSize / 2);
</script>

<svg width="200" height="120" viewBox="0 0 200 120">
  <!-- Background arc -->
  <path d={backgroundPath} fill="#e0e0e0" />

  <!-- Indicator arc -->
  <path d={indicatorPath} fill={colorString} />

  <!-- Pointer -->
  <circle cx={pointerX} cy={pointerY} r={pointerSize / 2} fill={colorString} />

  <!-- AQI Text -->
  <text
    x={textX}
    y={textY}
    fill={colorString}
    font-size={fontSize}
    font-weight="bold"
    text-anchor="middle"
    dominant-baseline="central"
  >
    {props.aqi}
  </text>
</svg>
