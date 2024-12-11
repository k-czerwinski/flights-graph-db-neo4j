class Airport:
    def __init__(self, latitude, longitude, altitude, city, country, IATA, ICAO, name):
        self.latitude = latitude
        self.longitude = longitude
        self.altitude = altitude
        self.city = city
        self.country = country
        self.IATA = IATA
        self.ICAO = ICAO
        self.name = name

    def is_valid(self):
        return type(self.latitude) == float and type(self.longitude) == float and type(self.IATA) == str and type(self.ICAO) == str and len(str(self.IATA)) == 3 and len(str(self.ICAO)) == 4
