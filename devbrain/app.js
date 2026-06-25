import { rulesCatalog } from './catalog.js';

// Application State
let catalog = [...rulesCatalog];
let activeTab = 'marketplace';
let activeFilter = 'all';
let searchKeyword = '';

let builderActivePreview = 'cursor'; // 'cursor' | 'agents'
let selectedModalRule = null;
let selectedModalPreview = 'cursor'; // 'cursor' | 'agents'

// DOM Elements
const navMarketplace = document.getElementById('nav-marketplace');
const navBuilder = document.getElementById('nav-builder');
const navDocs = document.getElementById('nav-docs');

const tabMarketplace = document.getElementById('tab-marketplace');
const tabBuilder = document.getElementById('tab-builder');
const tabDocs = document.getElementById('tab-docs');

const rulesGrid = document.getElementById('rules-grid');
const searchInput = document.getElementById('marketplace-search');
const tagFilters = document.getElementById('tag-filters');

// Builder Inputs
const builderTitle = document.getElementById('rule-title');
const builderFramework = document.getElementById('rule-framework');
const builderDesc = document.getElementById('rule-desc');
const builderLang = document.getElementById('rule-lang');
const builderTags = document.getElementById('rule-tags');
const builderStructure = document.getElementById('rule-structure');
const builderPatterns = document.getElementById('rule-patterns');

const codeOutput = document.getElementById('code-output');
const btnPreviewCursor = document.getElementById('btn-preview-cursor');
const btnPreviewAgents = document.getElementById('btn-preview-agents');
const btnCopyRule = document.getElementById('btn-copy-rule');
const btnPublishRule = document.getElementById('btn-publish-rule');

// Modal Elements
const modal = document.getElementById('rule-detail-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTitleText = document.getElementById('modal-title-text');
const modalIcon = document.getElementById('modal-icon');
const modalFramework = document.getElementById('modal-framework');
const modalStars = document.getElementById('modal-stars');
const modalAuthor = document.getElementById('modal-author');
const modalDescription = document.getElementById('modal-description');
const modalSyncCmd = document.getElementById('modal-sync-cmd');
const modalCopyCmdBtn = document.getElementById('modal-copy-cmd-btn');
const modalCodeOutput = document.getElementById('modal-code-output');
const modalCopyCodeBtn = document.getElementById('modal-copy-code-btn');
const modalApplyCursor = document.getElementById('modal-apply-cursor');
const modalApplyAgents = document.getElementById('modal-apply-agents');

// Toast Element
const toastNotify = document.getElementById('toast-notify');
const toastMessage = document.getElementById('toast-message');

// Navigation Function
function switchTab(targetTab) {
  activeTab = targetTab;
  
  // Update nav buttons
  navMarketplace.classList.toggle('active', targetTab === 'marketplace');
  navBuilder.classList.toggle('active', targetTab === 'builder');
  navDocs.classList.toggle('active', targetTab === 'docs');

  // Update tab visibility
  tabMarketplace.classList.toggle('active', targetTab === 'marketplace');
  tabBuilder.classList.toggle('active', targetTab === 'builder');
  tabDocs.classList.toggle('active', targetTab === 'docs');

  if (targetTab === 'builder') {
    compileBuilderRules();
  }
}

// Attach Nav Listeners
navMarketplace.addEventListener('click', () => switchTab('marketplace'));
navBuilder.addEventListener('click', () => switchTab('builder'));
navDocs.addEventListener('click', () => switchTab('docs'));

// Toast Utilities
function showToast(message) {
  toastMessage.textContent = message;
  toastNotify.classList.add('show');
  setTimeout(() => {
    toastNotify.classList.remove('show');
  }, 2500);
}

window.showToast = showToast; // expose to inline copy handlers in html

// Render Marketplace Cards
function renderMarketplace() {
  rulesGrid.innerHTML = '';
  
  const filtered = catalog.filter(rule => {
    // Filter by tag button
    if (activeFilter !== 'all') {
      const matchTag = rule.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase());
      const matchFramework = rule.framework.toLowerCase().includes(activeFilter.toLowerCase());
      if (!matchTag && !matchFramework) return false;
    }
    
    // Filter by search bar keyword
    if (searchKeyword) {
      const key = searchKeyword.toLowerCase();
      const matchTitle = rule.title.toLowerCase().includes(key);
      const matchDesc = rule.description.toLowerCase().includes(key);
      const matchFramework = rule.framework.toLowerCase().includes(key);
      const matchAuthor = rule.author.toLowerCase().includes(key);
      const matchTags = rule.tags.some(t => t.toLowerCase().includes(key));
      return matchTitle || matchDesc || matchFramework || matchAuthor || matchTags;
    }
    
    return true;
  });

  if (filtered.length === 0) {
    rulesGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; display:block;"></i>
        No matching rules found. Try adjusting your filters.
      </div>
    `;
    return;
  }

  filtered.forEach(rule => {
    const card = document.createElement('div');
    card.className = 'rule-card';
    card.innerHTML = `
      <div class="card-header">
        <span class="card-icon">${rule.icon || '📜'}</span>
        <span class="card-stars"><i class="fa-solid fa-star" style="color: #fbbf24;"></i> ${rule.stars}</span>
      </div>
      <div>
        <h3 class="card-title">${rule.title}</h3>
        <p class="card-desc">${rule.description}</p>
      </div>
      <div class="card-footer">
        <span class="card-author">by ${rule.author}</span>
        <div class="card-tags">
          ${rule.tags.slice(0, 2).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    card.addEventListener('click', () => openRuleModal(rule));
    rulesGrid.appendChild(card);
  });
}

// Search and Filter Listeners
searchInput.addEventListener('input', (e) => {
  searchKeyword = e.target.value;
  renderMarketplace();
});

tagFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('tag-btn')) {
    document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.dataset.filter;
    renderMarketplace();
  }
});

// Modal Logic
function openRuleModal(rule) {
  selectedModalRule = rule;
  selectedModalPreview = 'cursor';
  
  modalTitleText.textContent = rule.title;
  modalIcon.textContent = rule.icon || '📜';
  modalFramework.textContent = rule.framework;
  modalStars.textContent = rule.stars;
  modalAuthor.textContent = rule.author;
  modalDescription.textContent = rule.description;
  modalSyncCmd.textContent = `python3 devbrain.py sync ${rule.id}`;
  
  updateModalCodePreview();
  
  modal.classList.add('active');
}

function updateModalCodePreview() {
  if (!selectedModalRule) return;
  
  if (selectedModalPreview === 'cursor') {
    modalCodeOutput.textContent = selectedModalRule.rules.cursorrules;
  } else {
    modalCodeOutput.textContent = selectedModalRule.rules.agents;
  }
}

modalCloseBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  selectedModalRule = null;
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
    selectedModalRule = null;
  }
});

modalCopyCmdBtn.addEventListener('click', () => {
  if (selectedModalRule) {
    navigator.clipboard.writeText(`python3 devbrain.py sync ${selectedModalRule.id}`);
    showToast('Sync command copied to clipboard!');
  }
});

modalCopyCodeBtn.addEventListener('click', () => {
  if (selectedModalRule) {
    const text = selectedModalPreview === 'cursor' ? selectedModalRule.rules.cursorrules : selectedModalRule.rules.agents;
    navigator.clipboard.writeText(text);
    showToast('Rule content copied to clipboard!');
  }
});

// Download helper function
function triggerDownload(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

modalApplyCursor.addEventListener('click', () => {
  if (selectedModalRule) {
    triggerDownload('.cursorrules', selectedModalRule.rules.cursorrules);
    showToast('.cursorrules download initiated!');
  }
});

modalApplyAgents.addEventListener('click', () => {
  if (selectedModalRule) {
    triggerDownload('AGENTS.md', selectedModalRule.rules.agents);
    showToast('AGENTS.md download initiated!');
  }
});

// Builder Compiler Logic
function getCompiledCursorContent() {
  const title = builderTitle.value || 'Custom Project Rules';
  const fw = builderFramework.value || 'Generic Stack';
  const desc = builderDesc.value || '';
  const lang = builderLang.value;
  const tags = builderTags.value;
  const structure = builderStructure.value;
  const patterns = builderPatterns.value;

  return `# ${title} Architecture Rules

Target Framework: ${fw}
Language: ${lang}
Tags: ${tags}

## Description
${desc}

## Project Directory & Structure Requirements
${structure ? structure : 'No explicit folder requirements set.'}

## Code Guidelines & Coding Patterns
${patterns ? patterns : 'Standard coding guidelines apply.'}
`;
}

function getCompiledAgentsContent() {
  const title = builderTitle.value || 'Custom Project Rules';
  const desc = builderDesc.value || '';
  const structure = builderStructure.value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, '')).join('\n  - ');
  const patterns = builderPatterns.value.split('\n').filter(l => l.trim()).map(l => l.replace(/^\d+\.\s*/, '')).join('\n  - ');

  return `name: ${title}
description: ${desc}
rules:
  - "Follow repository folder standards"
  ${structure ? `- "${structure.split('\n  - ').join('"\n  - "')}"` : ''}
  ${patterns ? `- "${patterns.split('\n  - ').join('"\n  - "')}"` : ''}
`;
}

function compileBuilderRules() {
  if (builderActivePreview === 'cursor') {
    codeOutput.textContent = getCompiledCursorContent();
  } else {
    codeOutput.textContent = getCompiledAgentsContent();
  }
}

// Builder Listeners
[builderTitle, builderFramework, builderDesc, builderLang, builderTags, builderStructure, builderPatterns].forEach(el => {
  el.addEventListener('input', compileBuilderRules);
});

btnPreviewCursor.addEventListener('click', () => {
  builderActivePreview = 'cursor';
  btnPreviewCursor.classList.add('active');
  btnPreviewAgents.classList.remove('active');
  compileBuilderRules();
});

btnPreviewAgents.addEventListener('click', () => {
  builderActivePreview = 'agents';
  btnPreviewAgents.classList.add('active');
  btnPreviewCursor.classList.remove('active');
  compileBuilderRules();
});

btnCopyRule.addEventListener('click', () => {
  const content = builderActivePreview === 'cursor' ? getCompiledCursorContent() : getCompiledAgentsContent();
  navigator.clipboard.writeText(content);
  showToast('Copied rule setup to clipboard!');
});

btnPublishRule.addEventListener('click', () => {
  const title = builderTitle.value || 'Untitled Rule';
  const desc = builderDesc.value || 'No description provided.';
  const framework = builderFramework.value || 'Generic';
  const lang = builderLang.value;
  const tagsStr = builderTags.value;
  
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
  
  const newRule = {
    id: id || 'custom-rule-' + Date.now(),
    title: title,
    description: desc,
    framework: framework,
    language: lang,
    tags: tags.length ? tags : ['Custom'],
    icon: '💡',
    author: 'You (Local Creator)',
    stars: 1,
    rules: {
      cursorrules: getCompiledCursorContent(),
      agents: getCompiledAgentsContent()
    }
  };
  
  catalog.unshift(newRule);
  renderMarketplace();
  showToast(`Successfully published "${title}" to local session!`);
  
  // Transition back to marketplace tab to view it
  setTimeout(() => {
    switchTab('marketplace');
  }, 1000);
});

// App Init
renderMarketplace();
compileBuilderRules();
console.log('DevBrain Hub initialized successfully.');
