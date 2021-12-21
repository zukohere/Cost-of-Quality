var thickness = 10

let data2 = {
    "nodes": [
      { "name": "Preventive (Design)", "index": 0, "cost": 100},
      { "name": "Manufacture", "index": 0 , "cost": 100},
      // { "name": "Incoming Inspect", "index": 1 },
      { "name": "Manufacturing Inspect", "index": 1 , "cost": 100},
      { "name": "Rework", "index": 1 , "cost": 100},
      { "name": "Customer", "index": 2 , "cost": 100},
      { "name": "Scrap" , "index": 4, "cost": 100},
      { "name": "Good Quality" , "index": 4, "cost": 100},
      { "name": "Return", "index": 6 , "cost": 100},
      { "name": "Field Scrap", "index": 7 , "cost": 100}
    ],
    "links": [
      { "source": "Preventive (Design)", "target": "Manufacture", "value": thickness,"units": 100, "optimal": "yes", "level": 0},

      // { "source": "Incoming Inspect", "target": "Scrap", "value": thickness,"units": 40, "optimal": "yes", "level": 1},
      // { "source": "Incoming Inspect", "target": "Manufacture", "value": thickness,"units": 60, "optimal": "yes", "level": 1},
      
      
      { "source": "Manufacture", "target": "Manufacturing Inspect", "value": thickness,"units": 100, "optimal": "yes", "level": 1},

      { "source": "Manufacturing Inspect", "target": "Customer", "value": thickness,"units": 80, "optimal": "yes" , "level": 2},
      { "source": "Manufacturing Inspect", "target": "Rework", "value": thickness,"units": 10, "optimal": "no" , "level": 2},
      { "source": "Manufacturing Inspect", "target": "Scrap", "value": thickness,"units": 10, "optimal": "yes" , "level": 2},

      { "source": "Rework", "target": "Customer", "value": thickness,"units": 75, "optimal": "no" , "level": 3},
      { "source": "Rework", "target": "Scrap", "value": thickness,"units": 25, "optimal": "no" , "level": 3},

      { "source": "Customer", "target": "Good Quality", "value": thickness,"units": 80, "optimal": "no" , "level": 4},
      { "source": "Customer", "target": "Field Scrap", "value": thickness,"units": 5, "optimal": "yes" , "level": 4},
      { "source": "Customer", "target": "Return", "value": thickness,"units": 15, "optimal": "yes" , "level": 4}

      // { "source": "Return", "target": "Manufacturing Inspect", "value": 100, "optimal": "yes" , "level": 6}
      
    ]
  };