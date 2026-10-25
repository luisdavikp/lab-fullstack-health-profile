from django.db import models


# Create your models here.
class Pessoa(models.Model):
    sexo_options = (
        ("M", "Masculino"),
        ("F", "Feminino"),
    )

    nome = models.CharField(max_length=150)
    data_nasc = models.DateField()
    cpf = models.CharField(max_length=11, unique=True)
    sexo = models.CharField(max_length=1, choices=sexo_options)
    altura = models.FloatField(help_text="Altura em centimetros")
    peso = models.FloatField(help_text="Peso em quilos (ex: 70.5)")

    def __str__(self):
        return self.nome  # person name
