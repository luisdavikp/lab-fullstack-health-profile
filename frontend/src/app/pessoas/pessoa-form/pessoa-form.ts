import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { Pessoa, PessoaInput } from '../pessoa.model';
import { PessoaService } from '../pessoa.service';

// nomes amigáveis dos campos para as mensagens de erro
const ROTULOS: Record<string, string> = {
  nome: 'Nome',
  data_nasc: 'Data de nascimento',
  cpf: 'CPF',
  sexo: 'Sexo',
  altura: 'Altura',
  peso: 'Peso',
};

type CampoOrdenavel = 'id' | 'nome' | 'altura' | 'peso';

@Component({
  selector: 'app-pessoa-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pessoa-form.html',
  styleUrl: './pessoa-form.css',
})
export class PessoaForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(PessoaService);

  // variáveis de estado
  pessoas = signal<Pessoa[]>([]);
  selecionada = signal<Pessoa | null>(null);
  mensagem = signal('');
  erro = signal('');
  pesoIdeal = signal<number | null>(null);

  // ordenação da tabela
  ordenarPor = signal<CampoOrdenavel>('nome');
  direcao = signal<'asc' | 'desc'>('asc');

  pessoasOrdenadas = computed(() => {
    const campo = this.ordenarPor();
    const fator = this.direcao() === 'asc' ? 1 : -1;

    return [...this.pessoas()].sort((a, b) => {
      if (campo === 'nome') return a.nome.localeCompare(b.nome) * fator;
      return ((a[campo] ?? 0) - (b[campo] ?? 0)) * fator;
    });
  });

  // cadastro (Incluir)
  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    data_nasc: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    sexo: ['M' as 'M' | 'F', Validators.required],
    altura: [0, [Validators.required, Validators.min(1)]],
    peso: [0, [Validators.required, Validators.min(1)]],
  });

  // filtro da tabela
  filtro = this.fb.nonNullable.group({
    cpf: [''],
    nome: [''],
  });

  // edição da linha selecionada
  edicao = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    data_nasc: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
    sexo: ['M' as 'M' | 'F', Validators.required],
    altura: [0, [Validators.required, Validators.min(30)]],
    peso: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.carregar();
  }

  //---------------AÇÕES DE CRUD------------------------

  // busca na API respeitando o filtro atual e atualiza a tabela
  private carregar() {
    const { cpf, nome } = this.filtro.getRawValue();

    this.service.pesquisar({ cpf, nome }).subscribe({
      next: (dados) => {
        this.pessoas.set(dados);
        this.selecionada.set(null);
      },
      error: (err) => this.mostrarErro(err),
    });
  }

  // botão Pesquisar do filtro
  pesquisar() {
    this.mensagem.set('');
    this.erro.set('');
    this.carregar();
  }

  // limpa o filtro e mostra todos
  limparFiltro() {
    this.filtro.reset();
    this.pesquisar();
  }

  // clique no cabeçalho: mesma coluna inverte a direção, outra coluna começa em asc
  ordenar(campo: CampoOrdenavel) {
    if (this.ordenarPor() === campo) {
      this.direcao.set(this.direcao() === 'asc' ? 'desc' : 'asc');
    } else {
      this.ordenarPor.set(campo);
      this.direcao.set('asc');
    }
  }

  // clicar na linha: entra no modo de edição
  selecionar(pessoa: Pessoa) {
    this.selecionada.set(pessoa);
    this.edicao.patchValue(pessoa);
  }

  // sai do modo de edição sem salvar
  cancelar() {
    this.selecionada.set(null);
    this.edicao.reset();
  }

  incluir() {
    if (this.form.invalid) return;

    const pessoa: PessoaInput = this.form.getRawValue();

    this.service.incluir(pessoa).subscribe({
      next: () => {
        this.mensagem.set('Pessoa incluída com sucesso.');
        this.erro.set('');
        this.form.reset();
        this.carregar();
      },
      error: (err) => this.mostrarErro(err),
    });
  }

  // botão Salvar da linha
  alterar() {
    const atual = this.selecionada();
    if (!atual?.id || this.edicao.invalid) return;

    const pessoa: PessoaInput = this.edicao.getRawValue();

    this.service.alterar(atual.id, pessoa).subscribe({
      next: () => {
        this.mensagem.set('Pessoa alterada com sucesso.');
        this.erro.set('');
        this.edicao.reset();
        this.carregar();
      },
      error: (err) => this.mostrarErro(err),
    });
  }

  excluir() {
    const atual = this.selecionada();
    if (!atual?.id) return;

    this.service.excluir(atual.id).subscribe({
      next: () => {
        this.mensagem.set('Pessoa excluída com sucesso.');
        this.erro.set('');
        this.edicao.reset();
        this.carregar();
      },
      error: (err) => this.mostrarErro(err),
    });
  }

  // botão Peso ideal
  calcularPesoIdeal() {
    const atual = this.selecionada();
    if (!atual?.id) return;

    this.service.pesoIdeal(atual.id).subscribe({
      next: (res) => {
        this.erro.set('');
        this.pesoIdeal.set(res.peso_ideal);
      },
      error: (err) => this.mostrarErro(err),
    });
  }

  // fecha o modal
  fecharModal() {
    this.pesoIdeal.set(null);
  }

  // transforma a resposta de erro da API em texto e abre o modal de erro
  private mostrarErro(err: HttpErrorResponse) {
    if (err.status === 0) {
      this.erro.set('Não foi possível conectar ao servidor.');
      return;
    }

    const corpo = err.error;
    if (!corpo || typeof corpo !== 'object') {
      this.erro.set(`Erro inesperado (${err.status}).`);
      return;
    }

    const linhas = Object.entries(corpo).map(([campo, msgs]) => {
      const texto = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
      const rotulo = ROTULOS[campo];
      return rotulo ? `${rotulo}: ${texto}` : texto;
    });

    this.erro.set(linhas.join('\n'));
  }

  // fecha o modal de erro
  fecharErro() {
    this.erro.set('');
  }

  //---------------------------------------
}
