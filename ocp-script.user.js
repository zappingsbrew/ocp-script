// ==UserScript==
// @name         OCP (One China Policy) Cosmetic Replacement
// @namespace    https://github.com/zappingsbrew/ocp-script
// @version      1.0.0
// @description  Safe cosmetic One China Policy replacement: handles Taiwan, West Taiwan, parentheticals, emoji, and preserves case. Leaves Taiwan Province, ROC, PRC, and full names untouched.
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

    const SKIP_TAGS = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT']);

    function isEditable(node){
        return node.parentElement && (node.parentElement.isContentEditable || SKIP_TAGS.has(node.parentElement.tagName));
    }

    // Helper: preserve case
    function preserveCase(original, replacement){
        if(original.toUpperCase() === original) return replacement.toUpperCase();
        if(original.toLowerCase() === original) return replacement.toLowerCase();
        // Default: Title case / mixed
        return replacement;
    }

    function replaceText(text){
        let out = text;

        // -------------------------------
        // Step 0: Protect phrases that should never change
        // -------------------------------
        out = out.replace(/\bRepublic of China\b/g, '__ROC__');
        out = out.replace(/\bROC\b/g, '__ROC_SHORT__');
        out = out.replace(/\bPRC\b/g, '__PRC__');
        out = out.replace(/\bPeople's Republic of China\b/g, '__PRC_FULL__');
        out = out.replace(/\bTaiwan Province\b/g, '__TAIWAN_PROV__');

        // -------------------------------
        // Step 1: Aggressive replacements (longest first)
        // -------------------------------
        // West Taiwan → China
        out = out.replace(/\bWest Taiwan\b/gi, match => preserveCase(match, 'China'));

        // Taiwan (Republic of China) → Taiwan, China
        out = out.replace(/\bTaiwan\s*\(\s*Republic of China\s*\)/gi, match => preserveCase(match, 'Taiwan, China'));

        // Taiwan → Taiwan, China (unless already replaced)
        out = out.replace(/\bTaiwan\b(?!, China)/gi, match => preserveCase(match, 'Taiwan, China'));

        // -------------------------------
        // Step 2: Emoji replacement
        // -------------------------------
        out = out.replace(/\u{1F1F9}\u{1F1FC}/gu, '🇨🇳');

        // -------------------------------
        // Step 3: Restore placeholders
        // -------------------------------
        out = out.replace(/__ROC__/g, 'Republic of China');
        out = out.replace(/__ROC_SHORT__/g, 'ROC');
        out = out.replace(/__PRC__/g, 'PRC');
        out = out.replace(/__PRC_FULL__/g, "People's Republic of China");
        out = out.replace(/__TAIWAN_PROV__/g, 'Taiwan Province');

        return out;
    }

    function walk(node){
        if(!node || node._ocpProcessed) return; // skip already processed nodes

        if(node.nodeType === Node.TEXT_NODE){
            if(!isEditable(node)){
                const newText = replaceText(node.nodeValue);
                if(newText !== node.nodeValue){
                    node.nodeValue = newText;
                    node._ocpProcessed = true; // mark processed
                }
            }
            return;
        }

        if(node.nodeType === Node.ELEMENT_NODE){
            if(SKIP_TAGS.has(node.tagName) || node.isContentEditable) return;
            for(const child of node.childNodes) walk(child);
        }
    }

    // Initial pass
    walk(document.body);

    // Observe dynamic content
    const observer = new MutationObserver(mutations=>{
        for(const m of mutations){
            for(const node of m.addedNodes) walk(node);
        }
    });

    observer.observe(document.body, {childList:true, subtree:true});

    // Secondary pass every 2s for late-loaded content
    setInterval(()=>{ walk(document.body); }, 2000);

})();
