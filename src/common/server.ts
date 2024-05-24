import React from 'react'
import { Log } from '../logger'

const ALL_AGENTS_URL = "/api/v1/agents"
const ALL_TEST_CONFIGS_URL = "//api/v1/testconfigs/summary"
const ALL_PLUGIN_STATUS_URL = "/api/v1/plugin/status"
const ALL_TESTRUN_STATUS_URL = "/api/v1/testruns/status"

const TESTRUN_LATEST = "/api/v1/testrun/<id>/latest"
const TESTRUN_LASTFAILED = "/api/v1/testrun/<id>/lastFailed"
const PLUGIN_HEALTH = "/api/v1/plugin/<id>/health"

export class ApiClient {
  base_url = ""
  constructor(base_url: string | null) {
    if (base_url == null) {
      this.base_url = "http://localhost:8080"
    } else {
      this.base_url = base_url.replace(/\/$/, ""); // trim trailing /
    }
  }

  public async FetchAgents() {
    Log.i("Fetching agents " + this.base_url + ALL_AGENTS_URL)
    const res = await fetch(this.base_url + ALL_AGENTS_URL);
    return await res.json();
  }

  public async FetchTestConfigs() {
    const res = await fetch(this.base_url + ALL_TEST_CONFIGS_URL);
    return await res.json();
  }

  public async FetchTestRunStatuses() {
    const res = await fetch(this.base_url + ALL_TESTRUN_STATUS_URL);
    return await res.json();
  }

  public async FetchPluginStatuses() {
    const res = await fetch(this.base_url + ALL_PLUGIN_STATUS_URL);
    return await res.json();
  }

  public async FetchTestRun(pluginId: string) {
    const res = await fetch(this.base_url + TESTRUN_LATEST.replaceAll("<id>", pluginId));
    return await res.json();
  }

  public async FetchLastFailedTestRun(pluginId: string) {
    const res = await fetch(this.base_url + TESTRUN_LASTFAILED.replaceAll("<id>", pluginId));
    return await res.json();
  }

  public async FetchPluginHealth(pluginId: string) {
    const res = await fetch(this.base_url + PLUGIN_HEALTH.replaceAll("<id>", pluginId));
    return await res.json();
  }
}

