<script lang="ts">
  import type { Location } from "$lib/types";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  const search: string = $derived(page.data.search);
  const result: Location | null = $derived(page.data.result);

  function onLocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          goto(`/location?search=${longitude.toFixed(2)},${latitude.toFixed(2)}`, {
            replaceState: true,
          });
        },
        () => {
          alert("获取定位失败");
        },
      );
    } else {
      alert("浏览器不支持定位");
    }
  }
</script>

<main class="container max-w-7xl min-h-screen mx-auto px-4 py-8">
  <div>
    <form method="get" data-sveltekit-replacestate data-sveltekit-keepfocus>
      <fieldset class="fieldset">
        <legend class="fieldset-legend text-xl">搜索地点或定位</legend>
        <div class="join">
          <label class="input input-lg w-full join-item">
            <span class="icon-[tdesign--search]"></span>
            <input type="search" name="search" placeholder="搜索……" value={search} />
          </label>
          <button type="button" class="btn btn-lg join-item" onclick={onLocate}>
            <span class="icon-[tdesign--location]"></span>
            <span class="hidden lg:inline">定位</span>
          </button>
        </div>
      </fieldset>
      <input type="submit" class="hidden" />
    </form>
  </div>

  <ul class="list bg-base-200 rounded-box mt-6">
    <li class="p-4 opacity-60">搜索结果</li>

    {#if result}
      {#each result.location as loc (loc.id)}
        <a href={`/location/${loc.id}`}>
          <li class="list-row">
            <div class="list-col-grow">
              <div class="text-lg">{loc.name}</div>
              <div class="text-gray-500">{`${loc.country} ${loc.adm1} ${loc.adm2}`}</div>
            </div>
          </li>
        </a>
      {/each}
    {:else}
      <li class="list-row">
        <div class="text-lg text-gray-500">没有找到结果</div>
      </li>
    {/if}
  </ul>
</main>
