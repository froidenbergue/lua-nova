(function () {
  const C = CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wa = (num, msg = C.contato.mensagemPadrao) => `https://wa.me/55${num}?text=${encodeURIComponent(msg)}`;
  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    n.innerHTML = html;
    return n;
  };

  /* Links gerais */
  $$("[data-grupo]").forEach((a) => (a.href = C.contato.grupoPromocoes));
  $$("[data-grupo-loja]").forEach((a) => (a.href = C.contato.grupoLoja));
  $$("[data-maps]").forEach((a) => (a.href = C.links.maps));
  $$("[data-rede]").forEach((a) => (a.href = C.redes[a.dataset.rede]));

  /* Marcas: faixas contínuas em sentidos opostos (4 no celular, 3 no desktop). Só as logos aparecem; o nome fica no alt. */
  const marquee = $("#marquee");
  const num = $("#marcas-num");
  if (num) num.textContent = C.marcas.length;
  const itemMarca = (m) => el("li", { class: "marca" }, `<img src="${m.img}" alt="Logo da marca ${m.nome}" width="132" height="132" loading="lazy" decoding="async">`);
  const montarFaixas = () => {
    const celular = window.innerWidth < 820;
    const linhas = celular ? 4 : 3;
    const velocidade = celular ? 52 : 64; // px por segundo (20% mais lento que antes: 65 e 80)
    marquee.innerHTML = "";
    for (let r = 0; r < linhas; r++) {
      const row = el("div", { class: "marquee__row" + (r % 2 ? " marquee__row--rev" : "") });
      const ul = el("ul", { class: "marquee__track" });
      row.appendChild(ul);
      marquee.appendChild(row);
      C.marcas.filter((_, i) => i % linhas === r).forEach((m) => ul.appendChild(itemMarca(m)));
      const originais = [...ul.children];
      const conjunto = ul.getBoundingClientRect().width;
      const k = Math.max(1, Math.ceil(window.innerWidth / conjunto));
      const clonar = () => originais.forEach((li) => { const c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); ul.appendChild(c); });
      for (let i = 1; i < k; i++) clonar();
      [...ul.children].forEach((li) => { const c = li.cloneNode(true); c.setAttribute("aria-hidden", "true"); ul.appendChild(c); });
      ul.style.setProperty("--dur", ((conjunto * k) / velocidade).toFixed(1) + "s");
    }
  };
  montarFaixas();
  let larguraAtual = window.innerWidth, timerFaixas;
  window.addEventListener("resize", () => {
    if (window.innerWidth === larguraAtual) return;
    larguraAtual = window.innerWidth;
    clearTimeout(timerFaixas);
    timerFaixas = setTimeout(montarFaixas, 250);
  });

  /* Equipe */
  const avatar = (p) => `<span class="pessoa__avatar" role="img" aria-label="${p.nome}, ${p.cargo}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.2" r="4"></circle><path d="M4 21c0-4.4 3.6-7.4 8-7.4s8 3 8 7.4"></path></svg></span>`;
  const equipe = $("#equipe");
  C.equipe.forEach((p) => {
    const li = el("li");
    li.innerHTML = `<a class="pessoa" href="${wa(p.whatsapp)}" target="_blank" rel="noopener" aria-label="Falar com ${p.nome} (${p.cargo}) no WhatsApp">
      ${p.foto ? `<img src="${p.foto}" alt="${p.nome}, ${p.cargo}" loading="lazy">` : avatar(p)}
      <span class="pessoa__info"><strong>${p.nome}</strong><span>${p.cargo}</span><em>Chamar no WhatsApp</em></span></a>`;
    equipe.appendChild(li);
  });
  const cardGrupo = (titulo, texto, url) => `<div class="grupo"><img src="assets/images/logo.jpg" alt="" width="64" height="64" loading="lazy">
     <div><h3>${titulo}</h3><p>${texto}</p></div>
     <a class="btn" href="${url}" target="_blank" rel="noopener" aria-label="Entrar no ${titulo.toLowerCase()}">Entrar no grupo</a></div>`;
  equipe.insertAdjacentElement("afterend", el("div", { class: "grupos" },
    cardGrupo("Grupo da loja", "Entre no grupo da loja e fique por dentro das novidades da Lua Nova.", C.contato.grupoLoja) +
    cardGrupo("Grupo de promoções", "Entre no grupo do WhatsApp da loja e acompanhe as promoções.", C.contato.grupoPromocoes)));

  /* Endereço, horários, mapa e rodapé */
  const e = C.endereco;
  $("#endereco").innerHTML = `${e.rua}<br>${e.bairro}, ${e.cidade}/${e.estado}<br>CEP ${e.cep}`;
  $("#rodape-end").textContent = `${e.rua}, ${e.bairro}, ${e.cidade}/${e.estado}`;
  $("#mapa").src = "https://maps.google.com/maps?output=embed&q=" + encodeURIComponent(`${e.rua}, ${e.cidade} ${e.estado}, ${e.cep}`);
  $("#copy").textContent = `© ${new Date().getFullYear()} ${C.empresa.nome}. Todos os direitos reservados.`;

  const agora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  const hoje = agora.getDay();
  const min = agora.getHours() * 60 + agora.getMinutes();
  const toMin = (h) => { const [a, b] = h.split(":"); return +a * 60 + +b; };
  let aberto = false;
  const dl = $("#horarios");
  C.horarios.forEach((h) => {
    const ehHoje = h.dias.includes(hoje);
    if (ehHoje) aberto = h.turnos.some(([a, b]) => min >= toMin(a) && min < toMin(b));
    dl.appendChild(el("div", ehHoje ? { class: "hoje" } : {}, `<dt>${h.rotulo}</dt><dd>${h.texto}</dd>`));
  });
  $("#status").appendChild(el("span", { class: "pill " + (aberto ? "pill--on" : "pill--off") }, aberto ? "Aberto agora" : "Fechado no momento"));


  /* Menu de atendentes do WhatsApp */
  const whatsappMenu = $("#whatsapp-menu");
  const whatsappFab = $("#whatsapp-fab");
  const whatsappHeader = $("[data-whatsapp-menu]");

  const montarMenuWhatsApp = (msg = C.contato.mensagemPadrao) => {
    if (!whatsappMenu) return;
    whatsappMenu.innerHTML = `<div class="whatsapp-menu__title">Fale com uma de nossas atendentes</div>`;
    C.equipe.forEach((p) => {
      const a = el(
  "a",
  {
    href: wa(p.whatsapp, msg),
    target: "_blank",
    rel: "noopener",
    "aria-label": `Falar com ${p.nome} no WhatsApp`
  },
  `
    <span class="whatsapp-menu__icon" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.5 0 .14 5.36.14 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.94 11.94 0 0 0 5.82 1.5h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 0 0-3.5-8.44ZM12.08 21.8a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.71.97.99-3.62-.23-.37a9.84 9.84 0 0 1-1.51-5.25c0-5.45 4.43-9.88 9.88-9.88a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.88 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
      </svg>
    </span>
    <span>
      <span class="whatsapp-menu__name">${p.nome}</span>
      <span class="whatsapp-menu__role">${p.cargo}</span>
    </span>
  `
);

whatsappMenu.appendChild(a);
    });
  };

  const alternarWhatsApp = () => {
    if (!whatsappMenu) return;
    const abrir = !whatsappMenu.classList.contains("open");
    if (abrir) montarMenuWhatsApp();
    whatsappMenu.classList.toggle("open", abrir);
    whatsappMenu.setAttribute("aria-hidden", String(!abrir));
    if (whatsappFab) whatsappFab.setAttribute("aria-expanded", String(abrir));
  };

  montarMenuWhatsApp();
  whatsappFab?.addEventListener("click", alternarWhatsApp);
  whatsappHeader?.addEventListener("click", (ev) => { ev.preventDefault(); alternarWhatsApp(); });
  $$("[data-whatsapp-condicional]").forEach((b) => b.addEventListener("click", (ev) => {
    ev.preventDefault();
    montarMenuWhatsApp(C.contato.mensagemCondicional);
    whatsappMenu?.classList.add("open");
    whatsappMenu?.setAttribute("aria-hidden", "false");
    whatsappFab?.setAttribute("aria-expanded", "true");
  }));
  document.addEventListener("click", (ev) => {
    if (whatsappMenu?.classList.contains("open") && !ev.target.closest(".whatsapp-fab-wrap") && !ev.target.closest("[data-whatsapp-menu]") && !ev.target.closest("[data-whatsapp-condicional]")) {
      whatsappMenu.classList.remove("open");
      whatsappMenu.setAttribute("aria-hidden", "true");
      whatsappFab?.setAttribute("aria-expanded", "false");
    }
  });

  /* Menu mobile */
  const burger = $("#burger"), menu = $("#menu");
  const fechar = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Abrir menu"); };
  burger.addEventListener("click", () => {
    const abrir = !menu.classList.contains("open");
    menu.classList.toggle("open", abrir);
    burger.setAttribute("aria-expanded", String(abrir));
    burger.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", fechar));
  document.addEventListener("keydown", (ev) => ev.key === "Escape" && fechar());
})();
