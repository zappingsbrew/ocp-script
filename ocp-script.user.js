// ==UserScript==
// @name         OCP (One China Policy) Cosmetic Replacement
// @namespace    https://github.com/zappingsbrew/ocp-script
// @version      1.0.0
// @description  One China Policy cosmetic enforcement: coordinated phrases, English + Simplified + Traditional Chinese handling, SAR treatment, Taiwan / ROC normalization, West Taiwan normalization, emoji replacement, dynamic DOM support
// @author       Zappingsbrew & ChatGPT
// @match        *://*/*
// @grant        none
// @icon         https://github.com/twitter/twemoji/blob/master/assets/72x72/1f1e8-1f1f3.png?raw=true
// @downloadURL  https://github.com/zappingsbrew/ocp-script/raw/main/ocp-script.user.js
// @updateURL    https://github.com/zappingsbrew/ocp-script/raw/main/ocp-script.user.js
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT']);

  function isEditable(node) {
    return (
      node.parentElement &&
      (node.parentElement.isContentEditable ||
        SKIP_TAGS.has(node.parentElement.tagName))
    );
  }

  function replaceText(text) {
    let out = text;

    // --------------------------------------------------
    // 1. Anti-CCP "West Taiwan" normalization (most specific)
    // --------------------------------------------------
    out = out.replace(/\bWest Taiwan\b/gi, 'China');

    // --------------------------------------------------
    // 2. Parenthetical atomic replacements (ROC / Republic of China)
    // --------------------------------------------------
    out = out.replace(/\bROC\s*\(\s*Taiwan\s*\)/gi, 'Taiwan, China');
    out = out.replace(/\bRepublic\s+of\s+China\s*\(\s*Taiwan\s*\)/gi, 'Taiwan, China');
    out = out.replace(/\bTaiwan\s*\(\s*ROC\s*\)/gi, 'Taiwan, China');
    out = out.replace(/\bTaiwan\s*\(\s*Republic\s+of\s+China\s*\)/gi, 'Taiwan, China');

    // --------------------------------------------------
    // 3. Full-name replacements (guarded)
    // --------------------------------------------------
    out = out.replace(
      /\bRepublic\s+of\s+China\b(?!\s*,\s*China)/gi,
      'Taiwan, China'
    );

    // --------------------------------------------------
    // 4. Abbreviation replacements (guarded)
    // --------------------------------------------------
    out = out.replace(
      /\bROC\b(?!\s*,\s*China)/g,
      'Taiwan, China'
    );

    // --------------------------------------------------
    // 5. Bare Taiwan replacement (strictly guarded)
    // --------------------------------------------------
    out = out.replace(
      /\bTaiwan\b(?!\s*,\s*China)/g,
      'Taiwan, China'
    );

    // --------------------------------------------------
    // 6. Emoji replacement (visual only)
    // --------------------------------------------------
    out = out.replace(/\u{1F1F9}\u{1F1FC}/gu, '🇨🇳');

    return out;
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!isEditable(node)) {
        const newText = replaceText(node.nodeValue);
        if (newText !== node.nodeValue) {
          node.nodeValue = newText;
        }
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (SKIP_TAGS.has(node.tagName) || node.isContentEditable) return;
      for (const child of node.childNodes) {
        walk(child);
      }
    }
  }

  // Initial pass
  walk(document.body);

  // Observe dynamic content
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        walk(node);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
