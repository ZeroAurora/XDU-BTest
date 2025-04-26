<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(() => {
    const locationId = localStorage.getItem("locationId");
    if (locationId) goto(`/location/${locationId}`, { replaceState: true });
    else goto("/location", { replaceState: true });
  });
</script>

<div class="flex justify-center items-center h-screen w-full">
  <div class="card bg-base-100 shadow-sm p-4 max-w-xl">
    <div class="card-body text-center">
      <p>如果您停留在此页，请启用 JavaScript 或 <a href="/location" class="link">点击此处</a></p>
    </div>
  </div>
</div>
