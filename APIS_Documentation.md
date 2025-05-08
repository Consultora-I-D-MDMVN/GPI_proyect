| Endpoint | Método | URL | Parámetros | Headers | Descripción | Respuesta Exitosa | Códigos de Estado |
|----------|--------|-----|------------|---------|-------------|------------------|------------------|
| Get Seleccion fenotipos hijos | GET | http://localhost:3000/api/etl/getChildren?traitCategoryId={Idtrait} | Id trait | Authorization: Bearer {token} | Devuelve todas las categorías de traits con el conteo de modelos PRS | ```json [{
        "id": 723,
        "label": "ACPA-negative rheumatoid arthritis",
        "description": "A subtype of rheumatoid arthritis defined by the absence of autoantibodies that are directed against citrullinated peptides and proteins."
    },]``` | 200 OK, 401 Unauthorized, 500 Internal Server Error |

