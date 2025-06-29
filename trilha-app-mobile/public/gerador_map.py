import csv
import os

def filter_and_format_csv(input_filepath, output_filepath, desired_headers):
    """
    Reads a CSV file, filters columns, and writes them to a new CSV file
    in a specified order.

    Args:
        input_filepath (str): Path to the input CSV file.
        output_filepath (str): Path to the output CSV file.
        desired_headers (list): A list of strings representing the headers
                                 to include in the output, in their desired order.
    """
    try:
        with open(input_filepath, mode='r', newline='', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            
            # Read the original headers
            original_headers = [h.strip() for h in next(reader)]
            
            # Determine the indices of the desired headers in the original CSV
            header_indices = {header: original_headers.index(header) for header in desired_headers}

            # Prepare output directory if it doesn't exist
            output_dir = os.path.dirname(output_filepath)
            if output_dir and not os.path.exists(output_dir):
                os.makedirs(output_dir, exist_ok=True)

            with open(output_filepath, mode='w', newline='', encoding='utf-8') as outfile:
                writer = csv.writer(outfile)
                
                # Write the desired headers to the output file
                writer.writerow(desired_headers)
                
                # Process each row
                for row in reader:
                    # Create a new row with only the desired values in the correct order
                    output_row = [
                        row[header_indices[header]].replace('"', '').replace("'", "").strip() # Clean quotes and spaces
                        for header in desired_headers
                    ]
                    
                    # Special handling for numeric fields that might use comma as decimal separator
                    for i, header_name in enumerate(desired_headers):
                        if header_name in ['Altura Geral', 'Altura da 1a ramificação', 'Diâmetro copa', 'PAP', 'Latitude', 'Longitude']:
                            # Replace comma with dot for float conversion, if it's a numeric-like string
                            output_row[i] = output_row[i].replace(',', '.')
                            # You might want to add more robust numeric validation/conversion here
                            # For CSV output, keeping it as string is usually fine unless further processing is expected
                    
                    writer.writerow(output_row)
        
        print(f"Dados filtrados e formatados salvos com sucesso em: {output_filepath}")

    except FileNotFoundError:
        print(f"Erro: O arquivo de entrada '{input_filepath}' não foi encontrado.")
    except ValueError as e:
        print(f"Erro ao processar cabeçalhos: {e}. Certifique-se de que todos os cabeçalhos desejados existem no arquivo de entrada.")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

# --- Configuração ---
# Caminho para o seu arquivo CSV original
input_csv_path = './Dados.csv' 

# Caminho para o arquivo CSV de saída (por exemplo, na pasta public/data)
output_csv_path = os.path.join('public', 'data', 'filtered_tree_data.csv')

# Os cabeçalhos desejados na ordem em que você os quer no arquivo de saída
desired_output_headers = [
    'Código',
    'Nome',
    'espécie',
    'Altura Geral',
    'Altura da 1a ramificação',
    'Diâmetro copa',
    'PAP',
    'Localização área',
    'Observacao',
    'Latitude',
    'Longitude'
]

# --- Executar a função ---
if __name__ == "__main__":
    # Primeiro, crie um arquivo 'Dados.csv' no mesmo diretório do script
    # ou ajuste 'input_csv_path' para o local do seu arquivo.
    # Exemplo de como criar Dados.csv para teste:
    # (Este bloco pode ser removido se você já tem o Dados.csv)
    filter_and_format_csv(input_csv_path, output_csv_path, desired_output_headers)