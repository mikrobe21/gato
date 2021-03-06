<header>
  <div class="header-buttons">
    <button class="header-button btn-menu" id="main-menu-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="main-menu" aria-label="navigation menu">
      <i class="fa" aria-hidden="true"></i>
      <span class="label"></span>
    </button>
    <button class="header-button btn-search search-link search-button">
      <i class="fa fa-search" aria-hidden="true"></i>
      <span class="label">Search</span>
    </button>
  </div>
  <div class="logo-block">
    <a href="http://www.txstate.edu">
      <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txst-header-logo.svg" alt="Texas State University" />
    </a>
  </div>
  <div class="menubar">
    <div class="menu">
      <a class="logo" href="http://www.txstate.edu">
        <img src="${ctx.contextPath}/.resources/gato-template-mobilefirst/images/txst-sticky-logo.svg" alt="Texas State University" />
      </a>
      [@cms.area name="menulinks" content=gf.getOrCreateArea(homepage, 'menulinks') editable=isHomePage/]
    </div>
  </div>
  <div class="search-wrapper">
      [#import "/gato-template/templates/includes/search-modal.ftl" as search]
      [@search.searchBar false true false/]
  </div>
</header>
