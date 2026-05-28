// ╔══════════════════════════════════════════════════════════════╗
// ║  CONFIGURAÇÃO DA RETROSPECTIVA                              ║
// ║  Edite APENAS este arquivo para personalizar tudo.          ║
// ╚══════════════════════════════════════════════════════════════╝

const CONFIG = {

  // ─── QUEM ENVIA E QUEM RECEBE ───
  sender: {
    name: 'Kelvin',
  },
  receiver: {
    name: 'Jonathann',
    nickname: 'Jonathann',   // << EDITE: apelido carinhoso (aparece na splash "Para ___")
  },

  // ─── TEMA VISUAL ───
  theme: {
    mode: 'dark',
    primaryColor: '#e8536c',                 // cor dos destaques e botões
    secondaryColor: '#f5a623',               // cor secundária (detalhes)
    backgroundColor: '#0b0b0f',              // fundo geral
    surfaceColor: 'rgba(255,255,255,0.04)',   // fundo de cards/superfícies
    textColor: '#f0eee6',                    // texto principal
    mutedColor: 'rgba(255,255,255,0.5)',     // texto secundário
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    accentFont: "'Dancing Script', cursive",
    borderRadius: '16px',
  },

  // ─── PARTÍCULAS FLUTUANTES ───
  particles: {
    enabled: true,
    type: 'hearts',          // 'hearts', 'stars', 'sparkles', 'none'
    color: '#e8536c',
    amount: 25,
    speed: 1,
  },

  // ─── TRANSIÇÕES ENTRE SLIDES ───
  transitions: {
    type: 'fade',            // 'fade', 'slide-up', 'slide-left', 'zoom', 'blur'
    duration: 700,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // ─── MÚSICA DE FUNDO ───
  music: {
    enabled: true,
    src: 'assets/music/lasgo-something.mp3',  // Coloque o MP3 na pasta assets/music/ com esse nome
    volume: 0.35,
    fadeIn: true,
  },

  // ─── SLIDES ───
  // Tipos: intro, photo, video, text, audio, gallery, letter, counter, final
  // Adicione, remova ou reordene à vontade.
  // Marque com << EDITE os campos que você precisa preencher.
  slides: [

    // ── INTRO ──
    {
      type: 'intro',
      title: 'Nossa História',                               // << EDITE
      subtitle: 'Cada momento com você merece ser lembrado',  // << EDITE
    },

    // ── CONTADOR (tempo juntos, atualiza em tempo real) ──
    {
      type: 'counter',
      title: 'Juntos há',
      startDate: '2022-08-03',              // << EDITE: data que começaram (YYYY-MM-DD)
      message: 'E cada segundo valeu a pena.',  // << EDITE
    },

    // ── FOTO 1 ──
    {
      type: 'photo',
      src: 'assets/photos/foto1.jpg',       // << EDITE: nome do arquivo da foto
      caption: 'Nosso primeiro encontro',   // << EDITE: legenda
      date: '03 de Agosto de 2022',          // << EDITE: data do momento
    },

    // ── TEXTO 1 ──
    {
      type: 'text',
      title: 'Eu lembro...',
      content: 'Daquele macarrão que fez, mas lembro muito pouco do pedido de namoro infelizmente.',
    },

    // ── FOTO 2 ──
    {
      type: 'photo',
      src: 'assets/photos/IMG_2493.jpeg',
      caption: 'Aquele dia especial',       // << EDITE
      date: 'Setembro de 2022',             // << EDITE
    },

    // ── GALERIA (scroll horizontal com várias fotos) ──
    {
      type: 'gallery',
      title: 'Nossos melhores momentos',    // << EDITE
      photos: [
        { src: 'assets/photos/g1.jpeg', caption: 'Momento 1' },  // << EDITE cada legenda
        { src: 'assets/photos/g3.jpeg', caption: 'Momento 2' },
        { src: 'assets/photos/g4.jpeg', caption: 'Momento 3' },
        // Adicione quantas quiser copiando a linha acima
      ],
    },

    // ── VÍDEO (opcional — remova este bloco se não tiver vídeo) ──
    {
      type: 'video',
      src: 'assets/videos/video1.mp4',      // << EDITE: nome do arquivo
      caption: 'Aquele vídeo que sempre me faz sorrir',  // << EDITE
    },

    // ── ÁUDIO / MENSAGEM DE VOZ (opcional — remova se não tiver) ──
    {
      type: 'audio',
      src: 'assets/audio/mensagem.m4a',
      title: 'Aperta o play...',            // << EDITE
      subtitle: 'Gravei isso pra você ouvir se achar importante',
    },

    // ── TEXTO 2 ──
    {
      type: 'text',
      title: 'O que sinto',
      content: 'Medo, medo de errar de novo e estou melhorando eu prometo.',
    },

    // ── CARTA ──
    {
      type: 'letter',
      title: 'Pra você...',                // << EDITE
      paragraphs: [
        'Por muito tempo eu sempre tentei manter mais de um próximo justamente pela perda, o ego de ter mais nunca me fez enxergar.',
        'Infelizmente eu gostaria de poder voltar no primeiro dia que te vi e viver tudo de novo com todos os erros corrigidos.',
        'E olha só, hoje seus defeitos me fazem falta.....',
        'Estarei aqui quando e se for aceitável para ti nos conhecermos de novo.',
      ],
      signature: 'Com todo meu amor,',     // << EDITE
    },

    // ── FINAL ──
    {
      type: 'final',
      title: 'Não estou pedindo para voltar até porque acredito nem ser o momento, mas saiba que;',
      subtitle: 'Eu ainda acredito em nós.',
      emoji: '❤️',
      // Descomente as 2 linhas abaixo para adicionar um botão de WhatsApp:
      // buttonText: 'Me responde ❤️',
      // buttonLink: 'https://wa.me/55SEUNUMERO?text=Vi%20a%20retrospectiva...',
    },
  ],
};
