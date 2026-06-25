# Redis Sentinel Local Setup: Troubleshooting Guide

This guide helps you diagnose, isolate, and resolve issues when running multiple Redis Sentinel instances locally on macOS using Homebrew.

---

## 📋 Common Port Bindings

By default, this local environment relies on three ports. If any of these are bound by other processes, Sentinel instances will fail to launch or report connection errors.

| Service | Port | Description |
| :--- | :--- | :--- |
| **Redis Master** | `6379` | Default Redis primary instance port |
| **Sentinel Instance 1** | `26379` | Default primary Sentinel port |
| **Sentinel Instance 2** | `26380` | Secondary Sentinel port |

### How to Check for Port Conflicts

Run the following command to check if any of these ports are currently in use:

```bash
lsof -i tcp:6379,26379,26380
```

If a process is already running and you need to stop it:
```bash
# Force stop a process on port 26379
kill -9 $(lsof -t -i tcp:26379)
```

---

## 🩺 Diagnose Sentinel States via CLI

You can query Sentinel directly using the standard Redis CLI. This is the most reliable way to check if Sentinels see the master and each other.

### 1. Check Master Status
Connect to a Sentinel and ask for the current master status:
```bash
redis-cli -p 26379 sentinel master billing-master
```
**Expected Output Includes**:
- `name: billing-master`
- `ip: 127.0.0.1`
- `port: 6379`
- `flags: master`
- `num-slaves: 0` (or greater if you run replica nodes)
- `num-other-sentinels: 1` (indicates the two Sentinels discovered each other)

### 2. Check Other Sentinels
To see if Sentinel 1 has successfully discovered Sentinel 2:
```bash
redis-cli -p 26379 sentinel sentinels billing-master
```

### 3. Check Failover Status / Trigger Manual Failover
You can force Sentinel to perform a failover for testing:
```bash
redis-cli -p 26379 sentinel failover billing-master
```

---

## 📂 Log Inspection

Log files are located in the user home subdirectory configured during installation:
- **Directory**: `~/redis-sentinel/logs/`

If Sentinels fail to start or connect, inspect the standard output redirection in your terminal or start the sentinel in the foreground to observe logs:
```bash
redis-server ~/redis-sentinel/sentinel-26379.conf --sentinel
```

---

## ❌ Common Issues and Resolutions

### Issue 1: "Sentinel is in SDOWN (Subjective Down) status"
- **Cause**: The Sentinel cannot reach the Redis Master at `127.0.0.1:6379` within the configured `down-after-milliseconds` timeframe.
- **Fix**: Check if the base Redis server is active:
  ```bash
  redis-cli -p 6379 ping
  # Should respond with "PONG"
  ```
  If it's down, start it using Homebrew:
  ```bash
  brew services start redis
  ```

### Issue 2: "Quorum not reached, failover cannot proceed"
- **Cause**: You need at least 1 Sentinel (as configured via `sentinel monitor billing-master 127.0.0.1 6379 1`) to agree the master is down, but all Sentinel processes are stopped, or there's a network binding issue.
- **Fix**: Ensure both Sentinel instances are active:
  ```bash
  ./scripts/status.sh
  ```
  Start them if they show as `DOWN`:
  ```bash
  ./scripts/start.sh
  ```

### Issue 3: "Configuration file is not writeable"
- **Cause**: Sentinel rewrites its configuration file dynamically when masters fail over or when other sentinels are discovered. If the configuration files under `~/redis-sentinel/` do not have write permissions, Sentinel will crash or complain.
- **Fix**: Grant user read/write permission to the directory:
  ```bash
  chmod -R 755 ~/redis-sentinel
  ```
