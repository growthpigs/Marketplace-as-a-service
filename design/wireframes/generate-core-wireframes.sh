#!/bin/bash
# TurkEats Core Wireframes Generator
# Run this script from your local machine to generate all wireframes
#
# Prerequisites:
#   pip install google-genai pillow
#
# Usage:
#   cd ~/projects/marketplace-as-a-service/design/wireframes
#   chmod +x generate-core-wireframes.sh
#   ./generate-core-wireframes.sh

SCRIPT_PATH="$HOME/_PAI/.claude/skills/NanoBananaPro/tools/generate-single.py"
OUTPUT_DIR="$(dirname "$0")"

echo "🎨 TurkEats Wireframe Generator"
echo "================================"
echo "Output directory: $OUTPUT_DIR"
echo ""

# 1. Dashboard
echo "📊 Generating Dashboard wireframe..."
python3 "$SCRIPT_PATH" --pro --resolution 2K --template mobile \
"TurkEats Vendor Dashboard - Home screen with:
- Header: TurkEats logo, notification bell with badge (3), profile avatar
- KPI Cards row (4 cards):
  1. Today's Orders: 24 (↑12% vs yesterday)
  2. Revenue: \$847.50 (↑8%)
  3. Avg Order Time: 18 min (↓2 min)
  4. Rating: 4.8 stars (from 156 reviews)
- Active Orders section with 3 order cards showing:
  - Order #1247 - John D. - 2 items - \$32.50 - PREPARING status badge (yellow)
  - Order #1246 - Sarah M. - 1 item - \$18.00 - READY status badge (green)
  - Order #1245 - Mike R. - 3 items - \$45.00 - OUT FOR DELIVERY badge (blue)
- Quick Actions: View All Orders button, Mark All Ready button
- Bottom tab bar: Home (active), Orders, Menu, Analytics, Settings" \
"$OUTPUT_DIR/01-dashboard.png"

# 2. Orders Queue
echo "📋 Generating Orders Queue wireframe..."
python3 "$SCRIPT_PATH" --pro --resolution 2K --template mobile \
"TurkEats Orders Queue - Order management screen with:
- Header: Back arrow, 'Orders' title, filter icon, search icon
- Status tabs row: All (24) | New (5) | Preparing (8) | Ready (6) | Delivered (5)
- New tab active with orange indicator
- Order cards list (scrollable):
  Card 1:
    - Order #1248 - NEW badge (red)
    - Customer: Emma Wilson
    - Items: 1x Adana Kebab, 2x Baklava, 1x Ayran
    - Total: \$42.00
    - Time: 2 min ago
    - Accept / Reject buttons
  Card 2:
    - Order #1247 - PREPARING badge (yellow)
    - Customer: John Davis
    - Items: 2x Doner Wrap, 1x Turkish Coffee
    - Total: \$28.50
    - Time: 8 min ago
    - Mark Ready button
  Card 3:
    - Order #1246 - READY badge (green)
    - Customer: Sarah Martinez
    - Items: 1x Lahmacun
    - Total: \$15.00
    - Time: 12 min ago
    - Awaiting pickup label
- Bottom tab bar: Home, Orders (active), Menu, Analytics, Settings" \
"$OUTPUT_DIR/02-orders-queue.png"

# 3. Order Detail
echo "📝 Generating Order Detail wireframe..."
python3 "$SCRIPT_PATH" --pro --resolution 2K --template mobile \
"TurkEats Order Detail - Single order view with:
- Header: Back arrow, 'Order #1248', status badge PREPARING (yellow)
- Customer Info Card:
  - Avatar placeholder
  - Emma Wilson
  - Phone: (555) 123-4567 with call icon
  - Delivery address: 123 Main St, Apt 4B
  - Special instructions: 'Extra spicy please, no onions'
- Order Items section:
  - 1x Adana Kebab - \$18.00
  - 2x Baklava - \$12.00
  - 1x Ayran - \$4.00
  - Subtotal: \$34.00
  - Tax: \$3.06
  - Delivery Fee: \$4.94
  - Total: \$42.00
- Timeline:
  - Order placed: 2:34 PM ✓
  - Accepted: 2:36 PM ✓
  - Preparing: 2:38 PM (current)
  - Ready for pickup: --
  - Delivered: --
- Action buttons at bottom:
  - Mark Ready (primary, large)
  - Contact Customer (secondary)
  - Report Issue (text link)" \
"$OUTPUT_DIR/03-order-detail.png"

# 4. Menu Management
echo "🍽️ Generating Menu Management wireframe..."
python3 "$SCRIPT_PATH" --pro --resolution 2K --template mobile \
"TurkEats Menu Management - Menu editor screen with:
- Header: Back arrow, 'Menu', Add Item button (+)
- Search bar with placeholder 'Search menu items...'
- Category tabs: All | Kebabs | Wraps | Sides | Drinks | Desserts
- Kebabs tab active
- Menu items list:
  Item 1:
    - Food photo placeholder (square)
    - Adana Kebab
    - \$18.00
    - 'Spicy ground lamb kebab with...'
    - Available toggle (ON, green)
    - Edit icon
  Item 2:
    - Food photo placeholder
    - Chicken Shish
    - \$16.00
    - 'Marinated chicken skewers...'
    - Available toggle (ON, green)
    - Edit icon
  Item 3:
    - Food photo placeholder
    - Iskender Kebab
    - \$22.00
    - 'Sliced doner over pita...'
    - Available toggle (OFF, gray) - SOLD OUT badge
    - Edit icon
- Floating action button: + Add Item
- Bottom tab bar: Home, Orders, Menu (active), Analytics, Settings" \
"$OUTPUT_DIR/04-menu-management.png"

echo ""
echo "✅ All wireframes generated!"
echo ""
echo "Files created:"
ls -la "$OUTPUT_DIR"/*.png 2>/dev/null || echo "  (no PNG files found - check for errors above)"
