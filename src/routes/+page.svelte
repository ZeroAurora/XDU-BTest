<script lang="ts">
  import type { PageProps } from "./$types";
  import AqiCard from "$lib/components/AqiCard.svelte";
  import DetailCard from "$lib/components/DetailCard.svelte";

  const { data }: PageProps = $props();
  const now = $derived(data.airQuality?.now || {});
</script>

<main class="container mx-auto max-w-7xl px-4">
  <header class="mb-6 text-center">
    <h1 class="text-3xl font-bold">{data.location.name}</h1>
  </header>
  
  <section class="flex flex-col gap-6">
    <div>
      <AqiCard aqi={Number(now.aqi || 0)} />
    </div>
    
    <DetailCard aqNow={now} />
  </section>
</main>
