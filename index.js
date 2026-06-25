// Redis Sentinel Local (macOS) Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sentinel Config Generator ---
  const masterNameInput = document.getElementById('input-master-name');
  const redisPortInput = document.getElementById('input-redis-port');
  const sentinelPortInput = document.getElementById('input-sentinel-port');
  const quorumInput = document.getElementById('input-quorum');
  const downAfterInput = document.getElementById('input-down-after');
  const failoverTimeoutInput = document.getElementById('input-failover-timeout');
  const codeOutputBlock = document.getElementById('code-output-block');
  const copyConfigBtn = document.getElementById('btn-copy-config');

  function updateConfigOutput() {
    const masterName = masterNameInput.value.trim() || 'mymaster';
    const redisPort = redisPortInput.value || '6379';
    const sentinelPort = sentinelPortInput.value || '26379';
    const quorum = quorumInput.value || '1';
    const downAfter = downAfterInput.value || '5000';
    const failoverTimeout = failoverTimeoutInput.value || '10000';

    const configTemplate = `port ${sentinelPort}
sentinel monitor ${masterName} 127.0.0.1 ${redisPort} ${quorum}
sentinel down-after-milliseconds ${masterName} ${downAfter}
sentinel failover-timeout ${masterName} ${failoverTimeout}`;

    codeOutputBlock.textContent = configTemplate;
  }

  // Bind input listeners
  const inputs = [masterNameInput, redisPortInput, sentinelPortInput, quorumInput, downAfterInput, failoverTimeoutInput];
  inputs.forEach(input => {
    if (input) {
      input.addEventListener('input', updateConfigOutput);
    }
  });

  // Copy Config Button Action
  if (copyConfigBtn) {
    copyConfigBtn.addEventListener('click', () => {
      const configText = codeOutputBlock.textContent;
      navigator.clipboard.writeText(configText).then(() => {
        const originalText = copyConfigBtn.textContent;
        copyConfigBtn.textContent = 'Copied!';
        copyConfigBtn.classList.remove('btn-accent');
        copyConfigBtn.style.backgroundColor = '#10b981';
        copyConfigBtn.style.color = '#fff';
        
        setTimeout(() => {
          copyConfigBtn.textContent = originalText;
          copyConfigBtn.classList.add('btn-accent');
          copyConfigBtn.style.backgroundColor = '';
          copyConfigBtn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy configuration text: ', err);
      });
    });
  }


  // --- 2. Interactive Failover Simulation Diagram ---
  const simulateFailoverBtn = document.getElementById('simulate-failover-btn');
  const resetDiagramBtn = document.getElementById('reset-diagram-btn');
  const diagMaster = document.getElementById('diag-master');
  const diagMasterStatus = document.getElementById('diag-master-status');
  const simulationLog = document.getElementById('simulation-log');

  let simulationTimeouts = [];

  if (simulateFailoverBtn && resetDiagramBtn) {
    simulateFailoverBtn.addEventListener('click', () => {
      // Set master to offline state
      diagMaster.classList.remove('active');
      diagMaster.classList.add('offline');
      diagMasterStatus.textContent = 'OFFLINE';
      
      simulateFailoverBtn.classList.add('hidden');
      simulationLog.textContent = '⚠️ Master Node 6379 went offline! Sentinels detecting failure...';

      // Stage 1: Sentinel 1 Detection
      const timeout1 = setTimeout(() => {
        simulationLog.textContent = '🔍 Sentinel 26379 flagged Master as Subjectively Down (SDOWN).';
      }, 1500);

      // Stage 2: Sentinel 2 Detection and Quorum Agreement
      const timeout2 = setTimeout(() => {
        simulationLog.textContent = '🔍 Sentinel 26380 flagged Master as SDOWN. Quorum of 1 met.';
      }, 3000);

      // Stage 3: Failover and master promotion
      const timeout3 = setTimeout(() => {
        simulationLog.textContent = '✅ Quorum reached. Sentinels agreed on Master ODOWN (Objectively Down). Failover completed.';
        resetDiagramBtn.classList.remove('hidden');
      }, 4500);

      simulationTimeouts = [timeout1, timeout2, timeout3];
    });

    resetDiagramBtn.addEventListener('click', () => {
      // Clear any pending timeout simulation steps
      simulationTimeouts.forEach(clearTimeout);
      simulationTimeouts = [];

      // Reset master state
      diagMaster.classList.remove('offline');
      diagMaster.classList.add('active');
      diagMasterStatus.textContent = 'ONLINE';

      resetDiagramBtn.classList.add('hidden');
      simulateFailoverBtn.classList.remove('hidden');
      simulationLog.textContent = 'System normal. Sentinels monitoring Master on port 6379.';
    });
  }


  // --- 3. Accordion (FAQ) Interactivity ---
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      
      // Toggle active states
      const isActive = item.classList.contains('active');
      
      // Close other active items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.accordion-body');
        if (b) b.style.display = 'none';
      });

      if (!isActive) {
        item.classList.add('active');
        if (body) body.style.display = 'block';
      } else {
        item.classList.remove('active');
        if (body) body.style.display = 'none';
      }
    });
  });

  // Initialize Accordion Body displays
  document.querySelectorAll('.accordion-item').forEach(i => {
    const body = i.querySelector('.accordion-body');
    if (body) {
      if (i.classList.contains('active')) {
        body.style.display = 'block';
      } else {
        body.style.display = 'none';
      }
    }
  });

});

// --- 4. Global Copy Helper (Terminal commands) ---
window.copyText = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Show copy feedback in standard overlay or alert
    const notification = document.createElement('div');
    notification.textContent = 'Command copied!';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = '#10b981';
    notification.style.color = '#fff';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '6px';
    notification.style.zIndex = '1000';
    notification.style.fontFamily = 'sans-serif';
    notification.style.fontWeight = '600';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }).catch(err => {
    console.error('Could not copy command to clipboard: ', err);
  });
};
