from django.urls import path

from .views import PessoaDetalheView, PessoaPesoIdealView, PessoaView

urlpatterns = [
    path("pessoas/", PessoaView.as_view(), name="pessoas"),
    path(
        "pessoas/<int:pessoa_id>/", PessoaDetalheView.as_view(), name="pessoa-detalhe"
    ),
    path(
        "pessoas/<int:pessoa_id>/peso-ideal/",
        PessoaPesoIdealView.as_view(),
        name="pessoa-peso-ideal",
    ),
]
