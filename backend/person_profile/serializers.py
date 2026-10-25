import re
from datetime import date

from rest_framework import serializers

from .models import Pessoa


class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = ("id", "nome", "data_nasc", "cpf", "sexo", "altura", "peso")

    def validate_cpf(self, value):
        if not re.fullmatch(r"[0-9]{11}", value):
            raise serializers.ValidationError(
                "O CPF deve conter exatamente 11 dígitos numéricos."
            )
        return value

    def validate_data_nasc(self, value):
        today = date.today()

        if value > today:
            raise serializers.ValidationError("Data de nascimento inválida.")

        return value

    def validate_altura(self, value):
        if not 80 <= value:
            raise serializers.ValidationError("A altura deve ser maior ou igual a 80")
        return value

    def validate_peso(self, value):
        if not 1 <= value:
            raise serializers.ValidationError("O peso deve ser maior ou igual a 1")
        return value
