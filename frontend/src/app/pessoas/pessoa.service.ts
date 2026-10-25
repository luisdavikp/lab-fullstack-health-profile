import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Pessoa, PessoaInput } from './pessoa.model';

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/pessoas/';

  // Pesquisar: filtros opcionais. Sem filtros, devolve todas.
  pesquisar(filtros: { cpf?: string; nome?: string } = {}): Observable<Pessoa[]> {
    let params = new HttpParams();
    if (filtros.cpf) params = params.set('cpf', filtros.cpf);
    if (filtros.nome) params = params.set('nome', filtros.nome);

    return this.http.get<Pessoa[]>(this.apiUrl, { params });
  }

  // Incluir
  incluir(pessoa: PessoaInput): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  // Alterar
  alterar(id: number, pessoa: PessoaInput): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}${id}/`, pessoa);
  }

  // Excluir
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // Peso ideal
  pesoIdeal(id: number): Observable<{ peso_ideal: number }> {
    return this.http.get<{ peso_ideal: number }>(`${this.apiUrl}${id}/peso-ideal/`);
  }
}
