# SAPE
**Software Assisted Poetry Editor**

![Screenshot](https://i.imgur.com/EWA3UWD.png)

## WTF ?
SAPE é um editor de poemas, basicamente um editor de texto minimalista com três funcões adicionais : 
* Contador de sílabas poéticas
* Pesquisador de rimas
* Realçador de rimas (beta)

### Contador de sílabas poéticas
O programa conta a soma das sílabas poéticas de cada verso, ajudando o poeta à ajustar sua métrica. É o número antes de cada linha.

### Pesquisador de rimas
Ajuda o poeta a encontrar palavras que rimam com uma palavra específica.
1. Selecione a palavra
2. Aperte o botão direito do mouse
3. Selecione "Procurar Rima"

### Realçador de rimas (beta)
Realça em cor todas as rimas do texto. Ainda em fase de testes.

## Instalação

### Windows

Instale o último executável `.exe` em https://github.com/caioluders/SAPE/releases/

### Mac

Instale o último executável `.app` em https://github.com/caioluders/SAPE/releases/

### Linux

```
$ git clone https://github.com/caioluders/SAPE.git
$ cd SAPE
$ pip instal -r requiments.txt
$ ./sape.py
```

#### ETC
Só funciona com Português, e usa a API do https://dicionario-aberto.net
Para a contagem de sílabas, o programa usa a biblioteca PETRUS https://github.com/alessandrobokan/PETRUS
