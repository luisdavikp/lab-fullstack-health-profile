from django.db.models import QuerySet

from .models import Pessoa


# tasks para principais ações
class PessoaTask:
    def buscar(self, pessoa_id: int) -> Pessoa:
        return Pessoa.objects.get(pk=pessoa_id)

    def incluir(self, dados: dict) -> Pessoa:
        return Pessoa.objects.create(**dados)

    def pesquisar(
        self, cpf: str | None = None, nome: str | None = None
    ) -> QuerySet[Pessoa]:
        pessoas = Pessoa.objects.all()

        if cpf:
            pessoas = pessoas.filter(cpf=cpf)
        if nome:
            pessoas = pessoas.filter(nome__icontains=nome)

        return pessoas.order_by("nome")

    def alterar(self, pessoa_id: int, dados: dict) -> Pessoa:
        pessoa = Pessoa.objects.get(pk=pessoa_id)
        for campo, valor in dados.items():
            setattr(pessoa, campo, valor)
        pessoa.save()
        return pessoa

    def excluir(self, pessoa_id: int) -> None:
        Pessoa.objects.get(pk=pessoa_id).delete()

    def calcular_peso_ideal(self, pessoa_id: int) -> float:
        pessoa = Pessoa.objects.get(pk=pessoa_id)
        altura_m = pessoa.altura / 100  # ajustar para fórmula que usa metros

        if pessoa.sexo == "M":
            peso_ideal = (72.7 * altura_m) - 58
        # Se mulher
        else:
            peso_ideal = (62.1 * altura_m) - 44.7

        return round(peso_ideal, 2)
