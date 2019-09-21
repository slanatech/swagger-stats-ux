<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="right = !right" />
      </q-toolbar>

    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/about" exact>
          <q-item-section avatar>
            <q-icon name="info" />
          </q-item-section>
          <q-item-section>
            <q-item-label>About</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/dashboard" exact>
          <q-item-section avatar>
            <q-icon name="signal" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer show-if-above overlay v-model="right" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
  <!--
  <div class="q-pa-md">
    <q-layout view="hHh Lpr fFr">
      <q-header elevated class="glossy">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="menu"
          />

          <q-toolbar-title>
            Quasar App
          </q-toolbar-title>

          <div>Quasar v{{ $q.version }}</div>
        </q-toolbar>
      </q-header>

      <q-drawer
        :value="true"
        :mini="false"
        show-if-above
        elevated
        content-class="bg-grey-2"
      >
        <q-list>
          <q-item-label header>Navigation</q-item-label>
          <q-item to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/about" exact>
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              <q-item-label>About</q-item-label>
            </q-item-section>
          </q-item>
          <q-item to="/dashboard" exact>
            <q-item-section avatar>
              <q-icon name="signal" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-item-label header>Essential Links</q-item-label>
          <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Docs</q-item-label>
              <q-item-label caption>quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            target="_blank"
            href="https://github.com/quasarframework/"
          >
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Github</q-item-label>
              <q-item-label caption>github.com/quasarframework</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            target="_blank"
            href="https://chat.quasar.dev"
          >
            <q-item-section avatar>
              <q-icon name="chat" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Discord Chat Channel</q-item-label>
              <q-item-label caption>chat.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            target="_blank"
            href="https://forum.quasar.dev"
          >
            <q-item-section avatar>
              <q-icon name="forum" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Forum</q-item-label>
              <q-item-label caption>forum.quasar.dev</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            tag="a"
            target="_blank"
            href="https://twitter.com/quasarframework"
          >
            <q-item-section avatar>
              <q-icon name="rss_feed" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Twitter</q-item-label>
              <q-item-label caption>@quasarframework</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-drawer>

      <q-drawer
          v-model="leftDrawerOpen"
          side="right"
          :width="200"
          :breakpoint="500"
          show-if-above
          bordered
          content-class="bg-grey-3"
      >
        <div>OPA</div>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
  -->
</template>

<script>
export default {
  name: "LayoutDefault",

  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      left: true,
      right: false

    };
  }
};
</script>
