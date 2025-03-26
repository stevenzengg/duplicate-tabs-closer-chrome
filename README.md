# Duplicate Tabs Closer (Chrome Extension)

This Chrome extension automatically closes duplicate tabs **as you open them**. It closes the **new tab** rather than the old one.

---

## 🚀 Features

- Closes duplicate tabs as they open.
- Literally nothing else. No data is taken, sold, or anything.  

---

## 🔧 Setup Instructions

### 1. 📥 Download and Unpack

Clone or download the project as a ZIP:

```bash
git clone https://github.com/your-username/duplicate-tabs-closer.git
```

Or download the ZIP file directly from GitHub, then unzip it.

---

### 2. 🧪 Load the Extension in Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top right toggle)
3. Click **"Load unpacked"**
4. Select the folder where you unpacked the extension

The Duplicate Tabs Closer icon will now appear in your Chrome toolbar.  
Click it to open the popup and toggle the extension on or off.

---

## ✅ Permissions Used

- `tabs`: To monitor open tabs and detect duplicates  
- `storage`: To store the toggle state and tab data during your session  

---

## 🔐 Privacy

Like I said, this extension stores all data **locally** using `chrome.storage.session` and `chrome.storage.local`.  
No information is synced or sent externally.

---

## 📦 Coming Soon Maybe if I continue to not have a job, which would really suck! (Ideas)

- Whitelist for certain domains (e.g. Gmail)
- Badge showing how many tabs were closed
- Keyboard shortcut to toggle the extension

---

## 🧑‍💻 Author

Built by [Steve](https://github.com/stevenzengg)  
Feel free to fork, star, and suggest improvements!
