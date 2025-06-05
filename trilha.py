# Para encontrar árvores próximas para criar uma trilha

import pandas as pd
from geopy.distance import geodesic

# Parâmetros de entrada 
nome_origem = "Espinheira-Santa"
latitude_origem = -22.70781501	
longitude_origem = -47.63033964
nome_busca = "Guaçatonga"
limite = 4

# Caminho para seu arquivo CSV (ajuste conforme necessário)
caminho_csv = "Tabela_mestre.csv"

# Leitura do CSV
df = pd.read_csv(caminho_csv)

# Converte latitude e longitude para float, trocando vírgula por ponto
df["Latitude"] = df["Latitude"].astype(str).str.replace(",", ".").astype(float)
df["Longitude"] = df["Longitude"].astype(str).str.replace(",", ".").astype(float)

# Filtra árvores com coordenadas válidas e nome semelhante ao buscado
df_filtrado = df[
    df["Latitude"].notnull() &
    df["Longitude"].notnull() &
    df["Nome"].str.contains(nome_busca, case=False, na=False)
]

if df_filtrado.empty:
    print(f"Nenhuma árvore encontrada com nome semelhante a '{nome_busca}'.")
else:
    coord_origem = (latitude_origem, longitude_origem)

    # Calcula a distância entre a árvore de origem e cada árvore encontrada
    df_filtrado["distancia"] = df_filtrado.apply(
        lambda row: geodesic(coord_origem, (row["Latitude"], row["Longitude"])).meters,
        axis=1
    )

    # Ordena pelas árvores mais próximas e pega o número definido por 'limite'
    df_ordenado = df_filtrado.sort_values(by="distancia").head(limite)

    resultado = {
        "arvore_origem": {
            "Nome": nome_origem,
            "Latitude": latitude_origem,
            "Longitude": longitude_origem
        },
        "arvores_proximas": df_ordenado[["Código", "Nome", "Latitude", "Longitude", "distancia"]].to_dict(orient="records")
    }

    # Exibe o resultado
    from pprint import pprint
    pprint(resultado)
