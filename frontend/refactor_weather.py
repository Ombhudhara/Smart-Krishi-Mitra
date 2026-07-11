import sys
import re
import os

filepath = 'src/pages/Weather/Weather.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import './Weather.css';",
    "import Navbar from '../../components/Navbar/Navbar';\nimport Sidebar from '../../components/Sidebar/Sidebar';\nimport Footer from '../../components/Footer/Footer';\nimport Button from '../../components/Button/Button';\nimport Card from '../../components/Card/Card';\nimport Loader from '../../components/Loader/Loader';\nimport NotificationBell from '../../components/NotificationBell/NotificationBell';\nimport WeatherCard from '../../components/WeatherCard/WeatherCard';\nimport './Weather.css';"
)

# 2. State and layout
content = content.replace(
    "const [sidebarOpen, setSidebarOpen] = useState(true);\n  const [activeNav, setActiveNav] = useState('weather');",
    "const [collapsed, setCollapsed] = useState(false);"
)

# 3. WeatherCard mapping
weather_prop_code = """
  const activeWeather = WEATHER_LOCATIONS[currentKey];

  const weatherProp = {
    location: `${activeWeather.city}, ${activeWeather.state}`,
    temperature: activeWeather.temp,
    condition: activeWeather.condition,
    humidity: parseInt(activeWeather.humidity),
    wind: parseInt(activeWeather.windSpeed),
    rain: parseInt(activeWeather.hourly[0].rain),
    forecast: activeWeather.daily.slice(1, 6).map((d, i) => ({
      id: i,
      day: d.day,
      temp: parseInt(d.max),
      icon: d.icon === '☀️' ? 'sunny' : d.icon.includes('rain') || d.icon.includes('⛈️') || d.icon.includes('🌦️') || d.icon.includes('🌧️') ? 'rain' : 'cloudy' 
    }))
  };
"""
content = content.replace("  const activeWeather = WEATHER_LOCATIONS[currentKey];", weather_prop_code)

# 4. Remove NAV_ITEMS and handleNavClick
content = re.sub(r'  const NAV_ITEMS = \[.*?\];\s*const handleNavClick =.*?};\s*', '', content, flags=re.DOTALL)

# 5. Navbar, Sidebar, Footer replacements
navbar_sidebar_old = """      {/* ═══ FIXED NAVBAR ═════════════════════════════ */}
      <nav className="wt-navbar">
        <div className="wt-navbar-left">
          <button className="wt-hamburger" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle Sidebar">
            <span /><span /><span />
          </button>
          <div className="wt-navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="wt-brand-icon">🌿</div>
            <div>
              <div className="wt-brand-name">Smart Krishi Mitra</div>
              <div className="wt-brand-sub">Hyper-Local Agri Weather</div>
            </div>
          </div>
        </div>

        <div className="wt-navbar-right">
          <button className="wt-nav-icon-btn" title="Notifications" onClick={() => showToast('No notifications.', 'info')}>
            🔔<span className="wt-notif-dot" />
          </button>
          <div className="wt-avatar">
            <span>🌦️</span>
          </div>
        </div>
      </nav>

      {/* ═══ LAYOUT ═══════════════════════════════════ */}
      <div className="wt-layout">
        
        {/* Sidebar */}
        <aside className={`wt-sidebar ${sidebarOpen ? 'wt-sidebar--open' : 'wt-sidebar--closed'}`}>
          <div className="wt-sidebar-inner">
            {sidebarOpen && <div className="wt-sidebar-label">NAVIGATION</div>}
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`wt-side-item ${activeNav === item.id ? 'wt-side-item--active' : ''}`}
                onClick={() => handleNavClick(item)}
                title={!sidebarOpen ? item.label : ''}
              >
                <span className="wt-side-icon">{item.icon}</span>
                {sidebarOpen && <span className="wt-side-label">{item.label}</span>}
                {sidebarOpen && activeNav === item.id && <span className="wt-side-dot" />}
              </button>
            ))}
          </div>
        </aside>"""

navbar_sidebar_new = """      {/* ═══ FIXED NAVBAR ═════════════════════════════ */}
      <Navbar 
        user={{ name: 'OM', role: 'Farmer' }} 
        onToggleSidebar={() => setCollapsed(!collapsed)}
        notificationSlot={<NotificationBell notifications={[]} />}
      />

      {/* ═══ LAYOUT ═══════════════════════════════════ */}
      <div className="wt-layout">
        
        {/* Sidebar */}
        <Sidebar 
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          activeItem="weather"
        />"""
content = content.replace(navbar_sidebar_old, navbar_sidebar_new)

footer_old = """          {/* ═══ FOOTER ════════════════════════════════ */}
          <footer className="wt-footer">
            <div className="wt-footer-top">
              <div className="wt-footer-brand">
                <div className="wt-footer-logo">🌿 Smart Krishi Mitra</div>
                <p className="wt-footer-tagline">Providing advanced climate prediction feeds to Indian farmers.</p>
              </div>
              <div className="wt-footer-links">
                <a href="#!" className="wt-footer-link" onClick={() => showToast('Terms linked.', 'info')}>Terms of Service</a>
                <a href="#!" className="wt-footer-link" onClick={() => showToast('Privacy policy linked.', 'info')}>Privacy Policy</a>
                <a href="#!" className="wt-footer-link" onClick={() => showToast('Contact support portal.', 'info')}>Support Desk</a>
              </div>
            </div>
            <div className="wt-footer-bottom">
              <span>© 2026 Smart Krishi Mitra. All rights reserved.</span>
              <span>📡 Real-time weather audit slips · IMD Connected</span>
            </div>
          </footer>"""
