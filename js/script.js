(function () {
  const C = CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wa = (num) => `https://wa.me/55${num}?text=${encodeURIComponent(C.contato.mensagemPadrao)}`;
  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
    n.innerHTML = html;
    return n;
  };

  /* Links gerais */
  $$("[data-grupo]").forEach((a) => (a.href = C.contato.grupoPromocoes));
  $$("[data-maps]").forEach((a) => (a.href = C.links.maps));
  $$("[data-rede]").forEach((a) => (a.href = C.redes[a.dataset.rede]));

  /* Marcas (lista duplicada para o carrossel infinito) */
  const track = $("#marcas-track");
  [false, true].forEach((dup) =>
    C.marcas.forEach((m) => {
      const li = el("li", { class: "marca" }, `<img src="${m.img}" alt="${dup ? "" : "Marca " + m.nome}" width="160" height="160" loading="lazy"><span>${m.nome}</span>`);
      if (dup) li.setAttribute("aria-hidden", "true");
      track.appendChild(li);
    })
  );

  /* Equipe */
  const equipe = $("#equipe");
  C.equipe.forEach((p) => {
    const li = el("li");
    li.innerHTML = `<a class="pessoa" href="${wa(p.whatsapp)}" target="_blank" rel="noopener" aria-label="Falar com ${p.nome} (${p.cargo}) no WhatsApp">
      <img src="${p.foto}" alt="${p.nome}, ${p.cargo}" loading="lazy">
      <span class="pessoa__info"><strong>${p.nome}</strong><span>${p.cargo}</span><em>Chamar no WhatsApp</em></span></a>`;
    equipe.appendChild(li);
  });
  equipe.insertAdjacentElement("afterend", el("div", { class: "grupo" },
    `<img src="assets/images/logo.jpg" alt="" width="64" height="64" loading="lazy">
     <div><h3>Grupo de promoções</h3><p>Entre no grupo do WhatsApp da loja e acompanhe as promoções.</p></div>
     <a class="btn" href="${C.contato.grupoPromocoes}" target="_blank" rel="noopener">Entrar no grupo</a>`));

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
