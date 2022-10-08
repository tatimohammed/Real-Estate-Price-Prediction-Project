# Libraries required
import pickle
from flask import Flask, request, jsonify
import numpy as np
import json

# Application instance
app = Flask(__name__)

# Opening the columns JSON file and the PICKLE file
with open('./rsc/columns.json', 'r') as f:
    data_cols = json.load(f)['data_cols']
    _location = data_cols[3:]

with open('./rsc/Real Estate Price Prediction.pickle', 'rb') as f:
    _model = pickle.load(f)


# A function to return all the locations that we have
@app.route('/get_location')
def get_location():
    # Converting the location JSON file to a response
    response = jsonify({
        'locations': _location
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# A function to predict the house price
def predict_price(location, total_sq_ft, bhk, bath):
    try:
        # Finding the location in our JSON dict and getting the feature index
        loc_index = data_cols.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(data_cols))
    x[0] = total_sq_ft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    return round(_model.predict([x])[0], 2)


# A function to return the price predicted for a house
@app.route('/predict_price', methods=['POST'])
def get_price():
    total_sq_ft = float(request.form['total_sq_ft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])

    # Converting the price JSON file to a response
    response = jsonify({
        'price_predicted': predict_price(location, total_sq_ft, bhk, bath)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


if __name__ == "__main__":
    app.run()
