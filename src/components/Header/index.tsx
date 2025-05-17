"use client";

import Image from "next/image";
import Logo from "../../assets/logo.png";

export function Header() {
  function marcando(classe: string) {
    const elements = document.querySelectorAll(`.${classe}`);
    elements.forEach((item) => {
      item.classList.remove(classe);
    });
  }

  function selectItemMenu(event: any) {
    marcando("item-select");
  }

  function showMenu() {
    const screen = byId("navbar-mobile");
    if (screen) {
      screen.style.marginLeft = "0px";
    }
  }

  function byId(id: string) {
    return document.getElementById(id);
  }

  return (
    <header id="header">
      <div className="content-header">
        <div className="logo">
          <Image
            src={Logo}
            width={150}
            height={200}
            alt="Logotipo"
            style={{ borderRadius: 12 }}
          />
        </div>

        <nav className="nav-desk">
          <a
            onClick={selectItemMenu}
            href="#home"
            className="item-nav-desk item-select"
          >
            Home
          </a>
          <a onClick={selectItemMenu} href="#sobre" className="item-nav-desk">
            Sobre
          </a>
          <a
            onClick={selectItemMenu}
            href="#servicos"
            className="item-nav-desk"
          >
            Serviços
          </a>
          <a
            onClick={selectItemMenu}
            href="#onde-estamos"
            className="item-nav-desk"
          >
            Onde estamos
          </a>
          <a
            onClick={selectItemMenu}
            href="#agendamento"
            className="item-nav-desk"
          >
            Agendamento
          </a>
          <a onClick={selectItemMenu} href="#contato" className="item-nav-desk">
            Contato
          </a>
        </nav>

        <a onClick={showMenu} className="btn-menu">
          <i className="fas fa-bars"></i>
        </a>
      </div>
    </header>
  );
}
