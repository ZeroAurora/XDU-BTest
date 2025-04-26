<script lang="ts">
  import type { Now } from "$lib/types/AirQuality";

  interface Props {
    aq: Now;
  }
  const { aq }: Props = $props();

  const pollutants = {
    co: "一氧化碳",
    no2: "二氧化氮",
    o3: "臭氧",
    pm10: "PM10",
    pm2p5: "PM2.5",
    so2: "二氧化硫",
  } as const;
</script>

<div class="card bg-base-200/50 shadow-sm">
  <div class="card-body">
    <h2 class="card-title text-2xl">空气污染物详情</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      {#each Object.entries(pollutants) as [key, label] (key)}
        <div class="flex flex-col items-center p-3 bg-base-100/50 rounded-sm shadow-xs">
          <div class="text-xl font-bold">
            <span>{aq[key as keyof Now]}</span>
          </div>
          <div class="text-sm text-gray-500">{label}</div>
        </div>
      {/each}
    </div>
  </div>
</div>
