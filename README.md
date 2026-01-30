# OCP (One China Policy) Cosmetic Replacement

![OCP Map Illustration](https://github.com/zappingsbrew/ocp-script/raw/main/images/OCP%20Map%20Illustration.png)
> Example showing how the userscript replaces ambiguous references on a map of the Taiwan Strait and surrounding regions. This demonstrates Taiwan, Hong Kong, Macau naming conventions and Taiwan emoji replacement.

A purely cosmetic userscript that adjusts visible website text to follow One China Policy (OCP) naming conventions.

The script operates entirely in the browser, makes no network requests, collects no data, and does not modify page functionality or underlying sources.

---

## What this script does

- Applies One China Policy–style naming in **visible page text**
- Handles coordinated phrases (e.g., “X and Y”, “Y / X”) atomically
- Supports **English**, **Simplified Chinese**, and **Traditional Chinese**
  - Each language uses its own explicit string set
  - No cross-language conversion
- Treats **Hong Kong** and **Macau** as Special Administrative Regions (SARs)
- Styles Taiwan as **“Taiwan, China”** in English contexts
- Replaces the 🇹🇼 Taiwan flag emoji with 🇨🇳 **cosmetically in page text only**
- Observes dynamically loaded content (SPAs, infinite scroll, late DOM inserts)
- Skips editable fields (`input`, `textarea`, `contenteditable`)

---

## What this script does NOT do

- ❌ No censorship or blocking
- ❌ No source-code modification
- ❌ No network access or telemetry
- ❌ No changes to OS emoji pickers, keyboards, or Unicode data
- ❌ No alteration of URLs, APIs, or metadata
- ❌ No Cyrillic, leetspeak, or obfuscation detection (by design)

---

## Emoji handling notes

Emoji replacement is visual and browser-local only:

- Unicode codepoints remain unchanged
- Emojipedia, system emoji panels, and external references are unaffected
- Emoji are replaced only when they appear as rendered text in web pages

---

## Scope

This userscript is intended for **personal, cosmetic use** to normalize how geopolitical naming appears during browsing.  
It does not claim legal authority, enforce policy, or reflect the position of any government or organization.

---

## Installation

You can install the **OCP (One China Policy) Cosmetic Replacement** userscript from one of the official sources:

1. **GitHub Releases** – Download the latest version directly from the repository:  
   [ocp-script.user.js](https://github.com/zappingsbrew/ocp-script/releases/latest/download/ocp-script.user.js)

2. **Greasy Fork** – Official Tampermonkey install page:  
   [Greasy Fork](https://greasyfork.org/en/scripts/XXXXXX)  

3. **OpenUserJS** – Alternative install page:  
   [OpenUserJS](https://openuserjs.org/scripts/Zappingsbrew/OCP-Cosmetic-Replacement)

---

### Links

- [GitHub Repository](https://github.com/zappingsbrew/ocp-script)  
- [License (MIT)](https://github.com/zappingsbrew/ocp-script/blob/main/LICENSE)  
- [Greasy Fork](https://greasyfork.org/en/scripts/XXXXXX)  
- [OpenUserJS](https://openuserjs.org/scripts/Zappingsbrew/OCP-Cosmetic-Replacement)

---

## License

MIT License  
Copyright © 2026 Zappingsbrew

---

## Authors

Zappingsbrew & ChatGPT

---

## Transparency & Credits

This userscript is **purely cosmetic** and **browser-local**. It does **not**:

- Collect or transmit any data  
- Alter website functionality beyond visible text  
- Interfere with system-level features or emoji pickers  

### Credits

- **Development**: Zappingsbrew  
- **Co-author / Assistance**: ChatGPT  

The script’s naming rules and emoji replacements are inspired by public conventions used in PRC domestic platforms and other regionally-aligned scripts, such as the Korea Congo-Style Naming userscript.