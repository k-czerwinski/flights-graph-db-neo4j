from flask import Flask, request, jsonify
from flask_cors import CORS
from models.airport import Airport
from models.route import Route
from services.database_service import DatabaseService
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
db_service = DatabaseService(
    db_url=os.getenv("DATABASE_URL"),
    db_user=os.getenv("DATABASE_USER"),
    db_pass=os.getenv("DATABASE_PASSWORD"),
)

@app.route('/airports', methods=['GET'])
def list_airports():
    country = request.args.get("country")
    airports = db_service.get_all_airports(
        "" if country is None else str(country)
    )
    return jsonify([airport.__dict__ for airport in airports])


@app.route('/routes', methods=['GET'])
def list_routes():
    dest_iata = request.args.get("dest")
    source_iata = request.args.get("source")
    routes = db_service.get_all_routes(
        "" if source_iata is None else str(source_iata),
        "" if dest_iata is None else str(dest_iata))
    return jsonify([route.__dict__ for route in routes])


@app.route('/airport', methods=['POST'])
def add_airport():
    """Add a new airport."""
    data = request.json
    try:
        airport = Airport(
            latitude=float(data["latitude"]),
            longitude=float(data["longitude"]),
            altitude=float(data["altitude"]),
            city=str(data["city"]),
            country=str(data["country"]),
            IATA=str(data["IATA"]),
            ICAO=str(data["ICAO"]),
            name=str(data["name"])
        )
        db_service.add_node(airport)
        return jsonify({"status": "success", "message": f"Airport {airport.IATA} added successfully!"})
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route('/route', methods=['POST'])
def add_route():
    data = request.json
    try:
        source_airport_IATA = data["sourceIATA"]
        dest_airport_IATA = data["destinationIATA"]
        airline_code = data["airlineCode"]
        db_service.add_route(source_airport_IATA, dest_airport_IATA, airline_code)
        return jsonify({"status": "success", "message": f"Route {source_airport_IATA} -> {dest_airport_IATA} with airline {airline_code} added successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route('/visualise-routes-from/airport/<airport_iata>', methods=['GET'])
def routes_from_airport_visualization(airport_iata):
    nodes, edges = db_service.get_routes_from_graph(airport_iata)
    graph_data = {
        "nodes": [{"id": node, "lat": coords[0], "lon": coords[1]} for node, coords in nodes.items()],
        "edges": [{"from": edge[0], "to": edge[1], "airline": edge[2]} for edge in edges]
    }

    # Return data as JSON
    return jsonify(graph_data)

@app.route('/airport/<string:airport_iata>', methods=['DELETE'])
def delete_airport(airport_iata):
    try:
        db_service.delete_node(airport_iata)
        return jsonify({"message": f"Airport {airport_iata} and all associated routes deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/route', methods=['DELETE'])
def delete_route():
    source_IATA = request.args.get("source_IATA")
    destination_IATA = request.args.get("destination_IATA")
    airline_code = request.args.get("airline_code")

    if not (source_IATA and destination_IATA and airline_code):
        return jsonify({"error": "Missing required parameters: source_IATA, destination_IATA, airline_code"}), 400

    try:
        db_service.delete_route(Route(
            destination_IATA=destination_IATA,
            source_IATA=source_IATA,
            airline_code=airline_code
        ))
        return jsonify({"message": f"Route from {source_IATA} to {destination_IATA} via {airline_code} deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
