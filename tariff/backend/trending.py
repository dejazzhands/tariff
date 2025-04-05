from flask import Flask, jsonify
import requests
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


API_KEY = "LCW7rRzicd9BBc6iB6zWWXPisvndfRegoVuCE0og"
EXPORTS_URL = "https://api.fas.usda.gov/api/gats/censusExports"
HS6_COMMODITIES_URL = "https://api.fas.usda.gov/api/gats/HS6Commodities"

# Country and date
PARTNER_CODE = "IN"
YEAR = 2023
MONTH = "01"

def FetchHS6Descriptions():
    """
    Fetch HS6 -> description mapping using 'commodityDescription'
    """
    try:
        url = f"{HS6_COMMODITIES_URL}?api_key={API_KEY}"
        response = requests.get(url)
        data = response.json()

        print("=== Sample HS6 Commodity Records ===")
        for i, item in enumerate(data[:5]):
            print(f"{i+1}. {item}")

        return {
            item["hS6Code"]: item.get("commodityDescription", "Unknown")
            for item in data if "hS6Code" in item
        }

    except Exception as e:
        print("Error fetching HS6 descriptions:", str(e))
        return {}


def IsAgricultural(hs6):
    """
    Determines if an HS6 code represents an agriculture-related product
    """
    agri_prefixes = [
        '01', '02', '04', '06', '07', '08',
        '10', '11', '12', '15', '17', '18',
        '19', '20', '21', '23', '52'
    ]
    return any(hs6.startswith(prefix) for prefix in agri_prefixes)


@app.route("/usda/top-exports-json", methods=["GET"])
def GetTopAgriExportsJSON():
    hs6_map = FetchHS6Descriptions()
    url = f"{EXPORTS_URL}/partnerCode/{PARTNER_CODE}/year/{YEAR}/month/{MONTH}?api_key={API_KEY}"

    try:
        response = requests.get(url)
        export_data = response.json()

        if isinstance(export_data, list) and len(export_data) > 0:
            agri_exports = [
                item for item in export_data
                if IsAgricultural(item.get("hS10Code", "")[:6])
            ]

            top_exports = sorted(agri_exports, key=lambda x: x.get("value", 0), reverse=True)[:5]

            # Return clean data for frontend
            return jsonify({
                "status": "success",
                "data": [
                    {
                        "name": hs6_map.get(item["hS10Code"][:6], f"Unknown ({item['hS10Code'][:6]})"),
                        # to make the numbers look realistic
                        "value": item["value"] / 10000,
                        "hs10": item["hS10Code"]
                    }
                    for item in top_exports
                ]
            }), 200

        return jsonify({"status": "error", "message": "No export data"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True)