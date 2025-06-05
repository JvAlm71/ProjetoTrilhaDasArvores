import folium
import os
import csv

# --- Função para carregar pontos de interesse de um arquivo CSV ---
def carregar_pontos_do_csv(caminho_arquivo_csv):
    """
    Carrega pontos de interesse (local, latitude, longitude) de um arquivo CSV.
    """
    pontos = []
    nome_coluna_local = 'Nome'
    nome_coluna_latitude = 'Latitude'
    nome_coluna_longitude = 'Longitude'

    try:
        with open(caminho_arquivo_csv, mode='r', encoding='utf-8-sig', newline='') as csvfile:
            leitor_csv = csv.DictReader(csvfile)
            
            if not leitor_csv.fieldnames:
                print(f"Erro: Não foi possível ler os cabeçalhos do CSV '{caminho_arquivo_csv}'.")
                return []

            colunas_necessarias = [nome_coluna_local, nome_coluna_latitude, nome_coluna_longitude]
            colunas_ausentes = [col for col in colunas_necessarias if col not in leitor_csv.fieldnames]

            if colunas_ausentes:
                print(f"Erro Crítico: Colunas não encontradas no CSV '{caminho_arquivo_csv}': {', '.join(colunas_ausentes)}")
                print(f"COLUNAS DISPONÍVEIS: {', '.join(leitor_csv.fieldnames)}")
                print("Ajuste 'nome_coluna_local', 'nome_coluna_latitude', 'nome_coluna_longitude' no script.")
                return []

            for indice, linha in enumerate(leitor_csv):
                try:
                    local = linha[nome_coluna_local]
                    latitude_str = linha[nome_coluna_latitude].replace(',', '.')
                    longitude_str = linha[nome_coluna_longitude].replace(',', '.')
                    latitude = float(latitude_str)
                    longitude = float(longitude_str)
                    pontos.append({"local": local, "coords": [latitude, longitude]})
                except ValueError:
                    print(f"Aviso: Erro ao converter coordenadas na linha {indice + 2} do CSV. Linha: {linha}. Ignorada.")
                except KeyError as e:
                    print(f"Aviso: Coluna {e} ausente na linha {indice + 2} do CSV. Ignorada.")
                
    except FileNotFoundError:
        print(f"Erro Crítico: Arquivo CSV '{caminho_arquivo_csv}' não encontrado.")
        return []
    except Exception as e:
        print(f"Erro ao ler CSV: {e}")
        return []
    
    if not pontos:
        print("Nenhum ponto de interesse carregado do CSV.")
    else:
        print(f"{len(pontos)} pontos de interesse carregados de '{caminho_arquivo_csv}'.")
    return pontos

# --- Fim da função ---

# 1. Carregar coordenadas
caminho_do_seu_csv = './public/Dados.csv' 
pontos_interesse = carregar_pontos_do_csv(caminho_do_seu_csv)

# (A variável coordenadas_trajeto abaixo é para um trajeto entre os dois primeiros pontos,
# não será usada para o trajeto tracejado de todos os pontos, mas mantida caso seja útil para outros fins)
coordenadas_trajeto_primeiros_dois = []
if len(pontos_interesse) >= 2:
    coordenadas_trajeto_primeiros_dois = [pontos_interesse[0]["coords"], pontos_interesse[1]["coords"]]
elif pontos_interesse:
    coordenadas_trajeto_primeiros_dois = [pontos_interesse[0]["coords"]]
    print("Aviso: Apenas um ponto de interesse carregado (para coordenadas_trajeto_primeiros_dois).")
else:
    print("Aviso: Nenhum ponto de interesse carregado (para coordenadas_trajeto_primeiros_dois).")

# 2. Criar mapa
if pontos_interesse:
    map_location = pontos_interesse[0]["coords"]
    map_zoom_start = 16
else:
    map_location = [-22.7078, -47.6314]
    map_zoom_start = 19
    print("Nenhum ponto para centralizar o mapa. Usando localização padrão.")

mapa = folium.Map(location=map_location, zoom_start=map_zoom_start)

# 3. Adicionar marcadores
marker_icon_image_path = './public/icon.png' # Definido fora do loop se for o mesmo para todos
popup_image_filename = './public/icon.png'      # Definido fora do loop se for o mesmo para todos

if pontos_interesse:
    for i, ponto in enumerate(pontos_interesse):
        tree_index = i + 1
        
        popup_html = f'''
        <div>
            <strong>Árvore {tree_index}: {ponto["local"]}</strong>
            <br>
            <img src="{popup_image_filename}" alt="Detalhe {ponto["local"]}" style="width:50px; margin-top:5px;">
        </div>
        '''
        tooltip_text = f"Árvore {tree_index}: {ponto['local']}"
        
        custom_marker = folium.CustomIcon(
            icon_image=marker_icon_image_path,
            icon_size=(35, 35),
            icon_anchor=(17, 35),
            popup_anchor=(0, -30)
        )
        
        folium.Marker(
            location=ponto["coords"],
            popup=folium.Popup(popup_html, max_width=250),
            tooltip=tooltip_text,
            icon=custom_marker
        ).add_to(mapa)
else:
    print("Nenhum marcador será adicionado ao mapa.")

# 4. Adicionar trajeto tracejado entre todos os pontos
if len(pontos_interesse) >= 2:
    # Coleta todas as coordenadas dos pontos de interesse na ordem em que aparecem no CSV
    coordenadas_para_trajeto_tracejado = [ponto["coords"] for ponto in pontos_interesse]
    
    # Adiciona a linha tracejada ao mapa
    folium.PolyLine(
        locations=coordenadas_para_trajeto_tracejado,
        tooltip="Trajeto entre os pontos", # Tooltip opcional para a linha
        color="black",                     # Cor da linha tracejada
        weight=2,                        # Espessura da linha
        opacity=0.8,                     # Opacidade da linha
        dash_array='10, 10'              # Padrão do tracejado: 'pixels_ligados, pixels_desligados'
                                         # Ajuste conforme necessário (ex: '5, 5', '15, 10, 5, 10')
    ).add_to(mapa)
    print(f"Trajeto tracejado adicionado conectando {len(coordenadas_para_trajeto_tracejado)} pontos.")
else:
    print("Trajeto tracejado não adicionado (requer pelo menos 2 pontos de interesse).")

# 5. Salvar mapa
output_path = "./public/trail_map.html" 
output_dir = os.path.dirname(output_path)
if output_dir:
    os.makedirs(output_dir, exist_ok=True)

mapa.save(output_path)

print(f"\nMapa gerado! Salvo em: {output_path}")
print(f"Verifique se '{os.path.basename(output_path)}' está acessível na sua aplicação React.")
# Acesso os nomes dos arquivos de imagem aqui para as instruções finais
# (os nomes são definidos antes do loop de marcadores ou são constantes)
marker_image_basename = os.path.basename(marker_icon_image_path) if pontos_interesse else "image_a925f7.png (nome padrão)"
popup_image_actual_filename = popup_image_filename if pontos_interesse else "image_a92ab5.png (nome padrão)"

print(f"IMPORTANTE: Coloque as imagens:")
print(f"  - '{marker_image_basename}' (para os marcadores no mapa)")
print(f"  - '{popup_image_actual_filename}' (para as imagens dentro dos popups)")
print(f"na pasta '{output_dir if output_dir else 'raiz do projeto'}' para que tudo funcione corretamente.")
print(f"\nLEMBRE-SE: Verifique os nomes das colunas ('Nome', 'Latitude', 'Longitude') no script se necessário.")