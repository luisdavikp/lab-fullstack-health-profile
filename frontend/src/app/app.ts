import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import dos componentes criados
import { PessoaForm } from './pessoas/pessoa-form/pessoa-form';

@Component({
  imports: [RouterOutlet, PessoaForm],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
