import folium

# 1. Coordenadas dos pontos de interesse (Latitude, Longitude)
# Estas coordenadas deveriam idealmente vir de uma fonte de dados
# ou serem passadas como argumento se você quiser mapas dinâmicos por trilha.
pontos_interesse = [
    {"local": "Ponto A (Exemplo)", "coords": [-22.709950, -47.632774]},
    {"local": "Ponto B (Exemplo)", "coords": [-22.709978, -47.632765]},
    {"local": "Ponto C (Exemplo)", "coords": [-22.710050, -47.632737]}
]

coordenadas_trajeto = [
    pontos_interesse[0]["coords"],
    pontos_interesse[1]["coords"]
]

# 2. Criar um mapa
mapa = folium.Map(location=[-22.7078, -47.6314], zoom_start=16)

# 3. Adicionar marcadores
for ponto in pontos_interesse:
    folium.Marker(
        location=ponto["coords"],
        popup=ponto["local"],
        tooltip=ponto["local"]
    ).add_to(mapa)

# 4. Adicionar trajeto

# 5. Salvar o mapa como um arquivo HTML
# MODIFICAÇÃO IMPORTANTE: Salve no diretório 'public' da sua aplicação React.
# Ajuste o caminho '../../path/to/your/react-app/public/' conforme necessário.
# Se o script Python estiver na raiz do projeto React, o caminho pode ser 'public/trail_map.html'
output_path = "./public/trail_map.html" # Assumindo que o script está na pasta raiz do projeto React
# Se o script estiver em outra pasta, ajuste o caminho relativo para a pasta 'public'
# Exemplo: se o script está em 'scripts/' e a pasta public está em '../public/'
# output_path = "../public/trail_map.html"


mapa.save("trail_map.html")
print(f"Mapa gerado com sucesso! Salvo em: {output_path}")
print(f"Certifique-se que este arquivo está acessível em sua aplicação React (geralmente na pasta 'public').")
