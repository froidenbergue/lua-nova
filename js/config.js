/* Dados do cliente. Para alterar contatos, horários, equipe ou marcas, edite somente este arquivo. */
const CONFIG = {
  empresa: {
    nome: "Lua Nova",
    fundacao: 2008,
    cidade: "Santo Ângelo",
    estado: "RS",
  },

  // Números com DDD (o código do país 55 é adicionado automaticamente no link).
  contato: {
    mensagemPadrao: "Olá, gostaria de receber mais informações!",
    grupoPromocoes: "https://chat.whatsapp.com/KrXTLWoDDGv2ZhEHtlUinj",
  },

  equipe: [
    { nome: "Kamili", cargo: "Vendedora", whatsapp: "55981173237", foto: "assets/images/equipe/kamili.jpg" },
    { nome: "Andreia", cargo: "Vendedora", whatsapp: "55999155914", foto: "assets/images/equipe/andreia.jpg" },
    { nome: "Priscila", cargo: "Gerente", whatsapp: "55981248526", foto: "assets/images/equipe/priscila.jpg" },
    { nome: "Di Hellen", cargo: "Caixa", whatsapp: "55991549697", foto: "assets/images/equipe/di-hellen.jpg" },
  ],

  endereco: {
    rua: "Avenida Sagrada Família, 64",
    bairro: "Hortência",
    cidade: "Santo Ângelo",
    estado: "RS",
    cep: "98805-438",
  },

  redes: {
    instagram: "https://www.instagram.com/luanova.santoangelo/",
    facebook: "https://www.facebook.com/vanessa.luanova.9?locale=pt_BR",
  },

  // dias: 0 = domingo ... 6 = sábado. Intervalos em "HH:MM".
  horarios: [
    { rotulo: "Segunda a sexta", texto: "8h30 às 12h e 13h30 às 18h30", dias: [1, 2, 3, 4, 5], turnos: [["08:30", "12:00"], ["13:30", "18:30"]] },
    { rotulo: "Sábado", texto: "8h30 às 17h", dias: [6], turnos: [["08:30", "17:00"]] },
    { rotulo: "Domingo", texto: "Fechado", dias: [0], turnos: [] },
  ],

  links: {
    maps: "https://www.google.com/maps/place/Lua+Nova/@-28.2983466,-54.2633858,15z/data=!4m10!1m2!2m1!1slua+nova+santo+angelo!3m6!1s0x94fe9a7be7809287:0x67d2697c108226a5!8m2!3d-28.2983466!4d-54.2443314!15sChVsdWEgbm92YSBzYW50byBhbmdlbG-SAQ5jbG90aGluZ19zdG9yZeABAA!16s%2Fg%2F11j4t6d88w?entry=ttu&g_ep=EgoyMDI2MDkyNy4wIKXMDSoASAFQAw%3D%3D",
  },

  marcas: [
    { nome: "Molekinha", img: "assets/images/marcas/molekinha.jpg" },
    { nome: "Kyly", img: "assets/images/marcas/kyly.jpg" },
    { nome: "Aconchego do Bebê", img: "assets/images/marcas/aconchegodobebe.jpg" },
    { nome: "Actvitta", img: "assets/images/marcas/actvitta.jpg" },
    { nome: "Mormaii", img: "assets/images/marcas/mormaii.jpg" },
    { nome: "Vizzano", img: "assets/images/marcas/vizzano.jpg" },
    { nome: "Beira Rio", img: "assets/images/marcas/beirario.jpg" },
    { nome: "Coca-Cola", img: "assets/images/marcas/cocacola.jpg" },
    { nome: "Sallo", img: "assets/images/marcas/sallo.jpg" },
  ],
};
