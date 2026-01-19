#!/bin/bash
# TurkEats Additional Wireframes Generator
# Run after core wireframes are complete
#
# Usage:
#   cd ~/projects/marketplace-as-a-service/design/wireframes
#   ./generate-additional-wireframes.sh

SCRIPT_PATH="$HOME/_PAI/.claude/skills/NanoBananaPro/tools/generate-single.py"
OUTPUT_DIR="$(dirname "$0")"

echo "🎨 TurkEats Additional Wireframes"
echo "=================================="
echo ""

# 5. Analytics Dashboard
echo "📈 Generating Analytics wireframe..."
python3 "$SCRIPT_PATH" --pro --template mobile \
"TurkEats Analytics Dashboard - Performance metrics screen with:
- Header: Back arrow, 'Analytics' title, Export button
- Time range selector tabs: Today | This Week | This Month | Custom
- This Week tab active with underline
- Revenue Chart section:
  - Line graph showing daily revenue for 7 days
  - Y-axis: \$0 to \$1,500
  - Current week total: \$5,847.50 (+18% vs last week)
- Orders Chart section:
  - Bar chart showing orders per day
  - Peak day highlighted
  - Total orders: 187
- Top Selling Items list:
  1. Adana Kebab - 45 orders - \$810
  2. Doner Wrap - 38 orders - \$570
  3. Chicken Shish - 32 orders - \$512
  4. Lahmacun - 28 orders - \$420
- Performance metrics row:
  - Avg prep time: 14 min
  - Order accuracy: 98.5%
  - Customer satisfaction: 4.8/5
- Bottom tab bar: Home, Orders, Menu, Analytics (active), Settings" \
"$OUTPUT_DIR/05-analytics.png"

# 6. Settings Screen
echo "⚙️ Generating Settings wireframe..."
python3 "$SCRIPT_PATH" --pro --template mobile \
"TurkEats Settings - Configuration screen with:
- Header: Back arrow, 'Settings' title
- Profile section at top:
  - Restaurant logo placeholder (circle)
  - 'Turkish Delights Kitchen'
  - 'Open' status badge (green)
  - Edit Profile button
- Settings groups with chevron arrows:
  Group 1 - Store Settings:
  - Store Hours (tap to edit)
  - Delivery Zones
  - Minimum Order Amount (\$15.00)
  - Prep Time Buffer (5 min)
  Group 2 - Notifications:
  - New Order Alerts (toggle ON)
  - Order Ready Reminders (toggle ON)
  - Daily Summary Email (toggle OFF)
  - Sound Alerts (toggle ON)
  Group 3 - Payment:
  - Payout Account (Bank ****4521)
  - Payout Schedule (Weekly)
  - Tax Settings
  Group 4 - Support:
  - Help Center
  - Contact Support
  - Terms of Service
  - Privacy Policy
- App version at bottom: v1.2.3
- Bottom tab bar: Home, Orders, Menu, Analytics, Settings (active)" \
"$OUTPUT_DIR/06-settings.png"

# 7. Add/Edit Menu Item
echo "➕ Generating Add Menu Item wireframe..."
python3 "$SCRIPT_PATH" --pro --template mobile \
"TurkEats Add Menu Item - Item editor form with:
- Header: X close button, 'Add Item' title, Save button
- Image upload section:
  - Large dashed rectangle placeholder
  - Camera icon in center
  - 'Tap to add photo' text
- Form fields:
  - Item Name (text input, required *)
  - Description (multiline textarea)
  - Category (dropdown: Kebabs selected)
  - Price (number input with \$ prefix)
  - Prep Time (number input with 'minutes' suffix)
- Options section:
  - 'Add modifier groups' with + button
  - Example: Size (Small, Medium, Large)
  - Example: Spice Level (Mild, Medium, Hot)
- Availability section:
  - Available toggle (ON)
  - 'Show on menu' toggle (ON)
  - 'Mark as featured' toggle (OFF)
- Delete Item button (red text, at bottom) - only for edit mode
- Keyboard visible at bottom for text input" \
"$OUTPUT_DIR/07-add-menu-item.png"

# 8. Notifications / Inbox
echo "🔔 Generating Notifications wireframe..."
python3 "$SCRIPT_PATH" --pro --template mobile \
"TurkEats Notifications - Inbox screen with:
- Header: Back arrow, 'Notifications' title, Mark All Read button
- Filter tabs: All | Orders | System | Promotions
- All tab active
- Notification cards list (scrollable):
  Card 1 (unread, blue dot):
  - Bell icon
  - 'New Order Received'
  - 'Order #1248 from Emma Wilson - \$42.00'
  - '2 min ago'
  Card 2 (unread, blue dot):
  - Star icon
  - 'New Review'
  - 'John D. left a 5-star review!'
  - '15 min ago'
  Card 3 (read):
  - Check icon
  - 'Order Completed'
  - 'Order #1245 delivered successfully'
  - '1 hour ago'
  Card 4 (read):
  - Chart icon
  - 'Weekly Summary Ready'
  - 'Your analytics report for last week is ready'
  - 'Yesterday'
  Card 5 (read):
  - Gift icon
  - 'Promotion Ending Soon'
  - 'Your 10% off promo ends in 2 days'
  - '2 days ago'
- Empty state at bottom if scrolled: 'You're all caught up!'" \
"$OUTPUT_DIR/08-notifications.png"

# 9. Onboarding - Welcome
echo "👋 Generating Onboarding Welcome wireframe..."
python3 "$SCRIPT_PATH" --pro --template mobile \
"TurkEats Onboarding Welcome - First launch screen with:
- Large illustration at top (chef with food/restaurant graphic)
- Welcome headline: 'Welcome to TurkEats Vendor'
- Subtext: 'Manage your restaurant orders, menu, and analytics all in one place'
- Feature highlights with icons:
  1. Clock icon - 'Real-time order management'
  2. Menu icon - 'Easy menu updates'
  3. Chart icon - 'Detailed analytics'
  4. Bell icon - 'Instant notifications'
- Primary CTA button: 'Get Started' (large, full width)
- Secondary link: 'Already have an account? Sign In'
- Page indicator dots at bottom (1 of 3 filled)" \
"$OUTPUT_DIR/09-onboarding-welcome.png"

# 10. Order Accepted Confirmation
echo "✅ Generating Order Accepted wireframe..."
python3 "$SCRIPT_PATH" --pro --template mobile \
"TurkEats Order Accepted - Confirmation modal/screen with:
- Large green checkmark icon in circle at top
- Success headline: 'Order Accepted!'
- Order summary card:
  - Order #1248
  - Emma Wilson
  - 3 items - \$42.00
  - Estimated prep time: 15-20 min
- Timer display:
  - Large countdown: '18:00'
  - 'Time remaining' label
  - Circular progress indicator around timer
- Quick actions:
  - 'Mark as Ready' button (primary)
  - 'View Order Details' button (secondary)
  - 'Print Receipt' link
- Tip at bottom:
  - Lightbulb icon
  - 'Tip: Accurate prep times improve your ratings!'
- Auto-dismiss text: 'Returning to orders in 5s...'" \
"$OUTPUT_DIR/10-order-accepted.png"

echo ""
echo "✅ All additional wireframes generated!"
echo ""
echo "Files created:"
ls -la "$OUTPUT_DIR"/*.png 2>/dev/null | tail -6
