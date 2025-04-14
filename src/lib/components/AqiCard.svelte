<script lang="ts">
  import AqiSvg from "./AqiSvg.svelte";

  interface Props {
    aqi: number;
  }
  let props: Props = $props();

  let text: HTMLElement;

  // 颜色插值函数
  function interpolateColor(color1: number[], color2: number[], factor: number): number[] {
    const [r1, g1, b1] = color1;
    const [r2, g2, b2] = color2;
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    return [r, g, b];
  }

  // 计算AQI对应的颜色
  function getAQIColor(aqi: number): number[] {
    const colors = [
      [30, 132, 73],
      [40, 116, 166],
      [243, 156, 18],
      [230, 126, 34],
      [231, 76, 60],
      [108, 52, 131],
    ];
    const thresholds = [50, 100, 150, 200, 300, 500];
    const index = thresholds.findIndex((threshold) => aqi <= threshold);
    if (index === -1) return colors[colors.length - 1]; // 超过最大值，返回最后一个颜色
    if (index === 0) return colors[0]; // 小于等于第一个阈值，返回第一个颜色
    if (index === colors.length) return colors[colors.length - 1]; // 超过最大值，返回最后一个颜色
    const lowerThreshold = thresholds[index - 1];
    const upperThreshold = thresholds[index];
    const lowerColor = colors[index - 1];
    const upperColor = colors[index];
    const ratio = (aqi - lowerThreshold) / (upperThreshold - lowerThreshold);
    return interpolateColor(lowerColor, upperColor, ratio);
  }

  const color = $derived(getAQIColor(props.aqi));

  // 获取AQI对应的评价
  function getAQIStatus(aqi: number): string {
    if (aqi <= 50) return "优";
    if (aqi <= 100) return "良";
    if (aqi <= 150) return "轻度污染";
    if (aqi <= 200) return "中度污染";
    if (aqi <= 300) return "重度污染";
    return "严重污染";
  }

  // 设置文本颜色
  $effect(() => {
    if (text && props.aqi !== undefined) {
      text.style.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }
  });
</script>

<div class="card bg-gray-100/50 shadow-sm w-[300px] h-[300px]">
  <div class="card-body">
    <h2 class="card-title text-xl">空气质量指数（AQI）</h2>
    <div class="flex w-full h-full items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="w-[200px] h-[120px]">
          <AqiSvg aqi={props.aqi} {color} />
        </div>
        <span bind:this={text} class="text-xl font-bold mt-2">{getAQIStatus(props.aqi)}</span>
      </div>
    </div>
  </div>
</div>