content = content.replace(footer_old, "          {/* ═══ FOOTER ════════════════════════════════ */}\n          <Footer />")

# 6. Buttons
content = content.replace(
    '<button type="submit" className="wt-search-btn">Search Forecast</button>',
    '<Button type="submit" variant="primary" className="wt-search-btn">Search Forecast</Button>'
)
content = content.replace(
    '<button className="wt-location-btn" onClick={handleCurrentLocationBtn}>\n              📍 Use Current Location\n            </button>',
    '<Button variant="outline" className="wt-location-btn" onClick={handleCurrentLocationBtn}>\n              📍 Use Current Location\n            </Button>'
)
content = content.replace(
    '<button key={i} className="wt-recent-chip" onClick={() => handleRecentClick(loc)}>',
    '<button key={i} className="wt-recent-chip" onClick={() => handleRecentClick(loc)} type="button">'
)
content = content.replace(
    '<button className="wt-ai-chat-btn" onClick={() => navigate(\'/messages\')}>\n                    💬 Ask AI Assistant for Detailed Advice\n                  </button>',
    '<Button variant="primary" className="wt-ai-chat-btn" onClick={() => navigate(\'/messages\')} style={{ width: \'100%\' }}>\n                    💬 Ask AI Assistant for Detailed Advice\n                  </Button>'
)

# 7. Loader
content = content.replace(
    '<div className="wt-loading-spinner" />\n              <p>Fetching weather statistics and crop metrics...</p>',
    '<Loader variant="page" text="Fetching weather statistics and crop metrics..." />'
)

# 8. WeatherCard & additional metrics
weather_card_old = """                {/* Current Weather Card */}
                <section className="wt-card wt-current-weather-card">
                  <div className="wt-current-main">
                    <div className="wt-current-primary">
                      <span className="wt-current-icon" aria-hidden="true">{activeWeather.icon}</span>
                      <div>
                        <h2 className="wt-current-city">{activeWeather.city}</h2>
                        <p className="wt-current-state">{activeWeather.state}</p>
                        <div className="wt-current-temp">{activeWeather.temp}°C</div>
                        <div className="wt-current-desc">{activeWeather.condition}</div>
                      </div>
                    </div>

                    <div className="wt-current-metrics">
                      {[
                        { label: 'Feels Like', value: activeWeather.feelsLike, icon: '🌡️' },
                        { label: 'Humidity', value: activeWeather.humidity, icon: '💧' },
                        { label: 'Wind Speed', value: activeWeather.windSpeed, icon: '💨' },
                        { label: 'UV Index', value: activeWeather.uvIndex, icon: '☀️' },
                        { label: 'Visibility', value: activeWeather.visibility, icon: '👁️' },
                        { label: 'Air Quality', value: activeWeather.airQuality, icon: '🍃' },
                        { label: 'Sunrise', value: activeWeather.sunrise, icon: '🌅' },
                        { label: 'Sunset', value: activeWeather.sunset, icon: '🌇' }
                      ].map((m, i) => (
                        <div key={i} className="wt-metric-item">
                          <span className="wt-metric-icon">{m.icon}</span>
                          <div>
                            <div className="wt-metric-val">{m.value}</div>
                            <div className="wt-metric-lbl">{m.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>"""

weather_card_new = """                {/* Current Weather Card */}
                <WeatherCard weather={weatherProp} className="wt-weather-card-override" />
                
                <Card className="wt-extra-metrics-card">
                  <div className="wt-current-metrics">
                    {[
                      { label: 'Feels Like', value: activeWeather.feelsLike, icon: '🌡️' },
                      { label: 'UV Index', value: activeWeather.uvIndex, icon: '☀️' },
                      { label: 'Visibility', value: activeWeather.visibility, icon: '👁️' },
                      { label: 'Air Quality', value: activeWeather.airQuality, icon: '🍃' },
                      { label: 'Sunrise', value: activeWeather.sunrise, icon: '🌅' },
                      { label: 'Sunset', value: activeWeather.sunset, icon: '🌇' }
                    ].map((m, i) => (
                      <div key={i} className="wt-metric-item">
                        <span className="wt-metric-icon">{m.icon}</span>
                        <div>
                          <div className="wt-metric-val">{m.value}</div>
                          <div className="wt-metric-lbl">{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>"""
content = content.replace(weather_card_old, weather_card_new)

# 9. Change `<section className="wt-card ...">` to `<Card className="...">`
content = content.replace('<section className="wt-card ', '<Card className="')
content = content.replace('<section className="pr-card ', '<Card className="')

content = content.replace('<section className="wt-search-section">', '<div className="wt-search-section">')
content = content.replace('<section className="wt-alerts-wrapper">', '<div className="wt-alerts-wrapper">')
content = content.replace('</section>', '</Card>')

content = content.replace('</Card>\n                )}', '</div>\n                )}')
content = content.replace('</Card>\n\n          {/* Recent Searches', '</div>\n\n          {/* Recent Searches')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
