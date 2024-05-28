import React from 'react'
import { DEFAULT_SERVER_URL, GetConfigIdFromPluginId } from './common/common'
import { GetStatusFromPassRatio, TestRunStatus } from './common/status/status'
import { Log } from './logger'

const ALL_AGENTS_URL = "/api/v1/agents"
const ALL_TEST_CONFIGS_URL = "//api/v1/testconfigs/summary"
const ALL_PLUGIN_STATUS_URL = "/api/v1/plugins/status"
const ALL_TESTRUN_STATUS_URL = "/api/v1/testruns/status"

const TESTRUN_LATEST = "/api/v1/testrun/<id>/latest"
const TESTRUN_LASTFAILED = "/api/v1/testrun/<id>/lastFailed"
const PLUGIN_HEALTH = "/api/v1/plugin/<id>/health"
const TESTRUN_LATEST_LOGS = "/api/v1/testrun/<id>/latest/logs"
const TESTRUN_LASTFAILED_LOGS = "/api/v1/testrun/<id>/lastFailed/logs"

export class ApiClient {
  base_url = ""
  constructor(base_url: string | null) {
    if (base_url == null) {
      this.base_url = DEFAULT_SERVER_URL
    } else {
      this.base_url = base_url.replace(/\/$/, ""); // trim trailing /
    }
  }

  public async FetchAll() {
    let agents = {}
    return this.FetchAgents()
    .then(async data => {
        agents = data
        let [testConfigs, testRunPassRatios, pluginStatuses] = await Promise.all([
          this.FetchTestConfigs(),
          this.FetchTestRunStatuses(),
          this.FetchPluginStatuses()
        ]);

        let config : any = {}
        Object.keys(testConfigs).forEach((configId) => {
          config[configId] = {
            "configSummary" : {},
            "plugins": {}
          }
          config[configId].configSummary = testConfigs[configId]
        })
        Object.keys(pluginStatuses).forEach((pluginId) => {
          let configId = GetConfigIdFromPluginId(pluginId)
          if (config[configId]) {
            config[configId].plugins[pluginId] = {
              "testRunPassRatio": null,
              "testRunStatus": TestRunStatus.Unknown,
              "healthStatus": pluginStatuses[pluginId]
            }
          }
        })
        Object.keys(testRunPassRatios).forEach((pluginId) => {
          let configId = GetConfigIdFromPluginId(pluginId)
          if (config[configId] && config[configId].plugins[pluginId]) {
            config[configId].plugins[pluginId].testRunPassRatio = testRunPassRatios[pluginId]
            config[configId].plugins[pluginId].testRunStatus = GetStatusFromPassRatio(testRunPassRatios[pluginId])
          }
        })
        return {'agents': agents, 'config': config}
      })
  }

  public async FetchAllPluginData(pluginId : string) {
    let [testRunData, lastFailedTestRunData, pluginHealthData] = await Promise.all([
      this.FetchTestRun(pluginId),
      this.FetchLastFailedTestRun(pluginId),
      this.FetchPluginHealth(pluginId)
    ]);
    return {
      "pluginHealth" : pluginHealthData,
      "testRunData": testRunData,
      "lastFailedTestRunData": lastFailedTestRunData
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
    Log.d("Fetching Test Run data " + pluginId)
    return fetch(this.base_url + TESTRUN_LATEST.replaceAll("<id>", pluginId));
  }

  public async FetchLastFailedTestRun(pluginId: string) {
    Log.d("Fetching Last Failed Test Run " + pluginId)
    return fetch(this.base_url + TESTRUN_LASTFAILED.replaceAll("<id>", pluginId))
  }

  public async FetchPluginHealth(pluginId: string) {
    Log.d("Fetching Plugin health " + pluginId)
    return fetch(this.base_url + PLUGIN_HEALTH.replaceAll("<id>", pluginId));
  }

  public GetLogsUrl(pluginId: string) {
    return this.base_url + TESTRUN_LATEST_LOGS.replaceAll("<id>", pluginId)
  }

  public GetLasFailedLogsUrl(pluginId: string) {
    return this.base_url + TESTRUN_LASTFAILED_LOGS.replaceAll("<id>", pluginId)
  }
}

