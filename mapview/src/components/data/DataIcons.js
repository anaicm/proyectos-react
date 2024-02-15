const geojson = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {
          'imagen':'imagen1',
          'message': 'Foo',
          'iconSize': [100, 100]
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [-66.324462, -16.024695]
        }
      },
      {
        'type': 'Feature',
        'properties': {
          'imagen':'imagen2',
          'message': 'Bar',
          'iconSize': [60, 60]
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [-61.21582, -15.971891]
        }
      },
      {
        'type': 'Feature',
        'properties': {
          'imagen':'imagen3',
          'message': 'Baz',
          'iconSize': [50, 50]
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [-63.292236, -18.281518]
        }
      }
    ]
  };
  
  export default geojson;
  