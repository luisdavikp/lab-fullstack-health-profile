from django.db.models import QuerySet

from .models import Pessoa
from .tasks import PessoaTask


class PessoaService:
    def __init__(self, task: PessoaTask | None = None):
        self.task = task or PessoaTask()

    def buscar(self, pessoa_id: int) -> Pessoa:
        return self.task.buscar(pessoa_id)

    def incluir(self, dados: dict) -> Pessoa:
        return self.task.incluir(dados)

    def pesquisar(
        self, cpf: str | None = None, nome: str | None = None
    ) -> QuerySet[Pessoa]:
        return self.task.pesquisar(cpf=cpf, nome=nome)

    def alterar(self, pessoa_id: int, dados: dict) -> Pessoa:
        return self.task.alterar(pessoa_id, dados)

    def excluir(self, pessoa_id: int) -> None:
        self.task.excluir(pessoa_id)

    def calcular_peso_ideal(self, pessoa_id: int) -> float:
        return self.task.calcular_peso_ideal(pessoa_id)
