"use client";

export function NavMobile() {
  function marcando(classe: string) {
    const elements = document.querySelectorAll(`.${classe}`);
    elements.forEach((item) => {
      item.classList.remove(classe);
    });
  }

  function byId(id: string) {
    return document.getElementById(id);
  }

  function hiddenMenu(event?: any) {
    const screen = byId("navbar-mobile");
    if (screen) {
      screen.style.marginLeft = "-100%";
    }

    if (event) {
      marcando("item-select");
    }
  }

  return (
    <div id="navbar-mobile" className="menu-mobile">
      <div className="btn-close" onClick={() => hiddenMenu()}>
        <i className="fas fa-window-close"></i>
      </div>

      <nav className="nav-desk-m">
        <a onClick={hiddenMenu} href="#home" className="item-nav-desk-m">
          Home
        </a>
        <a onClick={hiddenMenu} href="#sobre" className="item-nav-desk-m">
          Sobre
        </a>
        <a onClick={hiddenMenu} href="#servicos" className="item-nav-desk-m">
          Serviços
        </a>
        <a
          onClick={hiddenMenu}
          href="#onde-estamos"
          className="item-nav-desk-m"
        >
          Onde estamos
        </a>
        <a onClick={hiddenMenu} href="#agendamento" className="item-nav-desk-m">
          Agendamento
        </a>
        <a onClick={hiddenMenu} href="#contato" className="item-nav-desk-m">
          Contato
        </a>
      </nav>
    </div>
  );
}
