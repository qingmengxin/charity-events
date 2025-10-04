function renderNav(containerId = 'nav-area') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="header">
      <div class="container">
        <h1>CityCharity Events</h1>
        <p class="small">Connecting the community with meaningful causes.</p>
        <div class="nav">
          <a href="/index.html">Home</a>
          <a href="/search.html">Search Events</a>
          <a href="/event.html">Event Details</a>
          <a href="/index.html#contact">Contact</a>
        </div>
      </div>
    </div>
  `;
}
