/* ===== RESPONSIVE GLOBAL ===== */

* {
  box-sizing: border-box;
}

/* Cursor custom - ascuns pe mobile */
@media (max-width: 768px) {
  body {
    cursor: auto !important;
  }
}

/* Container maxim pentru monitoare mari */
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Dashboard layout responsive */
@media (max-width: 1024px) {
  .dashboard-sidebar {
    width: 180px !important;
  }
  .dashboard-main {
    margin-left: 180px !important;
  }
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    display: none !important;
  }
  .dashboard-main {
    margin-left: 0 !important;
  }
}

/* Grid-uri responsive */
@media (max-width: 1024px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
  .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
}

@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr !important; }
}

/* Two column layouts */
@media (max-width: 768px) {
  .two-col { grid-template-columns: 1fr !important; }
}

/* Padding responsive */
@media (max-width: 768px) {
  .page-padding { padding: 16px !important; }
  .section-padding { padding: 16px 16px !important; }
}

/* Fonturi responsive */
@media (max-width: 768px) {
  h1 { font-size: clamp(1.8rem, 6vw, 3rem) !important; }
  h2 { font-size: clamp(1.3rem, 4vw, 2rem) !important; }
}

/* Bottom navigation pentru mobile */
.bottom-nav-mobile {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #111;
  border-top: 1px solid #262626;
  z-index: 100;
  justify-content: space-around;
  align-items: center;
}

@media (max-width: 768px) {
  .bottom-nav-mobile {
    display: flex;
  }
  body {
    padding-bottom: 60px;
  }
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  color: #777;
  padding: 8px 12px;
  cursor: pointer;
}

.bottom-nav-item.active {
  color: #c9a96e;
}

.bottom-nav-icon {
  font-size: 20px;
}