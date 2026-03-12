import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}
function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 1000,
  });
  let updatedAtText = "Carregando";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return (
    <>
      <pre>Ultima atualização: {updatedAtText}</pre>
    </>
  );
}
function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 1000,
  });
  let databaseStatusInformation = "Carregando";
  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.oppened_connections}
        </div>
        <div>
          Maximo de Conexões: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }
  return (
    <>
      <h1>Database</h1>
      {databaseStatusInformation}
    </>
  );
}
