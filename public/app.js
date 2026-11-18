// ============================================================
// PARTE DO VUE (interface)
// Usa as funções do life.js pra calcular as gerações
// ============================================================

const TAMANHO_PADRAO = 10;
const TAMANHO_MIN = 3;
const TAMANHO_MAX = 40; // limitei pra não ficar pesado/gigante na tela

Vue.createApp({
  data() {
    return {
      MIN: TAMANHO_MIN,
      MAX: TAMANHO_MAX,
      tamanho: TAMANHO_PADRAO,
      grade: criarMatriz(TAMANHO_PADRAO), // geração atual
      geracao: 0,
      rodando: false,
      editando: true,  // começa podendo editar
      intervalo: 300,  // tempo entre gerações (ms)
      timer: null,     // guarda o setInterval
      mensagem: ''
    };
  },

  computed: {
    // RF08: quantidade de células vivas (atualiza sozinho)
    vivas() {
      return contarVivas(this.grade);
    },

    textoEstado() {
      if (this.rodando) return 'Rodando';
      if (this.editando) return 'Editando';
      return 'Pausado';
    },

    // monta as colunas do CSS grid conforme o tamanho
    estiloGrade() {
      const lado = Math.floor(500 / this.grade.length); // tamanho de cadas celulas
      return {
        gridTemplateColumns: 'repeat(' + this.grade.length + ', ' + lado + 'px)',
        gridAutoRows: lado + 'px'
      };
    }
  },

  watch: {
    
    tamanho(novo) {
      // se digitou algo inválido ou fora do limite, não faz nada e avisa
      if (!Number.isInteger(novo) || novo < TAMANHO_MIN || novo > TAMANHO_MAX) {
        this.mensagem = 'Digite um tamanho entre ' + TAMANHO_MIN + ' e ' + TAMANHO_MAX + '.';
        return;
      }
      this.mensagem = '';
      this.reiniciar();
    },

    /*// se mudar a velocidade com a simulação rodando, reinicia o timer
    intervalo() {
      if (this.rodando) {
        this.pararTimer();
        this.comecarTimer();
      }
    }*/
  },

  methods: {
    // RF02: clicar na célula troca viva/morta
    alternarCelula(i, j) {
      if (!this.editando) return;
      this.grade[i][j] = !this.grade[i][j];
    },

    // avança uma geração (usado pelo timer e pelo botão de passo)
    avancar() {
      this.grade = proximaGeracao(this.grade); // a matriz nova substitui a atual
      this.geracao++;
    },

    comecarTimer() {
      this.timer = setInterval(() => {
        this.avancar();
      }, this.intervalo);
    },

    pararTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },

    // RF03 e RF04 (continuar usa o mesmo método, o estado da grade é mantido)
    iniciar() {
      if (this.vivas === 0) {
        this.mensagem = 'Marque pelo menos uma célula viva antes de iniciar.';
        return;
      }
      this.mensagem = '';
      this.editando = false;
      this.rodando = true;
      this.comecarTimer();
    },

    // RF04: pausar
    pausar() {
      this.rodando = false;
      this.pararTimer();
    },

    // RF05: um passo de cada vez
    passo() {
      this.pausar();
      this.editando = false;
      this.avancar();
    },

    // botão pra voltar a poder editar a geração atual
    editar() {
      this.pausar();
      this.editando = true;
    },

    // RF06: limpa tudo e volta pro começo
    reiniciar() {
      this.pausar();
      this.grade = criarMatriz(this.tamanho);
      this.geracao = 0;
      this.editando = true;
    }
  },

  // garante que o timer não fica rodando se a página for fechada/recarregada
  beforeUnmount() {
    this.pararTimer();
  }
}).mount('#app');
