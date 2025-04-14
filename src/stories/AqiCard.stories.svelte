<script module>
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import AqiCard from "$lib/components/AqiCard.svelte";

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: "AqiCard",
    component: AqiCard,
    argTypes: {
      aqi: {
        control: {
          type: "number",
          min: 0,
          max: 500,
        },
      },
    },
    args: {
      aqi: 50,
    },
  });
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" />
