<script lang="ts">
  import type { PageProps } from "./$types";

  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  import AqiCard from "$lib/components/AqiCard.svelte";
  import DetailCard from "$lib/components/DetailCard.svelte";

  const { data }: PageProps = $props();
  const now = $derived(data.airQuality?.now || {});

  let displayAlert = $derived(page.form?.cleared as boolean);

  $effect(() => {
    if (displayAlert) {
      setTimeout(() => {
        displayAlert = false;
      }, 2000);
    }
  });

  onMount(() => {
    localStorage.setItem("locationId", data.location.id);
  });

  function getBgColor(aqi: number): string {
    if (aqi === 0) return "";
    if (aqi <= 50) return "bg-green-50";
    if (aqi <= 100) return "bg-sky-50";
    if (aqi <= 150) return "bg-amber-50";
    if (aqi <= 200) return "bg-orange-100";
    if (aqi <= 300) return "bg-red-100";
    return "bg-purple-200";
  }
</script>

<div class={getBgColor(Number(now.aqi))}>
  <main class="container max-w-7xl min-h-screen mx-auto px-4 py-8">
    <header class="flex flex-col gap-2">
      <h1 class="text-4xl font-bold">{data.location.name}</h1>
      <div class="flex items-center gap-2">
        <p class="text-lg text-gray-500">
          {data.location.country}
          {data.location.adm1}
          {data.location.adm2}
        </p>
        <a class="icon-[tdesign--location] size-[1rem]" href="/location" aria-label="选择地点"></a>
      </div>
    </header>

    <section class="flex flex-col gap-6 mt-6">
      <AqiCard aqi={Number(now.aqi || 0)} />
      <DetailCard aqNow={now} />
    </section>

    <footer class="mt-6 text-sm text-gray-500">
      <p>数据来源：和风天气</p>
      <p>上次更新：{new Date(now.pubTime).toLocaleString()}</p>
      <form action="?/clearCache" method="POST" use:enhance>
        <button class="link">清除服务器缓存</button>
      </form>
    </footer>

    {#if displayAlert}
      <div class="toast" out:scale={{ duration: 250, start: 0.9, opacity: 0 }}>
        <div role="alert" class="alert">
          <span>缓存已清除</span>
        </div>
      </div>
    {/if}
  </main>
</div>
