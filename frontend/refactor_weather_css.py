import re

filepath = 'src/pages/Weather/Weather.css'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove .wt-toast and related
content = re.sub(r'/\* ═══════════════════════════════════════════════════════════════════════════\s*TOAST\s*═══════════════════════════════════════════════════════════════════════════ \*/.*?@keyframes wtSlideIn \{.*?\n\}\n', '', content, flags=re.DOTALL)

# Remove NAVBAR
content = re.sub(r'/\* ═══════════════════════════════════════════════════════════════════════════\s*NAVBAR\s*═══════════════════════════════════════════════════════════════════════════ \*/.*?(?=/\* ═══════════════════════════════════════════════════════════════════════════\s*LAYOUT & SIDEBAR)', '', content, flags=re.DOTALL)

# Remove LAYOUT & SIDEBAR
content = re.sub(r'/\* ═══════════════════════════════════════════════════════════════════════════\s*LAYOUT & SIDEBAR\s*═══════════════════════════════════════════════════════════════════════════ \*/.*?(?=/\* ═══════════════════════════════════════════════════════════════════════════\s*MAIN CONTAINER)', '', content, flags=re.DOTALL)

# Remove .wt-card and .wt-card:hover because Card component handles this
content = re.sub(r'\.wt-card \{.*?\n\}\n\.wt-card:hover \{.*?\n\}\n', '', content, flags=re.DOTALL)

# Remove .wt-current-weather-card, .wt-current-main, .wt-current-primary, .wt-current-icon, .wt-current-city, .wt-current-state, .wt-current-temp, .wt-current-desc
content = re.sub(r'/\* ─── Current Weather Card ─── \*/\n\.wt-current-weather-card \{.*?\n\}\n\.wt-current-main \{.*?\n\}\n\.wt-current-primary \{.*?\n\}\n\.wt-current-icon \{.*?\n\}\n\.wt-current-city \{.*?\n\}\n\.wt-current-state \{.*?\n\}\n\.wt-current-temp\s*\{.*?\n\}\n\.wt-current-desc\s*\{.*?\n\}\n', '/* ─── Current Weather Card ─── */\n', content, flags=re.DOTALL)

# Remove .wt-ai-chat-btn
content = re.sub(r'\.wt-ai-chat-btn \{.*?\n\}\n\.wt-ai-chat-btn:hover \{.*?\n\}\n', '', content, flags=re.DOTALL)

# Remove Loading State
content = re.sub(r'/\* ─── Loading State ─── \*/\n\.wt-loading-wrap \{.*?\n\}\n\.wt-loading-spinner \{.*?\n\}\n@keyframes wtSpin \{.*?\n\}\n', '/* ─── Loading State ─── */\n.wt-loading-wrap { display: flex; justify-content: center; align-items: center; min-height: 400px; }\n', content, flags=re.DOTALL)

# Remove FOOTER
content = re.sub(r'/\* ═══════════════════════════════════════════════════════════════════════════\s*FOOTER\s*═══════════════════════════════════════════════════════════════════════════ \*/.*?(?=/\* ═══════════════════════════════════════════════════════════════════════════\s*RESPONSIVE)', '', content, flags=re.DOTALL)

# Fix media queries
content = re.sub(r'@media \(max-width: 900px\) \{.*?(?=@media \(max-width: 768px\))', '@media (max-width: 900px) {\n  .wt-main    { margin-left: 0 !important; padding: 20px 16px 20px; }\n  .wt-header-content { flex-direction: column; }\n  .wt-header-illustration { display: none; }\n  .wt-page-header { padding: 28px 24px; }\n}\n\n', content, flags=re.DOTALL)
content = re.sub(r'@media \(max-width: 640px\) \{.*?\}', '@media (max-width: 640px) {\n  .wt-news-grid      { grid-template-columns: 1fr; }\n}', content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
