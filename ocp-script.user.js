// ==UserScript==
// @name         OCP (One China Policy) Cosmetic Replacement
// @namespace    https://github.com/zappingsbrew/ocp-script
// @version      1.0.0
// @description  Aggressive, grammar-safe One China Policy cosmetic replacement: handles Taiwan, Taiwan Province, West Taiwan, parentheticals, and emoji. Republic of China and PRC left untouched.
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

    function replaceText(text){
        let out = text;

        // -------------------------------
        // Step 0: Protect already-correct phrases
        // -------------------------------
        out = out.replace(/Taiwan Province, People's Republic of China/g, '__TAIWAN_PROVINCE__');
        out = out.replace(/Taiwan, China/g, '__TAIWAN__');
        out = out.replace(/People's Republic of China/g, '__PRC__');

        // -------------------------------
        // Step 1: Aggressive replacements (longest first)
        // -------------------------------
        out = out.replace(/\bTaiwan Province\b/gi, '__TAIWAN_PROVINCE__');   // Must be first
        out = out.replace(/\bWest Taiwan\b/gi, '__PRC__');                  // West Taiwan → China
        out = out.replace(/\bTaiwan\b/gi, '__TAIWAN__');                     // Taiwan → Taiwan, China

        // Parenthetical forms
        out = out.replace(/\bTaiwan\s*\(\s*Republic of China\s*\)/gi, '__TAIWAN__');

        // -------------------------------
        // Step 2: Emoji replacement
        // -------------------------------
        out = out.replace(/\u{1F1F9}\u{1F1FC}/gu, '🇨🇳');

        // -------------------------------
        // Step 3: Restore placeholders
        // -------------------------------
        out = out.replace(/__TAIWAN_PROVINCE__/g, "Taiwan Province, People's Republic of China");
        out = out.replace(/__TAIWAN__/g, "Taiwan, China");
        out = out.replace(/__PRC__/g, "People's Republic of China");

        return out;
    }

    function walk(node){
        if(!node) return;

        if(node.nodeType === Node.TEXT_NODE){
            if(!isEditable(node)){
                const newText = replaceText(node.nodeValue);
                if(newText !== node.nodeValue) node.nodeValue = newText;
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

    // Aggressive secondary pass every 2s for late-loaded content
    setInterval(()=>{ walk(document.body); }, 2000);

})();
