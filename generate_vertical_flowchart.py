from PIL import Image, ImageDraw, ImageFont
import os

def create_vertical_app_flowchart():
    # Dimensions for a vertical flowchart image (750 x 1400 px)
    width = 750
    height = 1450
    img = Image.new("RGB", (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)

    # Fonts
    font_title_path = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_body_path  = "C:\\Windows\\Fonts\\segoeui.ttf"

    font_step = ImageFont.truetype(font_title_path, 20) if os.path.exists(font_title_path) else ImageFont.load_default()
    font_heading = ImageFont.truetype(font_title_path, 26) if os.path.exists(font_title_path) else ImageFont.load_default()
    font_desc = ImageFont.truetype(font_body_path, 21) if os.path.exists(font_body_path) else ImageFont.load_default()

    # Steps for App User Workflow
    steps = [
        ("1. AUTHENTICATION", "User & Role-Based Login", "Municipal Officer / Contractor / Transit Admin", (11, 37, 69), (0, 150, 214)),
        ("2. GIS DASHBOARD", "Live City Map & Telemetry", "Real-time bus tracking, Road Health Index (RHI) heatmaps", (19, 64, 116), (56, 189, 248)),
        ("3. INCIDENT REVIEW", "Verified Hazard Inspection", "View multi-bus fused defect crops, severity & GPS coordinates", (11, 37, 69), (52, 211, 153)),
        ("4. WORK-ORDER DISPATCH", "Automated Task Allocation", "Auto-ranks repair priority based on traffic density & damage", (0, 122, 90), (52, 211, 153)),
        ("5. REPAIR & CLOSURE", "SLA & Post-Repair Audit", "Subsequent bus passes re-scan repair quality for verified closure", (190, 60, 20), (249, 115, 22))
    ]

    card_w = 650
    card_h = 190
    left_x = 50
    top_start = 45
    spacing = 85

    for i, (tag, title, desc, head_bg, border_col) in enumerate(steps):
        y0 = top_start + i * (card_h + spacing)
        x0 = left_x
        x1 = x0 + card_w
        y1 = y0 + card_h

        # Draw card container
        draw.rounded_rectangle([x0, y0, x1, y1], radius=20, fill=(246, 249, 253), outline=border_col, width=3)

        # Header bar
        head_h = 75
        draw.rounded_rectangle([x0, y0, x1, y0 + head_h], radius=20, fill=head_bg)
        draw.rectangle([x0, y0 + head_h - 15, x1, y0 + head_h], fill=head_bg)

        # Header text
        draw.text((x0 + 22, y0 + 12), tag, font=font_step, fill=(56, 189, 248) if head_bg == (11, 37, 69) else (255, 255, 255))
        draw.text((x0 + 22, y0 + 38), title, font=font_heading, fill=(255, 255, 255))

        # Body description text (word wrap friendly)
        draw.text((x0 + 22, y0 + head_h + 20), "• " + desc, font=font_desc, fill=(30, 35, 45))

        # Connecting Downward Arrow
        if i < len(steps) - 1:
            ax = x0 + (card_w // 2)
            ay0 = y1 + 12
            ay1 = ay0 + 50
            # Arrow stem
            draw.line([ax, ay0, ax, ay1], fill=(0, 150, 214), width=6)
            # Arrow head
            draw.polygon([
                (ax, ay1 + 15),
                (ax - 14, ay1 - 5),
                (ax + 14, ay1 - 5)
            ], fill=(0, 150, 214))

    out_file = "c:\\Projects\\Projects\\SIH\\cityfleet_app_flowchart_vertical.png"
    img.save(out_file, "PNG", dpi=(300, 300))
    print(f"Vertical flowchart generated successfully: {out_file}")

if __name__ == "__main__":
    create_vertical_app_flowchart()
