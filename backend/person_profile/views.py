from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pessoa
from .serializers import PessoaSerializer
from .services import PessoaService


class PessoaView(APIView):
    service = PessoaService()

    def get(self, request):
        """Pesquisar: aceita cpf=... ou nome=..."""
        pessoas = self.service.pesquisar(
            cpf=request.query_params.get("cpf"),
            nome=request.query_params.get("nome"),
        )
        return Response(PessoaSerializer(pessoas, many=True).data)

    def post(self, request):
        """Incluir"""
        serializer = PessoaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pessoa = self.service.incluir(serializer.validated_data)
        return Response(PessoaSerializer(pessoa).data, status=status.HTTP_201_CREATED)


class PessoaDetalheView(APIView):
    service = PessoaService()

    def put(self, request, pessoa_id):
        """Alterar"""
        try:
            pessoa = self.service.buscar(pessoa_id)
        except Pessoa.DoesNotExist:
            return Response(
                {"detail": "Pessoa não encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = PessoaSerializer(pessoa, data=request.data)
        serializer.is_valid(raise_exception=True)
        pessoa = self.service.alterar(pessoa_id, serializer.validated_data)
        return Response(PessoaSerializer(pessoa).data)

    def delete(self, request, pessoa_id):
        """Excluir"""
        try:
            self.service.excluir(pessoa_id)
        except Pessoa.DoesNotExist:
            return Response(
                {"detail": "Pessoa não encontrada."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class PessoaPesoIdealView(APIView):
    service = PessoaService()

    def get(self, request, pessoa_id):
        """Calcular peso ideal"""
        try:
            peso_ideal = self.service.calcular_peso_ideal(pessoa_id)
        except Pessoa.DoesNotExist:
            return Response(
                {"detail": "Pessoa não encontrada."}, status=status.HTTP_404_NOT_FOUND
            )
        return Response({"peso_ideal": peso_ideal})
