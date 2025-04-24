<script lang="ts">
  import type { PageProps } from "./$types";

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
</script>

<main class="container mx-auto max-w-7xl px-4">
  <header class="my-6 text-center">
    <h1 class="text-3xl font-bold">{data.location.name}</h1>
  </header>

  <section class="flex flex-col gap-6">
    <AqiCard aqi={Number(now.aqi || 0)} />
    <DetailCard aqNow={now} />
  </section>

  <footer class="mt-6 text-center text-sm text-gray-500">
    <p>数据来源：和风天气</p>
    <p>上次更新：{new Date(now.pubTime).toLocaleString()}</p>
    <form action="?/clearCache" method="POST" use:enhance>
      <input
        type="hidden"
        name="locationId"
        value={page.url.searchParams.get("locationId") || ""}
      />
      <button class="link">清除缓存</button>
    </form>
  </footer>

  {#if displayAlert}
    <div class="toast" out:scale={{ duration: 250, start: 0.9, opacity: 0}}>
      <div role="alert" class="alert">
        <span>缓存已清除</span>
      </div>
    </div>
  {/if}
</main>
