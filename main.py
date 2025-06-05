from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sqlalchemy import create_engine, text
from geopy.distance import geodesic

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# Banco Neon
DATABASE_URL = "postgresql://neondb_owner:npg_LAIMBGtOj69f@ep-black-morning-acepps1y-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"
engine = create_engine(DATABASE_URL)

@app.get("/")
def read_root():
    return {"message": "API de Árvores conectada com sucesso"}

@app.get("/arvores")
def listar_arvores(
):
    with engine.connect() as conn:
        # Obter só o cabeçalho para ver os nomes corretos das colunas
        df_colunas = pd.read_sql(text("SELECT * FROM arvores LIMIT 1"), conn)
        print("Colunas disponíveis:", df_colunas.columns.tolist())

    query = """
        SELECT nome, latitude, longitude, caracteristicas_gerais
        FROM arvores
        WHERE 1=1
    """
    params = {}

    with engine.connect() as conn:
        df = pd.read_sql(text(query), conn, params=params)

    # Organizar resposta formatada
    arvores = []
    for _, row in df.iterrows():
        arvores.append({
            "nome": row["nome"],
            "localizacao": {
                "latitude": row["latitude"],
                "longitude": row["longitude"],
                "caracteristicas_gerais": row["caracteristicas_gerais"]
            }
        })

    return arvores

@app.get("/arvore/{codigo}")
def obter_arvore_por_codigo(codigo: int):
    query = """
        SELECT codigo, nome, latitude, longitude, caracteristicas_gerais
        FROM arvores
        WHERE codigo = :codigo
    """

    with engine.connect() as conn:
        df = pd.read_sql(text(query), conn, params={"codigo": codigo})

    if df.empty:
        return {"erro": f"Nenhuma árvore encontrada com código {codigo}."}

    row = df.iloc[0]

    return {
        "codigo": int(row["codigo"]),
        "nome": str(row["nome"]),
        "latitude": float(row["latitude"]),
        "longitude": float(row["longitude"]),
        "caracteristicas_gerais": str(row["caracteristicas_gerais"]) if pd.notna(row["caracteristicas_gerais"]) else None
    }

