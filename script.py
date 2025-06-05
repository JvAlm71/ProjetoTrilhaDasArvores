# importar_csv.py
import pandas as pd
from sqlalchemy import create_engine

# Caminho do CSV
csv_path = "Dados.csv"

# Carregar CSV
df = pd.read_csv(csv_path)

# URL do banco
DATABASE_URL = "postgresql://neondb_owner:npg_LAIMBGtOj69f@ep-black-morning-acepps1y-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

# Conectar ao banco
engine = create_engine(DATABASE_URL)

# Nome da tabela no banco
tabela = "arvores"

# Exportar para o banco
df.to_sql(tabela, engine, index=False, if_exists="replace")

print("Dados importados com sucesso!")

from sqlalchemy import create_engine, inspect, text
from unidecode import unidecode


def formatar_nome(nome):
    nome = unidecode(nome).strip().lower().replace(" ", "_").replace("-", "_")
    return nome

with engine.connect() as conn:
    insp = inspect(conn)
    colunas = insp.get_columns(tabela)

    for coluna in colunas:
        nome_original = coluna["name"]
        nome_novo = formatar_nome(nome_original)

        if nome_original != nome_novo:
            try:
                print(f'Renomeando "{nome_original}" para "{nome_novo}"...')
                # Executar fora de bloco de transação acumulada
                with engine.begin() as transaction:
                    transaction.execute(text(f'ALTER TABLE {tabela} RENAME COLUMN "{nome_original}" TO {nome_novo};'))
            except Exception as e:
                print(f"Erro ao renomear {nome_original}: {e}")
