<script lang="ts">
  import type { PageProps } from "./$types";

  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  import AqiCard from "$lib/components/AqiCard.svelte";
  import AqDetailCard from "$lib/components/AqDetailCard.svelte";

  const { data }: PageProps = $props();
  const location = $derived(data.location);
  const weather = $derived(data.weather?.now || {});
  const aq = $derived(data.airQuality?.now || {});

  let displayAlert = $derived(page.form?.cleared as boolean);

  $effect(() => {
    if (displayAlert) {
      setTimeout(() => {
        displayAlert = false;
      }, 2000);
    }
  });

  onMount(() => {
    localStorage.setItem("locationId", location.id);
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

<div class={getBgColor(Number(aq.aqi))}>
  <main class="container max-w-7xl min-h-screen mx-auto px-4 py-8">
    <header class="flex flex-col gap-2">
      <div class="flex justify-between text-4xl font-bold">
        <h1>{location.name}</h1>
        <p>{weather.temp}°C</p>
      </div>
      <div class="flex justify-between text-lg text-gray-500">
        <div class="flex items-center gap-2">
          <p>
            <span>{location.country}</span>
            <span>{location.adm1}</span>
            <span>{location.adm2}</span>
          </p>
          <a class="icon-[tdesign--location]" href="/location" aria-label="选择地点"></a>
        </div>
        <p>
          <span class="qi-{weather.icon}"></span>
          {weather.text}
        </p>
      </div>
    </header>

    <section class="flex flex-col gap-6 mt-6">
      <AqiCard aqi={Number(aq.aqi || 0)} />
      <AqDetailCard {aq} />
    </section>

    <footer class="mt-6 text-sm text-gray-500">
      <p>数据来源：和风天气</p>
      <p>上次更新：{new Date(aq.pubTime).toLocaleString()}</p>
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
