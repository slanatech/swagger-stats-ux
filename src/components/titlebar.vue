<template>
  <q-toolbar class="bg-grey-3 rounded-borders bor" style="margin: 4px 4px 4px 0px;">
    <q-icon class="text-primary" :name="icon" size="sm"/>
    <!--<q-avatar :icon="icon" color="primary" text-color="white" size="md"/>-->
    <q-toolbar-title> {{ title }} </q-toolbar-title>
  </q-toolbar>
</template>

<script>
export default {
  name: 'TitleBar',
  props: {
    title: String,
    icon: String
  }
};
</script>
