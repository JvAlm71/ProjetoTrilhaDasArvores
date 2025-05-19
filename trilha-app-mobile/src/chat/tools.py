from crewai_tools import ScrapeWebsiteTool


# Função para raspar informações de sites específicos
def scrape_websites(urls: list[str]) -> str:
    results = []
    for url in urls:
        tool = ScrapeWebsiteTool(website_url=url)
        raw_text = tool.run()
        # Força a conversão para UTF-8, ignorando caracteres problemáticos
        text_utf8 = raw_text.encode("latin-1", errors="ignore").decode("utf-8", errors="ignore")
        results.append(text_utf8)
    return "\n".join(results)


sites = ["https://www.esalq.usp.br/trilhas/trilhas.htm",
          "https://www.esalq.usp.br/trilhas/fruti/"]
combined_text = scrape_websites(sites)
