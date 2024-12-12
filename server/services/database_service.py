from neo4j import GraphDatabase
from models.airport import Airport
from models.route import Route

class DatabaseService:
  def __init__(self, db_url, db_user, db_pass):
    self.driver = GraphDatabase.driver(db_url, auth=(db_user, db_pass))

  def get_routes_from_graph(self, fromIATA):
    query = f"""
    MATCH (source:Airport)-[r:ROUTE]->(destination:Airport) WHERE source.IATA = '{fromIATA}'
    RETURN 
        source.IATA AS source,
        source.name AS source_name, 
        source.latitude AS source_lat, 
        source.longitude AS source_lon,
        destination.IATA AS target, 
        destination.latitude AS target_lat, 
        destination.longitude AS target_lon,
        r.airline AS airline
    """
    return self.__get_nodes_and_edges(query)

  def add_node(self, airport):
    if type(airport) == Airport and airport.is_valid():
      with self.driver.session() as session:
        session.run(f"""
        CREATE (:Airport {{
            name: '{airport.name}', city: '{airport.city}', country: '{airport.country}', IATA: '{airport.IATA}', ICAO: '{airport.ICAO}',
            latitude: {airport.latitude}, longitude: {airport.longitude}, altitude: {airport.altitude}
        }})
        """)
    else:
      raise Exception('Airport is not valid')

  def delete_node(self, airport_iata):
    with self.driver.session() as session:
      session.run("""
        MATCH (a:Airport {IATA: $airportIATA}) 
        DETACH DELETE a
        """, airportIATA=airport_iata)

  def add_route(self, source_airport_IATA, dest_airport_IATA, airline_code):
    with self.driver.session() as session:
      session.run("""
          MATCH (source:Airport {IATA: $sourceIATA}), (destination:Airport {IATA: $destinationIATA})
          MERGE (source)-[:ROUTE {airline: $airlineCode}]->(destination)
      """, sourceIATA=source_airport_IATA, destinationIATA=dest_airport_IATA, airlineCode=airline_code)

  def delete_route(self, route: Route):
    with self.driver.session() as session:
      session.run("""
      MATCH (:Airport {IATA: $sourceIATA})-[r:ROUTE {airline: $airlineCode}]->(:Airport {IATA: $destinationIATA})
      DELETE r
      """, sourceIATA=route.source_IATA, destinationIATA=route.destination_IATA, airlineCode=route.airline_code)

  def get_all_airports(self, country):
    query = f"""MATCH (a:Airport) WHERE a.country =~'.*{country}.*'
             RETURN a.IATA AS IATA, a.ICAO AS ICAO,  a.name AS name, a.city AS city, a.country AS country,
             a.latitude AS latitude, a.longitude AS longitude, a.altitude AS altitude"""

    with self.driver.session() as session:
      result = session.run(query)
      airports = []
      for record in result:
        airports.append(Airport(IATA=record["IATA"], ICAO=record["ICAO"], name=record["name"], city=record["city"],
          country=record["country"], latitude=record["latitude"], longitude=record["longitude"],
          altitude=record["altitude"]))
    return airports

  def get_all_routes(self, source_iata, dest_iata):
    with self.driver.session() as session:
      query = f"""
        MATCH (a:Airport)-[r:ROUTE]->(b:Airport)
        WHERE a.IATA =~ '.*{source_iata}.*' AND b.IATA =~ '.*{dest_iata}.*'
        RETURN a.IATA AS source, b.IATA AS target, r.airline AS airline
        """
      print(query)
      result = session.run(query)
      routes = []
      for record in result:
        routes.append(Route(source_IATA=record["source"], destination_IATA=record["target"], airline_code=record["airline"]))
    return routes
    
  def get_routes_with_multiple_changes(self, source_iata, dest_iata):
      with self.driver.session() as session:
          query = f"""
          MATCH p = shortestPath((a:Airport)-[:ROUTE*]->(b:Airport))
          WHERE a.IATA =~ '.*{source_iata}.*' AND b.IATA =~ '.*{dest_iata}.*'
          RETURN 
            [node in nodes(p) | node.IATA] AS airports,
            [rel in relationships(p) | rel.airline] AS airlines
          """
          result = session.run(query)
          routes = []
          for record in result:
              routes.append({
                  "airports": record["airports"], 
                  "airlines": record["airlines"]
              })
          return routes

  def __get_nodes_and_edges(self, query):
    with self.driver.session() as session:
      result = session.run(query)
      nodes = {}
      edges = []
      for record in result:
        if record["source"] not in nodes:
          nodes[record["source"]] = (record["source_lat"], record["source_lon"])
        if record["target"] not in nodes:
          nodes[record["target"]] = (record["target_lat"], record["target_lon"])
        edges.append((record["source"], record["target"], record["airline"]))
      return nodes, edges
