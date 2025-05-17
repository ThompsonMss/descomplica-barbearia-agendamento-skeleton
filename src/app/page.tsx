import { Header } from "../components/Header";
import { NavMobile } from "../components/NavMobile";
import { Appointment } from "../components/Appointment";

import Image from "next/image";

import ImgSobre from "../assets/sobre.jpeg";
import Logo from "../assets/logo.png";
import ImgScissors from "../assets/scissors.png";
import ImgNavalha from "../assets/navalha.png";
import ImgSobrancelhas from "../assets/sobrancelhas.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <>
      <Header />
      <NavMobile />

      <div className="intro">
        <div className="content-intro">
          <h1>Ser comum não é uma opção</h1>
          <p>
            Oferecemos sempre a melhor qualidade e estamos prontos para atender
            às suas mais altas expectativas. Você procura qualidade? Você achou!
          </p>

          <div className="line"></div>
          <a href="#agendamento" className="cta-intro">
            Agendar Horário
          </a>
        </div>
      </div>

      <section id="sobre">
        <div className="content">
          <div className="container-sobre">
            <div className="content-sobre">
              <h1>Barbearia do Márcio desde 2010</h1>
              <p>
                Nossa barbearia é o território criado exclusivamente para homens
                que apreciam qualidade premium, tempo e aparência impecável.
                Estamos aqui para proporcionar a melhor experiência possível
                para você.
              </p>
            </div>

            <div className="img-sobre">
              <Image src={ImgSobre} alt="Rapaz cortando o cabelo" />
            </div>
          </div>
        </div>
      </section>

      <section id="servicos">
        <div className="content">
          <div className="title-servico">
            <h1>Nossos Serviços</h1>
          </div>

          <div className="container-servicos">
            <div className="card-servico">
              <Image
                width={80}
                height={80}
                src={ImgScissors}
                alt="Corte de cabelo"
              />
              <h3 className="title-card-servico">Corte de cabelo</h3>
            </div>

            <div className="card-servico">
              <Image width={80} height={80} src={ImgNavalha} alt="Barba" />
              <h3 className="title-card-servico">Barba</h3>
            </div>

            <div className="card-servico">
              <Image
                width={80}
                height={80}
                src={ImgSobrancelhas}
                alt="Sobrancelha"
              />
              <h3 className="title-card-servico">Sobrancelha</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="onde-estamos" id="onde-estamos">
        <div className="title-onde">
          <h1>Onde Estamos</h1>
        </div>

        <div className="endereco">
          <div className="content">
            <p>
              <i className="fas fa-map-marker-alt"></i>A Barbearia do Márcio
              hoje está situada na R. 4, 33 - Cidade Jardim, Águas Lindas de
              Goiás - GO, 72910-000.
            </p>
          </div>
        </div>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.229464181548!2d-48.26669059999999!3d-15.738995800000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935bb98f03505787%3A0x4689368439125e9b!2zU2Fsw6NvIGRvIE3DoXJjaW8!5e0!3m2!1spt-BR!2sbr!4v1746897716326!5m2!1spt-BR!2sbr"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </section>

      <Appointment />

      <footer id="contato">
        <div className="content">
          <div className="footer-top">
            <Image
              src={Logo}
              width={120}
              height={200}
              alt="Logotipo"
              style={{ borderRadius: 12 }}
            />

            <a
              href="https://www.instagram.com/barbeariadomarciosantos/"
              className="social"
            >
              <FontAwesomeIcon width={40} height={40} icon={faInstagram} />

              <p style={{ fontSize: 14, fontWeight: "normal" }}>
                Siga a gente no instagram
              </p>
              <p style={{ fontSize: 14 }}>@barbeariadomarciosantos</p>
            </a>

            {/**<a href="tel:61993">(61) 9 93</a> */}
          </div>

          <div className="footer-bottom">
            <p>
              <span id="data-atual"></span> © Copyright Barbearia do Márcio.
              Todos os direitos reservados.
            </p>
            <a href="https://www.thompson.dev" className="ocode">
              <span>Feito por:</span>
              <span>
                Thompson Silva em parceria com a faculdade Descomplica.
              </span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
