<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          swagger-stats
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="rightShown = !rightShown" />

        <q-btn dense flat size="md" round icon="refresh" />

        <q-btn-toggle
          v-model="refreshSpeed"
          text-color="blue-grey-4"
          toggle-text-color="white"
          size="md"
          dense
          flat
          :options="refreshOptions"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above :mini="miniState" @mouseover="miniState = false" @mouseout="miniState = true" mini-to-overlay v-model="left" side="left" bordered>
      <q-list>
        <q-item to="/" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-chart-line" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Summary</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/horizon" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-water" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Horizon</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/requests" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-exchange-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Requests</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/errors" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-exclamation-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Errors</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/lasterrors" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-exclamation" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Last Errors</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/longest" exact>
          <q-item-section avatar>
            <q-icon name="far fa-hourglass" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Longest Requests</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/rates" exact>
          <q-item-section avatar>
            <q-icon name="far fa-clock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Longest Requests</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/api" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>API</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/apimethod" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-asterisk" />
          </q-item-section>
          <q-item-section>
            <q-item-label>API Methods</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/payload" exact>
          <q-item-section avatar>
            <q-icon name="far fa-file-alt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>API Methods</q-item-label>
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
      </q-list>
    </q-drawer>

    <q-drawer overlay v-model="rightShown" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'SwsUxLayout',

  data() {
    return {
      miniState: true,
      left: true,
      rightShown: false,
      refreshOptions: [
        { icon: 'pause', value: 0 },
        { label: '1s', value: 1000 },
        { label: '30s', value: 30000 },
        { label: '1m', value: 60000 }
      ],
      refreshSpeed: 60000
    };
  }
};
</script>
