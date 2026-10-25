export interface Pessoa {
  id?: number;
  nome: string;
  data_nasc: string;
  cpf: string;
  sexo: 'M' | 'F';
  altura: number;
  peso: number;
}

//Omitir formalmente id nas adições
export type PessoaInput = Omit<Pessoa, 'id'>;
