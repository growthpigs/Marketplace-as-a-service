# TurkEats Design Assets - Upload Instructions

## Quick Links (After Upload)

| Asset | Google Drive Location |
|-------|----------------------|
| **User Stories Sheet** | `TurkEats/Design/TurkEats-User-Stories-Bilingual.csv` → Import to Sheets |
| **Wireframes Folder** | `TurkEats/Design/Wireframes/` |
| **Slides Presentation** | Create from wireframes |

---

## Step 1: Create Google Drive Folder Structure

```
TurkEats/
├── Design/
│   ├── Wireframes/
│   │   ├── 01-Core/           (01-10)
│   │   ├── 02-States/         (11-16)
│   │   ├── 03-Customer/       (17-23)
│   │   └── 04-Vendor-Extended/ (24-30)
│   └── User-Stories/
└── Docs/
```

---

## Step 2: Upload User Stories to Google Sheets

1. Go to [sheets.new](https://sheets.new)
2. File → Import → Upload
3. Select: `docs/02-specs/TurkEats-User-Stories-Bilingual.csv`
4. Import settings:
   - Separator type: Comma
   - Convert text to numbers: Yes
5. Rename sheet: "TurkEats User Stories (EN/FR)"

**Columns:**
| Column | Content |
|--------|---------|
| A | Story ID |
| B | Epic |
| C | User Role |
| D | User Story (EN) |
| E | User Story (FR) |
| F | Acceptance Criteria (EN) |
| G | Acceptance Criteria (FR) |
| H | Priority |
| I | Sprint |
| J | Wireframe Ref |
| K | Status |

---

## Step 3: Upload Wireframes to Google Drive

**Local path:** `~/_PAI/projects/marketplace-as-a-service/design/wireframes/`

### Batch Upload via Finder:
1. Open Finder → Go → Go to Folder: `~/_PAI/projects/marketplace-as-a-service/design/wireframes/`
2. Select all PNG files (Cmd+A)
3. Drag to Google Drive folder in browser

### Files to upload:

**Core Vendor (10 screens):**
- 01-dashboard.png
- 02-orders-queue.png
- 03-order-detail.png
- 04-menu-management.png
- 05-analytics.png
- 06-settings.png
- 07-add-menu-item.png
- 08-notifications.png
- 09-onboarding-welcome.png
- 10-order-accepted.png

**States (6 screens):** `states/` folder
- 11-empty-orders.png
- 12-empty-menu.png
- 13-no-internet.png
- 14-loading-state.png
- 15-order-error.png
- 16-session-expired.png

**Customer App (7 screens):** `customer/` folder
- 17-customer-home.png
- 18-restaurant-menu.png
- 19-item-detail.png
- 20-cart.png
- 21-checkout.png
- 22-order-tracking.png
- 23-order-complete.png

**Vendor Extended (7 screens):** `vendor-extended/` folder
- 24-reviews.png
- 25-promotions.png
- 26-store-hours.png
- 27-payout-history.png
- 28-team-management.png
- 29-support-chat.png
- 30-quick-actions.png

---

## Step 4: Create Google Slides Presentation

1. Go to [slides.new](https://slides.new)
2. Rename: "TurkEats Wireframes"
3. For each wireframe:
   - Insert → Image → Upload from computer
   - Add title text: "XX - Screen Name"
   - Add description from user story

**Recommended slide structure:**
- Slide 1: Title slide "TurkEats - Wireframes"
- Slides 2-11: Core Vendor screens
- Slides 12-17: Empty & Error states
- Slides 18-24: Customer App
- Slides 25-31: Vendor Extended

---

## Automation Alternative

If you have Google Apps Script access, you can use this script to auto-create slides:

```javascript
// Run this in Google Apps Script after uploading images to Drive
function createWireframeSlides() {
  const folder = DriveApp.getFoldersByName('Wireframes').next();
  const presentation = SlidesApp.create('TurkEats Wireframes');

  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType().includes('image')) {
      const slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
      slide.insertImage(file.getBlob());
    }
  }
}
```

---

## Summary

| Item | Count | Local Path |
|------|-------|------------|
| Wireframes | 30 | `design/wireframes/` |
| User Stories | 30 | `docs/02-specs/TurkEats-User-Stories-Bilingual.csv` |
| Generator Scripts | 5 | `design/wireframes/*.sh` |

**Total Design Assets:** 30 wireframes + 30 bilingual user stories

---

*Generated 2026-01-19 by Chi CTO*
